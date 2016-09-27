const test = require('blue-tape')
const {getReport} = require('../../src/keeper')

test('false status if sequence of failures is equal to config failure_trigger', (t) => {
  const tasks = generateTasks()
  const history = generateHistory()
  const report = getReport(tasks, history)
  t.equal(
    report['a task'].status,
    false,
    'Keeper should set false status on sequence of failure of pings'
  )
  t.end()
})

test('false status if sequence of failures is longer than config failure_trigger', (t) => {
  const tasks = generateTasks()
  const history = generateHistory((d) => d['a task'].push({
    "status": false,
    "start_time":  "2016-09-27T21:03:45.000Z",
    "finish_time": "2016-09-27T21:03:46.500Z"
  }))
  const report = getReport(tasks, history)
  t.equal(
    report['a task'].status,
    false,
    'Keeper should set false status on sequence of failure of pings'
  )
  t.end()
})

test('true status if not all events in a range is failure', (t) => {
  const tasks = generateTasks()
  const history = generateHistory((d) => d['a task'][1].status = true)
  const report = getReport(tasks, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status on sequence of success/failure pings'
  )
  t.end()
})

test('true status if insufficient failure events in a range to the last event', (t) => {
  const tasks = generateTasks()
  const history = generateHistory((d) => d['a task'].push({
    "status": false,
    "start_time":  "2016-09-30T00:10:15.000Z",
    "finish_time": "2016-09-30T00:10:16.500Z"
  }))
  const report = getReport(tasks, history)
  t.equal(
    report['a task'].status,
    true,
    'Keeper should set true status if last failure event is too far from previous'
  )
  t.end()
})

function generateTasks(mutation) {
  let result = {
    tasks: {
      "a task": {
        type: "HTTP",
        url: "https://bo.rentsoft.ru/login/?lang=en",
        freq: 1,
        failure_trigger: 3
      }
    }
  }

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
        "start_time":  "2016-09-27T21:01:29.000Z",
        "finish_time": "2016-09-27T21:01:30.500Z"
      }, {
        "status": false,
        "start_time":  "2016-09-27T21:02:48.000Z",
        "finish_time": "2016-09-27T21:02:49.500Z"
      }
    ]
  }

  if (mutation) {
    mutation(result)
  }

  return result
}
