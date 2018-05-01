var amqp = require('amqplib/callback_api');

module.exports = function(config) {
    return {
      init: function(next) {
        var that = this;
        amqp.connect(config.uri, function(err, conn) {
          conn.createChannel(function(err, ch) {
            console.log('CHANNEL CREATED');
            that.channel = ch;
            next();
          });
        });
      },
      add: function(q, obj, next) {
        var that = this;
        that.channel.assertQueue(q, {durable: false});
        that.channel.sendToQueue(q, new Buffer(JSON.stringify(obj)));
        next(q, obj);
      },
      work: function(q, handler, options, next) {
        var that = this;
        that.channel.assertQueue(q, {durable: false});
        that.channel.consume(q, function(msg) {
          var thing = JSON.parse(msg.content.toString()).obj;
          handler.apply(null,[thing, function() {
              that.channel.ack(msg);
          }])
        }, options);
        next(q, handler, options);

      },
  }
}
