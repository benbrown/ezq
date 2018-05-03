# EXPERIMENTAL AT BEST

# ezq - a simple but extensible queue interface for node

the goal of this module is to provide a generic interface to queues so that:

* a simple app can use in-memory queues to reliably process tasks
* a more sophisticated app can use external queue tools like rabbit or redis to separate producers and consumers

currently support:

* rabbitmq (single or multiple processes)
* in-memory (single process only)

## simple use:

```
var q = require('ezq');
q.use(q.memory).then(function() {

  q.work('jobs', function(job, next) {
      // process job
      next();
  });

  q.add('jobs', {key: value});

});
```
