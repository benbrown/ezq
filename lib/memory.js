var debug=require('debug')('q:memory');;
var qs = {};
var workers = {};
var CONFIG = {
  interval: 100,
}

module.exports = function(_config) {

  var api = {

    exists: function(q) {
        return typeof(qs[q])!='undefined';
    },
    create: function(q) {
        if (!qs[q]) {
            debug('create',q);
            qs[q] = [];
            if (!workers[q]) {
              workers[q] = { working: 0, options: {maxWorkers: 0} };
            }
        }
    },
    add: function(q, thing, next) {
      if (!api.exists(q)) {
          api.create(q);
      }
      qs[q].push(thing);
      next(q, thing);
    },
    work: function(q, worker, options, next) {
      workers[q] = {
        handler: worker,
        working: 0,
        options: {
          maxWorkers: options.maxWorkers || 1,
        }
      }
      next(q, worker, options);
    },
    process: function(q) {
        if (qs[q] && qs[q].length) {
            // are there workers available?
            if (workers[q].working < workers[q].options.maxWorkers) {
              var job = qs[q].shift();
              console.log('doing job',q, workers[q].working);
              workers[q].working++;
              workers[q].handler.apply(null,[job.obj, function() {
                // console.log('JOB COMPLETE');
                workers[q].working--;
                api.process(q);
              }]);

              // try again!
              api.process(q);
            } else {
              // no free workers. wait til next interval.
              // console.log('QUEUE IS PEGGED', q);
            }
        } else {
            delete(qs[q]);
        }
    },
    init: function(next) {

      var that = this;
      setInterval(function() {
          var count = 0;
          for (var key in qs) {
              count++;
              that.process(key);
          }
      },CONFIG.interval);
      next();

    }
  }

  return api;
}
