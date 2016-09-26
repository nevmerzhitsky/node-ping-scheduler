const test = require('blue-tape')
const configurator = require('../../src/configurator.js')

test('fail when config has no tasks element', (t) => {
  const json = generateJson((r) => delete r.tasks)
  t.throws(() => configurator(json),
    new RegExp('"tasks" is required element'), 'Configurator should throw error')
  t.end()
})

test('fail when tasks array is empty', (t) => {
  const json = generateJson((r) => r.tasks = [])
  t.throws(() => configurator(json),
    new RegExp('"tasks" should be not empty array'), 'Configurator should throw error')
  t.end()
})

test('fail when a task have no type', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].type)
  t.throws(() => configurator(json),
    new RegExp('"type" is required element of a task'), 'Configurator should throw error')
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

test('fail when a HTTP task have no url', (t) => {
  const json = generateJson((r) => delete r.tasks['HTTP task'].url)
  t.throws(() => configurator(json),
    new RegExp('"url" is required element of a HTTP task'), 'Configurator should throw error')
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
