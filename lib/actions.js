var pmx = require('pmx');
var _ = require('lodash');

function initActions(pgClient) {

  // List DBs
  pmx.action('List DBs', function (reply) {
    var queryString = "SELECT datname FROM pg_database WHERE datistemplate = false;"
    pgClient.query(queryString, function (err, results) {
      if (err) {
        return reply(err);
      }

      reply(_.pluck(results.rows,'datname'));
    })
  });

  // Show Settings
  pmx.action('Show Settings', function (reply) {
    var queryString = "SHOW ALL;";
    pgClient.query(queryString, function (err, results) {
      if (err) {
        return reply(err);
      }

      reply(results.rows);
    })
  });


}

function init(pgClient) {
  initActions(pgClient);
}

module.exports.init = init;