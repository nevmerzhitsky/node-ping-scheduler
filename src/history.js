const fs = require('fs')
const {dirname} = require('path')
const moment = require('moment')

module.exports = {
  add,
  list
}

function readDb(dbPath) {
  if (!fs.existsSync(dbPath) && !fs.existsSync(dirname(dbPath))) {
    throw new Error(`Please create "${dirname(dbPath)}" directory at the root of app for storing history`)
  }

  if (!fs.existsSync(dbPath)) {
    return {}
  }

  const data = fs.readFileSync(dbPath, 'utf8')
  try {
    return JSON.parse(data)
  } catch (err) {}

  return {}
}

function saveDb(dbPath, data, historyCleanupAge) {
  // Cleanup deprecated record
  if (historyCleanupAge > 0) {
    const expireBoundary = moment().subtract(historyCleanupAge, 'seconds')
    for (let taskName in data) {
      data[taskName] = data[taskName].filter(
        (record) => moment(record.start_time).isAfter(expireBoundary)
      )
    }
  }

  fs.writeFileSync(dbPath, JSON.stringify(data))
}

function add(config, taskName, task, pingResult) {
  let db = readDb(config.historyDbPath)

  if (typeof db[taskName] === 'undefined') {
    db[taskName] = []
  }

  if (!pingResult.comment.length) {
    delete pingResult.comment
  }
  db[taskName].push(pingResult)

  saveDb(config.historyDbPath, db, config.historyCleanupAge)
}

function list(config) {
  return readDb(config.historyDbPath)
}
