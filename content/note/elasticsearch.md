---
title: Elasticsearch Learning Notes
---

## Basics

* Data Hirarchy: `index`/`type`/`document`
* one index = * shards (partition)
* replics (shards): 
  1. fault tolerance
  2. improve throughput
* rules:
  - Each index can be split into multiple shards. 
  - An index can also be replicated zero (meaning no replicas) or more times. 
  - Once replicated, each index will have primary shards (the original shards that were replicated from) and replica shards (the copies of the primary shards). 
  - The number of shards and replicas can be defined per index **at the time the index is created**. After the index is created, you may change the number of replicas dynamically anytime but **you cannot change the number shards after-the-fact**
  - By default: 5 primary shards and 1 replicas per primary shard (10 shards in all)
  
## Command List

### Pattern
  ```bash
  curl -X<REST Verb> <Node>:<Port>/<Index>/<Type>/<ID>
  ```
### Info
* Show health 
  ```bash
  curl 'localhost:9200/_cat/health?v'
  ```
  **Notes:**
  - Green: everything is good (cluster is fully functional)
  - Yellow: all data is available but some replicas are not yet allocated (cluster is fully functional)
  - Red: some data is not available for whatever reason. (cluster partially functional)

* Show nodes: 
  ```bash
  curl 'localhost:9200/_cat/nodes?v'
  ```
  
* Show indices:
  ```bash
  curl 'localhost:9200/_cat/indices?v'
  ```
  
* Create index
  ```bash
  curl -XPUT 'localhost:9200/<index_name>?pretty'
  ```
  
* Delete an index
  ```bash
  curl -XDELETE 'localhost:9200/<index_name>?pretty'
  ```
  
* Add a document
  ```bash
  curl -XPUT 'localhost:9200/<index_name>/<type_name>/<id>?pretty' -d '
  {
    "name": "John Doe"
  }'
  ```

  **Notes:**
  * Elasticsearch will automatically create the customer index if it didn’t already exist beforehand
  * `PUT` document with same id will replace the old one
  * If `id` is not specified, ES will generate one for you

* Retrieve document
  ```bash
  curl -XGET 'localhost:9200/<index_name>/<type_name>/<id>?pretty'
  ```

* Update a document
  ```bash
  # new value
  curl -XPOST 'localhost:9200/<index_name>/<type_name>/<id>/_update?pretty' -d '
  {
    "doc": { "name": "Jane Doe" }
  }'

  # add field
  curl -XPOST 'localhost:9200/<index_name>/<type_name>/<id>/_update?pretty' -d '
  {
    "doc": { "name": "Jane Doe", "age": 20 }
  }'

  # update by script
  curl -XPOST 'localhost:9200/<index_name>/<type_name>/<id>/_update?pretty' -d '
  {
    "script" : "ctx._source.age += 5"
  }'
  ```

* Delete a document
  ```bash
  curl -XDELETE 'localhost:9200/<index_name>/<type_name>/<id>?pretty'
  ```

  **Note:**
  The `delete-by-query` plugin can delete all documents matching a specific query.

* Batch processing
  ```bash
  curl -XPOST 'localhost:9200/customer/external/_bulk?pretty' -d '
  {"index":{"_id":"1"}}
  {"name": "John Doe" }
  {"index":{"_id":"2"}}
  {"name": "Jane Doe" }
  '

  curl -XPOST 'localhost:9200/customer/external/_bulk?pretty' -d '
  {"update":{"_id":"1"}}
  {"doc": { "name": "John Doe becomes Jane Doe" } }
  {"delete":{"_id":"2"}}
  '
  ```

  **Notes:**
  - The bulk API executes all the actions sequentially and in order. 
  - If a single action fails for whatever reason, **it will continue to process the remainder of the actions after it.** 
  - When the bulk API returns, it will provide a status for each action (**in the same order it was sent in**)

* Load a dataset
  ```bash
  curl -XPOST 'localhost:9200/bank/account/_bulk?pretty' --data-binary "@accounts.json"
  ```

* Get Mapping
  ```bash
  curl -XGET 'http://localhost:9200/<index>/_mapping/<type>'
  ```

* Push Mapping
  ```bash
  curl -XPUT 'http://localhost:9200/<index>/_mapping/<type>' -d @mapping.json
  ```

### Search

* Basic
  ```bash
  curl 'localhost:9200/bank/_search?q=*&pretty'
  ```

* Search with body
  ```bash
  curl -XPOST 'localhost:9200/bank/_search?pretty' -d '
  {
    "query": { "match_all": {} },
    "from": 10,
    "size": 10,
    "sort": { "balance": { "order": "desc" } }
  }'
  ```

  **Notes:**
  Elasticsearch is completely done with the request and does not maintain any kind of server-side resources or open cursors into your results.
  
  There are some difference between URI search and json query search, the following queries do the same thing, except for the first one, you need to encode URI for special character, like in french: à, é, ç, è, ù, ô, etc.
  
  ```bash
  curl -XGET 'localhost:9200/platform_test/ad_master/_search?analyzer=french&q=body:d%C3%A9corer&pretty'

  curl -XGET 'localhost:9200/platform_test/ad_master/_search?pretty' -d '
  {
    "query": {
      "query_string": {
        "query": "body:décorer"
      }
    }
  }'
  ```
  
* Instead of returning the full document, selection fields needed is possible via `_source`
  ```bash
  curl -XPOST 'localhost:9200/bank/_search?pretty' -d '
  {
    "query": { "match_all": {} },
    "_source": ["account_number", "balance"]
  }'
  ```
  
* Match query
  ```bash
  "query": { "match": { "address": "mill" } } # Address containing `mill`
  "query": { "match": { "address": "mill lane" } } # Address containing `mill` or `lane`
  "query": { "match_phrase": { "address": "mill lane" } } # Address containing `mill lane`
  ```
  
* Boolean query
  ```bash
  "query": {
    "bool": {
      "must": [
        { "match": { "address": "mill" } },
        { "match": { "address": "lane" } }
      ]
    }
  }
  ```
  
  `must`: all of the `match`es be true
  `should`: one of the `match`es be true
  `must_not`: none of the `match`es be true
  `should_not`: none of the `match`es be true

  Also, you can combine boolean queries
  ```bash
  "query": {
    "bool": {
      "must": [
        { "match": { "age": "40" } }
      ],
      "must_not": [
        { "match": { "state": "ID" } }
      ]
    }
  }
  ```

* Filter query
  ```bash
  "query": {
      "bool": {
        "must": { "match_all": {} },
        "filter": {
          "range": {
            "balance": {
              "gte": 20000,
              "lte": 30000
            }
          }
        }
      }
    }
  ```

  **Note:**
  `filter` will not change how scores are computed

* Aggregation

  `SELECT state, COUNT(*) FROM bank GROUP BY state ORDER BY COUNT(*) DESC`

  ```bash
  curl -XPOST 'localhost:9200/bank/_search?pretty' -d '
  {
    "size": 0,
    "aggs": {
      "group_by_state": {
        "terms": {
          "field": "state"
        }
      }
    }
  }'
  ```  

  **Notes:**
  `"size": 0,` only show aggregation results

  ```bash
  "aggs": {
     "group_by_state": {
       "terms": {
         "field": "state",
         "order": {
           "average_balance": "desc"
         }
       },
       "aggs": {
         "average_balance": {
           "avg": {
             "field": "balance"
           }
         }
       }
     }
   }
  ``` 

  ```bash
  "aggs": {
      "group_by_age": {
        "range": {
          "field": "age",
          "ranges": [
            {
              "from": 20,
              "to": 30
            },
            {
              "from": 30,
              "to": 40
            },
            {
              "from": 40,
              "to": 50
            }
          ]
        },
        "aggs": {
          "group_by_gender": {
            "terms": {
              "field": "gender"
            },
            "aggs": {
              "average_balance": {
                "avg": {
                  "field": "balance"
                }
              }
            }
          }
        }
      }
    }
  ```

## Mapping

Each document in an index has a type. Every type has its own mapping, or schema definition. A mapping defines the fields within a type, the datatype for each field, and how the field should be handled by Elasticsearch. A mapping is also used to configure metadata associated with the type.

The two most important mapping attributes for string fields are index and analyzer
* index

  The index attribute controls how the string will be indexed. It can contain one of three values:

  - analyzed
  First analyze the string and then index it. In other words, index this field as full text.
  
  - not_analyzed
  Index this field, so it is searchable, but index the value exactly as specified. Do not analyze it.
  
  - no
  Don’t index this field at all. This field will not be searchable.

* analyzer

  For analyzed string fields, use the analyzer attribute to specify which analyzer to apply both at search time and at index time. By default, Elasticsearch uses the standard analyzer, but you can change this by specifying one of the built-in analyzers, such as whitespace, simple, or english:

`Mapping type` contains:
- Meta-fields
- Fields (properties)

### Field datatypes
* A string field could be indexed as an analyzed field for full-text search, and as a not_analyzed field for sorting or aggregations.
* You could index a string field with the standard analyzer, the english analyzer, and the french analyzer.
* Existing type and field mappings cannot be updated. Changing the mapping would mean invalidating already indexed documents. Instead, you should create a new index with the correct mappings and reindex your data into that index.

* Fields with:
  - the same name
  - in the same index
  - in different mapping types
  - map to the same field internally,
  - and **must have the same mapping**.

* Analyser:
  - This analysis process needs to happen not just at index time, but also at query time: the query string needs to be passed through the same (or a similar) analyzer so that the terms that it tries to find are in the same format as those that exist in the index.

  Notes:
  Analyzers can be specified per-query, per-field or per-index. At index time, Elasticsearch will look for an analyzer in this order:

  * The analyzer defined in the field mapping.
  * An analyzer named default in the index settings.
  * The standard analyzer.
    
  At query time, there are a few more layers:

  * The analyzer defined in a full-text query.
  * The search_analyzer defined in the field mapping.
  * The analyzer defined in the field mapping.
  * An analyzer named default_search in the index settings.
  * An analyzer named default in the index settings.
  * The standard analyzer.
  
## Analysis and Analyzers

### Analysis

* First, tokenizing a block of text into individual terms suitable for use in an inverted index,
* Then normalizing these terms into a standard form to improve their “searchability,” or recall

### Analyzers

* Character filters

  First, the string is passed through any character filters in turn. Their job is to tidy up the string before tokenization. A character filter could be used to strip out HTML, or to convert & characters to the word and.
* Tokenizer

  Next, the string is tokenized into individual terms by a tokenizer. A simple tokenizer might split the text into terms whenever it encounters whitespace or punctuation.
* Token filters

  Last, each term is passed through any token filters in turn, which can change terms (for example, lowercasing Quick), remove terms (for example, stopwords such as a, and, the) or add terms (for example, synonyms like jump and leap).

**Notes:**
when we search on a full-text field, we need to pass the query string through the same analysis process, to ensure that we are searching for terms in the same form as those that exist in the index.

### fielddata

Loading fielddata is an expensive process so, once it has been loaded, it remains in memory for the lifetime of the segment.

This data structure is built on demand the **first time** that a field is used for aggregations, sorting, or is accessed in a script. It is built by reading the entire inverted index for each segment from disk, inverting the term ↔︎ document relationship, and storing the result in memory, in the JVM heap.

### doc_values

Doc values are the on-disk data structure, built at document index time, which makes this data access pattern possible. They store the same values as the _source but in a column-oriented fashion that is way more efficient for sorting and aggregations. Doc values are supported on almost all field types, with the notable exception of analyzed string fields.

All fields which support doc values have them enabled by default. If you are sure that you don’t need to sort or aggregate on a field, or access the field value from a script, you can disable doc values in order to save disk space:

## Things to remember

the biggest difference is between fields that represent exact values (which can include string fields) and fields that represent full text. This distinction is really important—it’s the thing that separates a search engine from all other databases.

Data in Elasticsearch can be broadly divided into two types: exact values and full text.

* Exact values are exactly what they sound like. Examples are a date or a user ID, but can also include exact strings such as a username or an email address. The exact value Foo is not the same as the exact value foo. The exact value 2014 is not the same as the exact value 2014-09-15.

* Full text, on the other hand, refers to textual data—usually written in some human language — like the text of a tweet or the body of an email.

You can find only terms that exist in your index, so both the indexed text and the query string must be normalized into the same form. This process of tokenization and normalization is called analysis.

