const configPath = process.env['SMARTPINGER_CONFIG'] || '../config.json'
const configurator = require('./configurator')
const scheduler = require('./scheduler')
const webServer = require('./webServer')

config = configurator(require(configPath))
scheduler(config)
webServer(config)
