module.exports = scheduler
let intervalId = null

function scheduler(config) {
  // Restarts the workers.
  process.on('SIGHUP', () => {
    stopDaemon()
    startDaemon()
  })

  // Gracefully Shuts down the workers.
  process.on('SIGTERM', stopDaemon)

  startDaemon()
}

function startDaemon() {
  intervalId = setInterval(tick, 1000)
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
