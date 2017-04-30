const rpc = require('./rpc')
const encode = require('../encode')
const drag = require('./drag')

window.mySocket = null
window.myColor = '#000000'
window.myNextId = 6
window.myNextZIndex = 2

$(document).ready(function onLoad () {
  const socket = window.mySocket = new WebSocket('ws://localhost:35468')

  socket.onmessage = function (msg) {
    const reader = new FileReader()
    reader.readAsBinaryString(msg.data)
    reader.onloadend = function () {
      rpc.handleRpc(reader.result)
    }
  }

  $(document).keypress(function keyPress (event) {
    if (event.key === 'A') {
      const source = window.prompt('Enter the URL of the image you want to add')
      const id = 'object_' + window.myNextId++
      const x = 0
      const y = 0

      const elem = document.createElement('img')
      elem.class = 'object'
      elem.style.position = 'absolute'
      elem.id = id
      elem.src = source
      document.body.appendChild(elem)

      socket.send(encode.addObject(id, source, x, y))
      drag.makeDraggable($(elem))
    }

    if (event.key === 'L') {
      window.myLockMode = true
      $('body,html').css('cursor', 'crosshair')
    }

    if (event.key === 'C') {
      const newColor = window.prompt('Enter your new desired color')
      if (newColor.length === 7 && newColor.match(/#[0-f]{6}/)) {
        window.myColor = newColor
      }
    }
  })

  $(document).keyup(function keyUp (event) {
    // ESC
    if (event.keyCode === 27) {
      window.myLockMode = false
      $('body,html').css('cursor', 'auto')
    }
  })

  $('.object').each(function eachObject (i, obj) {
    const that = this
    drag.makeDraggable($(that))
  })
})
