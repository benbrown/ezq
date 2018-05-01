var q = require('../lib/index.js');

var rabbit = require('./rabbit.js')({
  uri: 'amqp://localhost'
});

q.use(rabbit).then(function() {

    var seq = 0;
    setInterval(function() {
        q.add('jobs',{seq: seq++, timeQueued: new Date().getTime()});
    },300)

});
