var pmx = require('pmx');
var pgClientFactory = require('./lib/clientFactory.js');
var pgStats = require('./lib/stats.js');
var pgActions = require('./lib/actions.js');

pmx.initModule({

  pid: pmx.resolvePidPaths(['/var/run/postgresql/9.4-main.pid', '/var/run/postgresql/9.3-main.pid']),

  // Options related to the display style on Keymetrics
  widget: {

    // Logo displayed
    logo: 'http://www.inquidia.com/sites/default/files/postgresql_logo%5B1%5D.png',

    // Module colors
    // 0 = main element
    // 1 = secondary
    // 2 = main border
    // 3 = secondary border
    theme: ['#141A1F', '#222222', '#FC6400', '#807C7C'],

    // Section to show / hide
    el: {
      probes: true,
      actions: true
    },

    // Main block to show / hide
    block: {
      actions: true,
      issues: true,
      meta: true,

      // Custom metrics to put in BIG
      main_probes: ['Tables', 'Indexes','Total Tables Size','Backends Active','Exclusive Locks']
    }

  }

}, function (err, conf) {
  var pgClient = pgClientFactory.build(conf);

  // Init metrics refresh loop
  pgStats.init(pgClient);

  // Init actions
  pgActions.init(pgClient);
});
