module.exports = scheduler
let intervalId = null

function scheduler(config) {
  // Restart the daemon.
  process.on('SIGHUP', () => {
    stopDaemon()
    startDaemon()
  })

  // Gracefully shut down the daemon.
  process.on('SIGTERM', stopDaemon)

  startDaemon()
}

function startDaemon() {
  intervalId = setInterval(tick, 60 * 1000)
  tick() // Do work immediately
}

function stopDaemon() {
  clearInterval(intervalId)
}

function tick() {
  console.log('TICK!')
}

function ping(task) {
  let result = {
    status: false,
    start_time: 1,
    finish_time: 20,
  }

  return result
}
