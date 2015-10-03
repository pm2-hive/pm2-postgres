var pg = require('pg');
var pmx = require('pmx');

function build(conf) {
  var pgClient = {};

  var connectionString = "postgres://" + conf.username + ":" + conf.password + "@" + conf.hostname + ":" + conf.port + "/" + conf.database;

  pgClient.query = function (queryString, cb) {
    pg.connect(connectionString, function (err, client, done) {
      if (err) {
        // A connection error occurred, remove the client from the connection pool.
        if (client) {
          done(client);
        }
        return pmx.notify("Couldn't connect to postgres: " + err);
      }

      client.query(queryString, function (err, result) {
        if (err) {
          // return client to the connection pool
          done();
          return cb(err);
        }

        // return client to the connection pool
        done();
        return cb(null, result);
      });
    });
  };

  return pgClient;
}

module.exports.build = build;