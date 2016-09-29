const ping = require('net-ping')
const {resolve} = require('dns')

module.exports = pinger

function pinger(task, callback) {
  const session = ping.createSession({
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 64,
    retries: 1,
    timeout: 5000,
  })

  resolve(task.host, 'A', function(err, addresses) {
    const ip = '10.0.0.1' || addresses[0]
    session.pingHost(ip, function (error, target, sent, rcvd) {
      let result = {
        status: true,
        comment: '',
        start_time: sent,
        finish_time: rcvd,
      }

      if (error) {
        result.status = false
        result.comment = error.toString()
      }

      callback(result)
    })
  })
}
