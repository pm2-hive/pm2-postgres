var pmx = require('pmx');

var refreshTableCount = require('./stats/refreshTableCount');
var refreshIndexCount = require('./stats/refreshIndexCount');
var refreshTransactionMetrics = require('./stats/refreshTransactionMetrics');
var refreshTablesSize = require('./stats/refreshTablesSize');
var refreshBackendMetrics = require('./stats/refreshBackendMetrics');
var refreshLockCount = require('./stats/refreshLockCount');
var refreshVersion = require('./stats/refreshVersion');

var metrics = {};
var REFRESH_RATE = 10000; // ms
var probe = pmx.probe();

// Init metrics with default values
function initMetrics() {
  metrics.version = probe.metric({
    name: 'PostgreSQL Version',
    value: 'N/A'
  });
  metrics.tableCount = probe.metric({
    name: 'Tables',
    value: 'N/A'
  });
  metrics.indexCount = probe.metric({
    name: 'Indexes',
    value: 'N/A'
  });
  metrics.transactionsCommitted = probe.metric({
    name: 'Transactions Committed',
    value: 'N/A'
  });
  metrics.transactionsRollback = probe.metric({
    name: 'Transactions Rollback',
    value: 'N/A'
  });
  metrics.tuplesFetched = probe.metric({
    name: 'Tuples Fetched',
    value: 'N/A'
  });
  metrics.tuplesInserted = probe.metric({
    name: 'Tuples Inserted',
    value: 'N/A'
  });
  metrics.tuplesUpdated = probe.metric({
    name: 'Tuples Updated',
    value: 'N/A'
  });
  metrics.tuplesDeleted = probe.metric({
    name: 'Tuples Deleted',
    value: 'N/A'
  });
  metrics.tablesSize = probe.metric({
    name: 'Total Tables Size',
    value: 'N/A'
  });
  metrics.backendsActive = probe.metric({
    name: 'Backends Active',
    value: 'N/A'
  });
  metrics.backendsIdle = probe.metric({
    name: 'Backends Idle',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 8,
      msg: 'Too many Idle Backends',
      cmp: ">"
    }
  });
  metrics.accessShareLockCount = probe.metric({
    name: 'Access Share Locks',
    value: 'N/A'
  });
  metrics.exclusiveLockCount = probe.metric({
    name: 'Exclusive Locks',
    value: 'N/A',
    alert: {
      mode: 'threshold-avg',
      value: 500,
      msg: 'Too many Exclusive Locks',
      cmp: ">"
    }
  });
}

// Refresh metrics
function refreshMetrics(pgClient) {
  refreshTableCount(metrics, pgClient);
  refreshIndexCount(metrics, pgClient);
  refreshTransactionMetrics(metrics, pgClient);
  refreshTablesSize(metrics, pgClient);
  refreshBackendMetrics(metrics, pgClient);
  refreshLockCount(metrics, pgClient);
}

function init(pgClient) {
  initMetrics();
  setInterval(refreshMetrics.bind(this, pgClient), REFRESH_RATE);
  refreshVersion(metrics,pgClient);
}

module.exports.init = init;
