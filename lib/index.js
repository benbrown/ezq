var debug=require('debug')('q');;
var ware = require('ware');

var queue_manager = {
    use: function(config) {
      var that = this;
      return new Promise(function(resolve, reject) {
        if (config.add) {
          that.handlers.add = config.add;
        }
        if (config.work) {
          that.handlers.work = config.work;
        }
        if (config.process) {
          that.handlers.process = config.process;
        }
        if (config.init) {
          config.init.apply(that, [function() {
            console.log('Q SYSTEM INITIALIZED')
            resolve();
          }]);
        } else {
          resolve();
        }
      });
    },
    memory: require(__dirname + '/memory.js')({}),
    handlers: {
      add: function(q, thing, next) {
        next(q,thing);
      },
      work: function(q, worker, options, next) {
        next(q,worker,options);
      },
    },
    add: function(q, obj) {
        var thing = {
            obj: obj,
        };
        debug('add to',q,thing);
        queue_manager.handlers.add.apply(queue_manager, [q, thing, function(q, thing) {
          debug('item added to ',q)
        }]);
    },
    work: function(q, worker, options) {
      queue_manager.handlers.work.apply(queue_manager, [q, worker, options, function(q, worker, options) {
        debug('worker configured for',q);
      }]);
    },
    process: function(q) {
      queue_manager.handlers.process.apply(queue_manager,[q, function() {
        debug('processed a batch');
      }]);
    },
}


module.exports = queue_manager;
