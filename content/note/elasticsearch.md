---
title: Elasticsearch Learning Notes
---

# Basics

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
  
# Command List

## Pattern
  ```bash
  curl -X<REST Verb> <Node>:<Port>/<Index>/<Type>/<ID>
  ```
## Info
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

## Search

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
