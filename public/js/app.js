(function() {

  console.log(window)
  var socket = io.connect('http://localhost')

  socket.on('next', function() {Reveal.next()})
  socket.on('prev', function() {Reveal.prev()})
})()
