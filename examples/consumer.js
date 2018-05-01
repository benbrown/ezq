var q = require('../lib/index.js');

var rabbit = require('./rabbit.js')({
  uri: 'amqp://localhost'
});

q.use(rabbit).then(function() {

  q.work('jobs', function(thing, next) {
       console.log('time to process', new Date().getTime() - thing.timeQueued);
       setTimeout(function() {
         next();
       },1000)
  },{maxWorkers: 20});


});
