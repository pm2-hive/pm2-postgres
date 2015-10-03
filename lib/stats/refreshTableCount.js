var pmx = require('pmx');

module.exports = function refreshTableCount(metrics, pgClient) {
  var queryString = "SELECT count(1) as relations FROM pg_class WHERE relkind IN ('r', 't');";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Table Query Error: " + err);
    }

    // # of Tables
    metrics.tableCount.set(results.rows[0].relations);
  });
};