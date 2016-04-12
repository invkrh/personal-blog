---
title: Spark Learning Notes
---

### Architecture Settings

#### Master
Decide and schedule *where* an executor should run

#### Worker
After receiving the command from Master, a worker just starts a executor JVM, that's all what worker does, that's why worker doesn't need that much memory.

#### Executor
* In standalone mode
  - one worker can not start two executors for the same application.
  - Multi apps makes one worker have multiple executor.
  - If you really want 2 executors running on one machine, you must have 2 workers (set `SPAKR_WORKER_INSTANCES`)
  - You can not say # of executors you want to start. You can only say # of cores across the cluster for the application

* In yarn mode
  - You can specify # of executors you want to run

#### Internal thread
Used for shuffle. If no shuffle, they are in wait status

#### Availability
* When a executor crashes, a worker will restart it.
* When a worker crashes, a master will restart it.
* Make driver high available with `--supervise` tag, then spark master will restart the driver.
* If driver is restarted, all the executors will be restarted.
* Multi masters for spark cluster based on zookeeper.

Notes:
DataStax use System Table in C* in order not to use zookeeper (jusr keep their code base clean)


### Configuration

* `SPARK_LOCAL_DIRS` some mount point of disk, mainly for persistence (`MEM_AND_DISK`) and intermediate shuffle data
* `SPAKR_WORKER_INSTANCES` # of work to run on each machine
* `SPARK_WORKER_CORES` # cores a worker can gives out to his underlying executor**s**
* `SPARK_WORKER_MEMORY` total memory a worker can gives out to his underlying executor**s**
* `SPARK_DAEMON_MEMORY` Memory to allocate to master and worker daemons themselves

* `spark.cores.max` maximum amount of CPU cores to request for the application from across the cluster

Note:
Configuration overwritten order:
conf in source code > spark submit > spark_env spark-default files > spark source code

Check webui to know which conf take effect

### WebUI
* Cached rdd (deserialized) will be 2-3X larger than the underlying data size which is cause by JVM overhead.
