var express = require('express')
var socketio = require('socket.io')
var http = require('http')
var five = require('johnny-five')

var app = express()
var server = http.createServer(app)
var io = socketio.listen(server)

app.use(express.static(__dirname + '/public'))


var board = new five.Board()
var socket = null

function boardReady() {
  console.log('worky worky?')
  var next = new five.Button(8);
  var prev = new five.Button(2)

  next.on('down', function() {
    console.log('calling next')
    if (!socket) return
    socket.emit('next')
  })

  prev.on('down', function() {
    console.log('calling prev')
    if (!socket) return
    socket.emit('prev')
  })
}

board.on('ready', boardReady)

io.sockets.on('connection', function(s) {
  socket = s
  console.log('set socket')
})

server.listen(1337)
