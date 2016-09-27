module.exports = {
  getReport
}

function getReport(tasks, history) {
  return {
    "a task": {
      status: false,
      start_time: new Date(),
      finish_time: new Date(),
      last_comment: 'test'
    }
  }
}
