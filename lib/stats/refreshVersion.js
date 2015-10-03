var pmx = require('pmx');

module.exports = function refreshVersion(metrics, pgClient) {
  var queryString = "SELECT version();";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Version Query Error: " + err);
    }

    // # of Indexes
    var fullVersion = results.rows[0].version;
    var match = fullVersion.match(/^PostgreSQL (\d(?:(\.\d\d?)+))/);
    if (match) {
      metrics.version.set(match[1]);
    }
  });
};