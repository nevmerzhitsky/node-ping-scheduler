const assert = require('assert')

module.exports = configurator

function configurator(jsonConfig) {
  assert.strictEqual(typeof jsonConfig.tasks, 'object', '"tasks" is required element')
  assert(Object.keys(jsonConfig.tasks).length > 0, '"tasks" should be not empty object')

  for (let taskName in jsonConfig.tasks) {
    const task = jsonConfig.tasks[taskName]

    assert.strictEqual(typeof task.type, 'string', '"type" is required element of a task')
    task.timeout = task.timeout || 10
    assert.strictEqual(typeof task.timeout, 'number', '"timeout" should be a number')

    if (task.type == 'HTTP') {
      assert.strictEqual(typeof task.url, 'string', '"url" is required element of a HTTP task')
      task.response_code = task.response_code || []
      if (!Array.isArray(task.response_code)) {
        task.response_code = [task.response_code]
      }
    } else if (task.type == 'PING') {
      assert.strictEqual(typeof task.host, 'string', '"host" is required element of a PING task')
    } else {
      throw new Error(`Unknown task type "${task.type}"`)
    }

    assert.strictEqual(typeof task.freq, 'number', '"freq" is required element of a task')
    assert.strictEqual(
      typeof task.failure_trigger,
      'number',
      '"failure_trigger" is required element of a task'
    )
  }

  return jsonConfig
}
