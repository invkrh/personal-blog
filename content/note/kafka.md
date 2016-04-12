---
title: Kafka Learning Notes
---

### Consumer
* New Kafka consumer API:
* security SSL/SASL
* group management protocol on top of Kafka (not ZooKeeper any more)
* It does not depend on kafka core

### Consumer group
* a set of consumers which cooperate to consume data from some topics.

### Group rebalancing
* As new group members arrive and old members leave, the partitions are re-assigned so that each member receives a proportional share of the partitions.

### Coordinator
* The coordinator(a broker) maintains
* the current members of the group (join and leave)
* their partition assignments

### Join
* When the consumer starts up, it finds the coordinator and sends a request to join the group. The coordinator then rebalances the partitions between all current member of the group and the new member. Every rebalance results in a new generation of the group.

### Leave
* Each member send heartbeats to the coordinator. If no heartbeat is received before expiration of the configured session timeout, the member will be removed from the group and reassign its partitions to another member.

### Offset Management
* After the consumer receives its assignment from the coordinator, it must determine the initial position for each assigned partition. Initially the position is set according to a configurable offset reset policy. Typically, the earliest offset or the latest offset.

### Offset commit
* As a consumer in the group reads messages from the partitions assigned by the coordinator, it must commit the offsets corresponding to the messages it has read.
* If the consumer crashes or is shutdown, its partitions will be re-assigned to another member, which will begin consumption from the last committed offset of each partition.
* If the consumer crashes before any offset has been committed, then the consumer which takes over its partitions will use the reset policy.

### Commit policy (trade off)
* Automatic: triggers a commit on a periodic interval
* Manuel: commit API

### Configuration
* Core
  - bootstrap.servers
  - client.id
* Group
  - group.id
  - session.timeout.ms (default: 30)
  - heartbeat.interval.ms (default: 3)
* Offset Management
  - enable.auto.commit (default: true)
  - auto.commit.interval.ms (default: 5)
  - auto.offset.reset (default: latest)

### Basic Poll Loop
* poll()
* subscribe() a subject




### Producer
* 4 nodes in the cluster
* set ` unclean.leader.election.enable` to `false` in the brokers configuration
* replication factor for the topics – 3
* `min.insync.replicas=2` property in topic configuration
* `ack=all` property in the producer configuration
* `block.on.buffer.full=true` property in the producer configuration

A typical scenario would be to create a topic with a replication factor of 3, set `min.insync.replicas` to 2, and produce with `request.required.acks` of -1. This will ensure that the producer raises an exception if a majority of replicas do not receive a write.

Setting `unclean.leader.election.enable` to `false` indicates whether to enable replicas not in the ISR set to be elected as leader as a last resort, even though doing so may result in data loss

`replica.lag.max.messages`
`replica.lag.time.max.ms`
