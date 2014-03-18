var ardrone = require('ar-drone')
var client = ardrone.createClient()
var XB = require('xbox-controller')
var _ = require('underscore')


xbox = new XB()

xbox.on('a:press', function() {
  client.takeoff()
})

xbox.on('b:press', function() {
  client.land()
})

xbox.on('y:press', function() {
  client.stop()
})

xbox.on('leftrigger', _.debounce(function() {
  client.animate('flipLeft')
}, 200))

xbox.on('righttrigger', _.debounce(function() {
  client.animate('flipRight')
}, 200))

function isZero(pos) {
  return Object.keys(pos).every(function(key) {
    return pos[key] === 0
  })
}

xbox.on('left:move', _.debounce(function(pos) {
  var directions = positionToDirection(pos)

  if (isZero(pos)) {
    client.stop()
  }

  if (directions.up) {
    console.log('calling client.front')
    client.front(directions.up)
  }
  else {
    client.back(directions.down)
  }

  if (directions.left) {
    client.left(directions.left)
  }
  else {
    client.right(directions.right)
  }
}, 50))

xbox.on('right:move', _.debounce(function(pos) {
  var directions = positionToDirection(pos)

  if (isZero(pos)) {
    client.stop()
  }

  if (directions.up) {
    client.up(directions.up)
  }
  else {
    client.down(directions.down)
  }

  if (directions.left) {
    client.counterClockwise(directions.left)
  }
  else {
    client.clockwise(directions.right)
  }
}), 50)

// turns xbox position coordinates into two directions normalized from 0 to 1
function positionToDirection(pos) {
  var MAX_VAL = 32768
  var toReturn = {}
  // don't light up at netural position
  if (pos.x == 0 && pos.y == 0) {
    return {up: 0, left: 0}
  }

  // range is from -32768 to 32768
  if (pos.x > 0) {
    toReturn.right = pos.x / MAX_VAL
  }
  else {
    toReturn.left = Math.abs(pos.x) / MAX_VAL
  }

  // y axis is flipped
  if (pos.y > 0) {
    toReturn.down = pos.y / MAX_VAL
  }
  else {
    toReturn.up = Math.abs(pos.y) / MAX_VAL
  }

  return toReturn
}
