var cp = require('child_process')
var util = require('util')
var _ = require('underscore')


var five = require('johnny-five')
var board = new five.Board()

board.on('ready', boardReady)

function boardReady() {
  console.log('board is ready!')

  var pin = new five.Pin(2)
  pin.mode = pin.INPUT

  //pin.read(function(value) {
    //console.log('got ', value)
  //})














  pin.read(_.debounce(function(value) {
    console.log('got ', value)
  }, 200))
}


//board.on('ready', boardReadyButton)
//function boardReadyButton() {
  //var button = new five.Button(2)
  //button.on('down', function() {
    //console.log('button pressed wooo')
  //})
//}
