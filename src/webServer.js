const app = require('koa')()

module.exports = webServer

function webServer(config) {
  app.use(errorHandler)
  app.use(function*() {
    this.body = '<pre>\nStub HTML!\n</pre>'
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
