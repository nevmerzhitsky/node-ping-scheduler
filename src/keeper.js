const moment = require('moment')
const range = require('moment-range')

module.exports = {
  getReport
}

function getReport(config, history) {
  let result = {}

  for (let taskName in config.tasks) {
    const task = config.tasks[taskName]
    const taskHistory = history[taskName] || []
    result[taskName] = calcStatus(task, config.basePingInterval, taskHistory)
  }

  return result
}

function calcStatus(task, basePingInterval, taskHistory) {
  if (!taskHistory.length) {
    return {
      status: true,
    }
  }

  const lastEvent = taskHistory.reduce(
    (prev, current) => (prev.finish_time > current.finish_time) ? prev : current
  )
  const actualFinishTime = moment(lastEvent.finish_time)
  const actualStartTime = moment(actualFinishTime).subtract(
    task.freq * task.failure_trigger * basePingInterval,
    'seconds'
  )
  const actualRange = new range(actualStartTime, actualFinishTime)

  let haveSuccess = false
  for (let i in taskHistory) {
    const record = taskHistory[i]
    const startM = moment(record.start_time)
    const finishM = moment(record.finish_time)
    if (!actualRange.contains(startM) && !actualRange.contains(finishM)) {
      continue
    }
    if (record.status) {
      haveSuccess = true
      break
    }
  }

  if (haveSuccess) {
    return {
      status: true,
      start_time: actualStartTime,
      finish_time: actualFinishTime,
    }
  }

  return {
    status: false,
    start_time: actualStartTime,
    finish_time: actualFinishTime,
    last_comment: lastEvent.comment,
  }
}
