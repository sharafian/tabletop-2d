const rpc = require('./rpc')
const encode = require('../encode')
const drag = require('./drag')

window.mySocket = null
window.myColor = '#000000'
window.myNextId = 6
window.myNextZIndex = 2

$(document).ready(function onLoad () {
  const protocol = (location.protocol === 'https:') ? 'wss:' : 'ws:'
  const socket = window.mySocket = new WebSocket(protocol + '//' + location.host + '/websocket')

  socket.onmessage = function (msg) {
    const reader = new FileReader()
    reader.readAsArrayBuffer(msg.data)
    reader.onloadend = function () {
      rpc.handleRpc(reader.result)
    }
  }

  $(document).keypress(function keyPress (event) {
    if (event.key === 'A') {
      const source = window.prompt('Enter the URL of the image you want to add')
      if (!source) return

      const id = 'object_' + window.myNextId++
      const x = 0
      const y = 0

      const elem = document.createElement('img')
      elem.class = 'object'
      elem.style.position = 'absolute'
      elem.style.top = 0
      elem.style.left = 0
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
      if (!newColor) return

      if (newColor.length === 7 && newColor.match(/#[0-f]{6}/)) {
        window.myColor = newColor
      }
    }

    if (event.key === 'D') {
      const datSource = window.prompt('Enter the URL of the data you want to load')
      if (!datSource) return

      fetch(datSource).then((response) => {
        return response.text()
      }).then((text) => {
        const buf = Buffer.from(text, 'base64')
        rpc.handleRpc(buf)
        socket.send(buf)
      })
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
