module.exports = {
  add,
  list
}
const fs = require('fs')
const {dirname} = require('path')
const dbPath = 'data/history.json'

function readDb() {
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

function saveDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data))
}

function add(taskName, task, pingResult) {
  let db = readDb()

  if (typeof db[taskName] === 'undefined') {
    db[taskName] = []
  }

  db[taskName].push(pingResult)

  saveDb(db)
}

function list() {

}
