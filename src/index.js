const configPath = '../config.json'
const configurator = require('./configurator')
const scheduler = require('./scheduler')

config = configurator(require(configPath))
scheduler(config)
