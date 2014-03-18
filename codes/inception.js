var cp = require('child_process')
var util = require('util')

var async = require('async')
var five = require('johnny-five')

var board = new five.Board()

function setVolume(volume, done) {
  setTimeout(function() {
    cp.exec('sudo osascript -e "set Volume ' + volume + '"', done)
  }, 5000)
}

function boardReady() {
  var played = false
  var mindHeist = new five.Button({pin: 8})
  var BWAMMM = new five.Button({pin: 2})
  mindHeist.on('down', function() {
    util.log('it begins')
    if (played) {
      return
    }
    played = true
    setVolume(1, function() {
      cp.exec('afplay public/audio/dream_is_collapsing.m4a', function() {})
      async.eachSeries([2, 3, 4, 5, 6], setVolume, function(err) {
        console.log('turned up the volume woo')
      })
    })
  })

  BWAMMM.on('down', function() {
    console.log('inception\'d')
    cp.exec('afplay public/audio/inception.mp3', function() {
      console.log('done playing')
    })
  })
}

board.on('ready', boardReady)
