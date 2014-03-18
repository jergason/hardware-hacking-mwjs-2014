var express = require('express')
var socketio = require('socket.io')
var http = require('http')
var cp = require('child_process')
var util = require('util')

var app = express()
var server = http.createServer(app)
var io = socketio.listen(server)
var async = require('async')
var five = require('johnny-five')


function setVolume(volume, done) {
  setTimeout(function() {
    cp.exec('sudo osascript -e "set Volume ' + volume + '"', done)
  }, 5000)
}

app.use(express.static(__dirname + '/public'))

var board = new five.Board()
var socket = null

function boardReady() {
  var BWAMMM = new five.Button({pin: 2})
  BWAMMM.on('down', function() {
    console.log('inception\'d')
    if (!socket) return
    socket.emit('next')
    cp.exec('afplay public/audio/inception.mp3', function() {
      console.log('done playing')
    })
  })
}

board.on('ready', boardReady)

io.sockets.on('connection', function(s) {
  socket = s
})

server.listen(1337)
