var five = require('johnny-five')
var temporal = require('temporal')
var IrcClient = require('./ircClient')

var ircClient = new IrcClient()
var board = new five.Board()

board.on('ready', boardReady)


function boardReady() {
  var score = 0
  var startButton = new five.Button({pin: 7})
  var gameLoop = null
  var gameLoopDelay = 50

  var leds = [8,9,10,11,12].map(function(pinNumber) {
    return new five.Led(pinNumber)
  })

  var currentLedIndex = 0
  var winnerLed = leds[2]

  function loopLeds() {
    var previousIdx = calculatePreviousLedIndex(currentLedIndex, leds)
    leds[previousIdx].off()

    leds[currentLedIndex].on()

    currentLedIndex = calculateNextLedIndex(currentLedIndex, leds)
  }

  function startGame() {
    if (gameLoop != undefined) {
      gameLoop.stop()
    }
    gameLoop = temporal.loop(gameLoopDelay, loopLeds)
    ircClient.say('Starting the game through the magic of (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ THE CLOUD (ಥ﹏ಥ)')
    console.log('started gameLoop')
  }

  function endGame() {
    if (!gameLoop) return
    gameLoop.stop()
    gameLoop = null

    turnOffLeds(leds)

    if (currentLedIndex == winnerLed) {
      score = winGame(leds[winnerLed], ircClient, score)
    }
    else {
      score = loseGame(leds, ircClient, score)
    }
  }

  function faster() {
    if (!gameLoop) {
      return startGame()
    }

    gameLoop.stop()
    gameLoop = null

    turnOffLeds(leds)

    // don't allow loop delay to go too low
    if (gameLoopDelay > 20) {
      gameLoopDelay -= 10
    }

    startGame()
  }

  function slower() {
    if (!gameLoop) {
      return startGame()
    }

    gameLoop.stop()
    gameLoop = null

    turnOffLeds(leds)

    // don't allow loop delay to go too high
    if (gameLoopDelay < 2000) {
      gameLoopDelay += 10
    }

    startGame()
  }

  function iLovePeace() {
    ircClient.say('つ ◕_◕ ༽つ GIVE HUGS NOT DEATH')
  }

  ircClient.on('start', startGame)
  ircClient.on('play', endGame)
  ircClient.on('faster', faster)
  ircClient.on('slower', slower)
  ircClient.on('kill', iLovePeace)
}

function calculateNextLedIndex(currentLedIndex, leds) {
  return (currentLedIndex + 1) % leds.length
}

function calculatePreviousLedIndex(currentLedIndex, leds) {
  var idx = currentLedIndex - 1

  // wrap back around
  if (idx < 0) {
    idx = leds.length + idx
  }
  return idx
}

function winGame(winnerLed, ircClient, score) {
  score++
  winnerLed.strobe(200)
  ircClient.say('Congrats, you won! Score is ' + score)
  // turn off winner led
  setTimeout(function() {
    winnerLed.off()
  }, 2000)
  return score
}

function loseGame(leds, ircClient, score) {
  score--
  flashLeds(leds)
  ircClient.say('Everyone is a winner. Still, you lost this game. Score is now ' + score)
  return score
}

function flashLeds(leds) {
  leds.forEach(function(led) {
    led.strobe()
  })

  setTimeout(function() {
    leds.forEach(function(led) {
      led.off()
    })
  }, 2000)
}

function turnOffLeds(leds) {
  leds.forEach(function(led) {
    led.off()
  })
}
