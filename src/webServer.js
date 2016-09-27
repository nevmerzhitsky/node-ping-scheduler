const app = require('koa')()
const {list} = require('./history')
const {getReport} = require('./keeper')

module.exports = webServer

function webServer(config) {
  app.use(errorHandler)
  app.use(function*() {
    let buffer = []
    const report = getReport(config, list(config))

    for (let taskName in report) {
      const record = report[taskName]

      if (record.status) {
        buffer.push(`${taskName}: UP, last check: ${record.finish_time}`)
      } else {
        buffer.push(`${taskName}: DOWN, check range: ${record.start_time} - ${record.finish_time}, last comment: ${record.last_comment}`)
      }
    }

    this.body = `<pre>\nPing results:\n${buffer.join('\n')}\n</pre>`
  })
  app.listen(config.webserver.port)
}

function* errorHandler(next) {
  try {
    yield next
  } catch (err) {
    this.status = err.status || 500
    const errorMessage = err.status ? err.message : 'Internal server error occurred'
    if (this.status === 401) {
      this.set('WWW-Authenticate', 'Basic')
      this.body = 'Please auth'
    } else {
      this.body = 'Unknown error'
    }
  }
}
