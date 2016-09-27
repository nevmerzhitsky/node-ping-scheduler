module.exports = scheduler
let intervalId = null

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
  //intervalId = setInterval(tick, 60 * 1000, config)
  tick(config) // Do work immediately
}

function stopDaemon() {
  clearInterval(intervalId)
}

function tick(config) {
  console.log('TICK!')

  // @TODO Do work in parallel
  for (let taskName in config.tasks) {
    let result = ping(config.tasks[taskName])
    console.log(taskName, result)
  }
}

function ping(task) {
  // @TODO Do sanity of relative path
  return require(`./pinger/${task.type}.js`)(task)
}
