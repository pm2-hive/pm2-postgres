var pmx = require('pmx');
var humanize = require('humanize');

module.exports = function refreshTablesSize(metrics, pgClient) {
  var queryString = "SELECT ((sum(relpages)* 8) * 1024) AS size_relations FROM pg_class WHERE relkind IN ('r', 't');";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Table Size Query Error: " + err);
    }

    // Total Tables Size
    metrics.tablesSize.set(humanize.filesize(results.rows[0].size_relations));
  });
};