const {add} = require('./history')
let intervalId = null

module.exports = scheduler

function scheduler(config) {
  // Restart the daemon.
  process.on('SIGHUP', () => {
    stopDaemon()
    startDaemon(config)
  })

  // Gracefully shut down the daemon.
  process.on('SIGTERM', stopDaemon)

  startDaemon(config)
}

function startDaemon(config) {
  intervalId = setInterval(tick, config.basePingInterval * 1000, config)
  tick(config) // Do work immediately
}

function stopDaemon() {
  clearInterval(intervalId)
}

function tick(config) {
  console.log('TICK!')

  // @TODO Do work in parallel
  for (let taskName in config.tasks) {
    ping(config, taskName, config.tasks[taskName])
  }
}

function ping(config, taskName, task) {
  // @TODO Do sanity of relative path
  require(`./pinger/${task.type}.js`)(task, updateHistory(config, taskName, task))
}

function updateHistory(config, taskName, task) {
  return function(result) {
    add(config, taskName, task, result)
  }
}
