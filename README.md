# pm2-postgres
PostgreSQL module for Keymetrics

![pm2-postgres screenshot](https://raw.githubusercontent.com/pm2-hive/pm2-postgres/master/pm2-postgres.jpg)

## Description

PM2 module to monitor key PostgreSQL server metrics:

* Tables / Indexes Count
* Backends Active / Idle
* Exclusive / Access Share Locks
* Total Tables Size
* Transactions Committed / Rollback
* Tuples Fetched / Updated / Inserted / Deleted

## Requirements

This module requires a PostgreSQL install (tested against v9.4).

## Install

```bash
$ npm install pm2 -g

$ pm2 install pm2-postgres
```

## Config

The default connection details are :    
"hostname": "localhost"  
"port": 5432  
"username": "guest"  
"password": "guest"  
"database": "postgres"  

To modify the config values you can use the commands:
```bash
$ pm2 set pm2-postgres:hostname localhost
$ pm2 set pm2-postgres:port 5432
$ pm2 set pm2-postgres:username guest
$ pm2 set pm2-postgres:password guest
$ pm2 set pm2-postgres:database postgres
```

## Uninstall

```bash
$ pm2 uninstall pm2-postgres
```

# License

MIT
