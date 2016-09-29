const test = require('blue-tape')
const configurator = require('../../src/configurator')

test('fail when no web-server configuration', (t) => {
  const json = generateJson((r) => delete r.webServer)
  t.throws(() => configurator(json),
    new RegExp('"webServer" is required element'), 'Configurator should throw error')
  t.end()
})

test('fail when a port in web-server configuration have wrong type', (t) => {
  const json = generateJson((r) => r.webServer.port = 'wrong value')
  t.throws(() => configurator(json),
    new RegExp('"webServer.port" should be a number'), 'Configurator should throw error')
  t.end()
})

test('fail when a basePingInterval have wrong type', (t) => {
  const json = generateJson((r) => r.basePingInterval = 'wrong value')
  t.throws(() => configurator(json),
    new RegExp('"basePingInterval" should be a number'), 'Configurator should throw error')
  t.end()
})

test('fail when a historyDbPath have wrong type', (t) => {
  const json = generateJson((r) => r.historyDbPath = -1)
  t.throws(() => configurator(json),
    new RegExp('"historyDbPath" should be a string'), 'Configurator should throw error')
  t.end()
})

test('fail when a historyCleanupAge have wrong type', (t) => {
  const json = generateJson((r) => r.historyCleanupAge = 'wrong value')
  t.throws(() => configurator(json),
    new RegExp('"historyCleanupAge" should be a number'), 'Configurator should throw error')
  t.end()
})

test('fail when config has no tasks element', (t) => {
  const json = generateJson((r) => delete r.tasks)
  t.throws(() => configurator(json),
    new RegExp('"tasks" is required element'), 'Configurator should throw error')
  t.end()
})

test('fail when tasks object is empty', (t) => {
  const json = generateJson((r) => r.tasks = [])
  t.throws(() => configurator(json),
    new RegExp('"tasks" should be not empty object'), 'Configurator should throw error')
  t.end()
})

test('fail when a task have no type', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].type)
  t.throws(() => configurator(json),
    new RegExp('"type" is required element of a task'), 'Configurator should throw error')
  t.end()
})

test('fail when a task have unknown type', (t) => {
  const json = generateJson((r) => r.tasks['UNKNOWN-TYPE task'] = { type: 'UNKNOWN' })
  t.throws(() => configurator(json),
    new RegExp('Unknown task type '), 'Configurator should throw error')
  t.end()
})

test('fail when a task have no freq', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].freq)
  t.throws(() => configurator(json),
    new RegExp('"freq" is required element of a task'), 'Configurator should throw error')
  t.end()
})

test('fail when a task have no failure_trigger', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].failure_trigger)
  t.throws(() => configurator(json),
    new RegExp('"failure_trigger" is required element of a task'), 'Configurator should throw error')
  t.end()
})

test('fail when a timeout have wrong type', (t) => {
  const json = generateJson((r) => r.tasks['HTTP task'].timeout = 'wrong value')
  t.throws(() => configurator(json),
    new RegExp('"timeout" should be a number'), 'Configurator should throw error')
  t.end()
})

test('fail when a timeout is not positive', (t) => {
  const json = generateJson((r) => r.tasks['HTTP task'].timeout = 0)
  t.throws(() => configurator(json),
    new RegExp('"timeout" should be greater than zero'), 'Configurator should throw error')
  t.end()
})

test('check default value of timeout for a task', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].timeout)
  const config = configurator(json)
  t.deepEqual(
    config.tasks['HTTP task'].timeout,
    10,
    'Configurator should set default value of timeout'
  )
  t.end()
})

test('fail when a HTTP task have no url', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].url)
  t.throws(() => configurator(json),
    new RegExp('"url" is required element of a HTTP task'), 'Configurator should throw error')
  t.end()
})

test('check default value of response_code for a HTTP task', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].response_code)
  const config = configurator(json)
  t.deepEqual(
    config.tasks['HTTP task'].response_code,
    [],
    'Configurator should set default value of response_code'
  )
  t.end()
})

test('check value of response_code for a HTTP task is an array', (t) => {
  const json = generateJson((r) => r.tasks['HTTP task'].response_code = -1)
  t.ok(
    Array.isArray(configurator(json).tasks['HTTP task'].response_code),
    '"response_code" of a HTTP task should be an array'
  )
  t.end()
})

test('fail when a PING task have no host', (t) => {
  const json = generateJson((r) => delete r.tasks['PING task'].host)
  t.throws(() => configurator(json),
    new RegExp('"host" is required element of a PING task'), 'Configurator should throw error')
  t.end()
})

function generateJson(mutation) {
  let result = {
    webServer: {
      port: 80
    },
    basePingInterval: 60,
    historyDbPath: "data/history.json",
    historyCleanupAge: 86400,
    tasks: {
      "HTTP task": {
        type: "HTTP",
        url: "https://bo.rentsoft.ru/login/?lang=en",
        freq: 1,
        response_content: "Enter the partner's dashboard",
        response_code: [],
        failure_trigger: 5
      },
      "PING task": {
        type: "PING",
        host: "bo.rentsoft.ru",
        freq: 5,
        failure_trigger: 2
      }
    }
  }

  if (mutation) {
    mutation(result)
  }

  return result
}
