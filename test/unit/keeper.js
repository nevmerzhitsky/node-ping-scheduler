const test = require('blue-tape')
const {getReport} = require('../../src/keeper')

test('true status if not any events in history', (t) => {
  const config = generateJson()
  const history = {}
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status on empty sequence of pings'
  )
  t.end()
})

test('false status if length of sequence of failures is equal to config failure_trigger', (t) => {
  const config = generateJson()
  const history = generateHistory()
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    false,
    'Keeper should set false status on sequence of failure of pings'
  )
  t.end()
})

test('false status if length of sequence of failures is longer than config failure_trigger', (t) => {
  const config = generateJson()
  const history = generateHistory((d) => d['a task'].push({
    "status": false,
    "start_time":  "2016-09-27T21:03:45.000Z",
    "finish_time": "2016-09-27T21:03:46.500Z"
  }))
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    false,
    'Keeper should set false status on sequence of failure of pings'
  )
  t.end()
})

test('true status if not all events in a range is failure', (t) => {
  const config = generateJson()
  const history = generateHistory((d) => d['a task'][d['a task'].length - 1].status = true)
console.log('history', history)
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status on sequence of success/failure pings'
  )
  t.end()
})

test('true status if last success event is far from the last failure event but still in the failure_trigger range', (t) => {
  const config = generateJson()
  const history = generateHistory((d) => d['a task'][0].status = true)
  console.log('history', history)
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status on sequence of success/failure pings'
  )
  t.end()
})

test('true status if insufficient failure events in a range to the last event', (t) => {
  const config = generateJson()
  const history = generateHistory((d) => d['a task'].push({
    "status": true,
    "start_time":  "2016-09-30T00:10:15.000Z",
    "finish_time": "2016-09-30T00:10:16.500Z"
  }))
  const report = getReport(config, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status if last failure event is too far from previous'
  )
  t.end()
})

function generateJson(mutation) {
  let result = {
    basePingInterval: 60,
    tasks: {
      "a task": {
        type: "HTTP",
        url: "https://bo.rentsoft.ru/login/?lang=en",
        freq: 5,
        failure_trigger: 3
      }
    }
  }
  // @TODO Check case when freq == 5

  if (mutation) {
    mutation(result)
  }

  return result
}

function generateHistory(mutation) {
  let result = {
    "a task": [
      {
        "status": false,
        "start_time":  "2016-09-27T21:00:05.000Z",
        "finish_time": "2016-09-27T21:00:05.500Z"
      }, {
        "status": false,
        "start_time":  "2016-09-27T21:05:29.000Z",
        "finish_time": "2016-09-27T21:05:30.500Z"
      }, {
        "status": false,
        "start_time":  "2016-09-27T21:10:48.000Z",
        "finish_time": "2016-09-27T21:10:49.500Z"
      }
    ]
  }

  if (mutation) {
    mutation(result)
  }

  return result
}
