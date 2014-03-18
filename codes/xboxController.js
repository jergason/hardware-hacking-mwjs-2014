var five = require('johnny-five')
var Xbc = require('xbox-controller')
var _ = require('underscore')

var board = new five.Board()
var xbox = new Xbc()

function directionFromPosition(pos) {
  // range is from -32768 to 32768
  if (pos.x > 0) {
    // y position has greater magnitude, so it dominates
    if (Math.abs(pos.y) > pos.x) {
      // above or below?
      // y is reversed. -y means pushing up
      if (pos.y > 0) {
        return 'down'
      }
      else {
        return 'up'
      }
    }
    // x has greater magnitude, and we know we are on the right
    else {
      return 'right'
    }
  }
  else {
    // y position has greater magnitude, so it dominates
    if (Math.abs(pos.y) > Math.abs(pos.x)) {
      // above or below?
      // y is reversed. -y means pushing up
      if (pos.y > 0) {
        return 'down'
      }
      else {
        return 'up'
      }
    }
    // x has greater magnitude, and we know we are on the left
    else {
      return 'left'
    }
  }
}

function allOff(leds) {
  leds.up.off()
  leds.down.off()
  leds.left.off()
  leds.right.off()
}

function allOn(leds) {
  leds.up.on()
  leds.down.on()
  leds.left.on()
  leds.right.on()
}

board.on('ready', function() {
  var leds = {
    left: new five.Led({pin: 2}),
    up: new five.Led({pin: 3}),
    right: new five.Led({pin: 4}),
    down: new five.Led({pin: 5})
  }

  allOn(leds)

  xbox.on('left:move', _.debounce(function(pos) {
    allOff(leds)
    console.log(pos)

    // don't light up at netural position
    if (pos.x == 0 && pos.y == 0) {
      return
    }

    var direction = directionFromPosition(pos)
    console.log('direction is', direction)
    leds[direction].on()
  }, 50))
})
