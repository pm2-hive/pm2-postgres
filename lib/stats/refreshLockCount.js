var pmx = require('pmx');
var _ = require('lodash');

module.exports = function refreshLockCount(metrics, pgClient) {
  var queryString = "SELECT mode, count(mode) AS count FROM pg_locks GROUP BY mode ORDER BY mode;";
  pgClient.query(queryString, function (err, results) {
    if (err) {
      return pmx.notify("Lock Query Error: " + err);
    }

    // # of Access Share Locks
    var accessShareLockCount = _.get(_.findWhere(results.rows, {mode: 'AccessShareLock'}), 'count', 'N/A');
    metrics.accessShareLockCount.set(accessShareLockCount);

    // # of Exclusive Locks
    var exclusiveLockCount = _.get(_.findWhere(results.rows, {mode: 'ExclusiveLock'}), 'count', 'N/A');
    metrics.exclusiveLockCount.set(exclusiveLockCount);
  });
};