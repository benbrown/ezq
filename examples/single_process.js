var q = require('../lib/index.js');

q.use(q.memory).then(function() {
  q.work('jobs', function(thing, next) {
       console.log('time to process', new Date().getTime() - thing.timeQueued);
       setTimeout(function() {
         next();
       },1000)
  },{maxWorkers: 20});

  var seq = 0;
  setInterval(function() {
      q.add('jobs',{seq: seq++, timeQueued: new Date().getTime()});
  },300)

});
