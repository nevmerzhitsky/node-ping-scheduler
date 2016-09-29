const {add} = require('./history')
let intervalId = null
let nextPingCounter = new Map()

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
  nextPingCounter.forEach((value, key, map) => map.set(key, --value))

  // @TODO Do work in parallel
  for (let taskName in config.tasks) {
    if (nextPingCounter.get(taskName) > 0) {
      continue
    }
    ping(config, taskName, config.tasks[taskName])
  }
}

function ping(config, taskName, task) {
  nextPingCounter.set(taskName, task.freq)

  // @TODO Do sanity of relative path
  require(`./pinger/${task.type}`)(task, updateHistory(config, taskName, task))
}

function updateHistory(config, taskName, task) {
  return function(result) {
    add(config, taskName, task, result)
  }
}
