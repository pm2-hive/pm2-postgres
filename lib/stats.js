var pmx = require('pmx');

var metrics = {};
var REFRESH_RATE = 10000; // ms
var probe = pmx.probe();

// Init metrics with default values
function initMetrics() {
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
}

// Refresh metrics
function refreshMetrics(pgClient) {
  refreshTableCount(pgClient);
  refreshIndexCount(pgClient);
  refreshTransactionMetrics(pgClient);
}

function refreshTableCount(pgClient) {
  var queryString = "SELECT count(1) as relations FROM pg_class WHERE relkind IN ('r', 't');";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Table Query Error: " + err);
    }

    // # of Tables
    metrics.tableCount.set(results.rows[0].relations);
  });
}

function refreshIndexCount(pgClient) {
  var queryString = "SELECT count(1) as indexes FROM pg_class WHERE relkind = 'i';";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Index Query Error: " + err);
    }

    // # of Indexes
    metrics.indexCount.set(results.rows[0].indexes);
  });
}

function refreshTransactionMetrics(pgClient) {
  var queryString = "SELECT sum(xact_commit) AS transactions_committed,"
    + " sum(xact_rollback) AS transactions_rollback, sum(blks_read) AS blocks_read,"
    + " sum(blks_hit) AS blocks_hit, sum(tup_returned) AS tuples_returned,"
    + " sum(tup_fetched) AS tuples_fetched, sum(tup_inserted) AS tuples_inserted,"
    + " sum(tup_updated) AS tuples_updated, sum(tup_deleted) AS tuples_deleted"
    + " FROM pg_stat_database;";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Transaction Query Error: " + err);
    }

    // Transactions Committed
    metrics.transactionsCommitted.set(results.rows[0].transactions_committed);

    // Transactions Rollback
    metrics.transactionsRollback.set(results.rows[0].transactions_rollback);

    // Tuples Fetched
    metrics.tuplesFetched.set(results.rows[0].tuples_fetched);   
     
    // Tuples Inserted
    metrics.tuplesInserted.set(results.rows[0].tuples_inserted);
    
    // Tuples Updated
    metrics.tuplesUpdated.set(results.rows[0].tuples_updated);

    // Tuples Deleted
    metrics.tuplesDeleted.set(results.rows[0].tuples_deleted);
  });
}

function init(pgClient) {
  initMetrics();
  setInterval(refreshMetrics.bind(this, pgClient), REFRESH_RATE);
}

module.exports.init = init;
