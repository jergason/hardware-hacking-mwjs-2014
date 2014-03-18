var irc = require('irc')

var client = new irc.Client('chat.freenode.net', 'lightbot', {
  channels: ['#mwrc']
})


function isToClient(message) {
  return /^lightbot/i.test(message)
}

function getCommand(message) {
  var res = message.trim().split(/\s+/)
  if (!res || !res[1]) {
    return ''
  }

  return res[1]
}

client.on('registered', function() {
  console.log('lightbot lives')
})

function Client() {
  this.events = {}

  var self = this

  client.on('message#mwrc', function(from, message) {
    if (!isToClient(message)) {
      return
    }

    var command = getCommand(message)
    var cb = self.events[command]

    if (!cb) {
      return
    }

    cb(message)
  })
}

Client.prototype.say = function(toSay) {
  client.say('#mwrc', toSay)
}

Client.prototype.on = function(messageName, cb) {
  this.events[messageName] = cb
}

module.exports = Client
