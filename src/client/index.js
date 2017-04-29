const rpc = require('./rpc')
const encode = require('../encode')

let socket = null
window.myColor = '#000'

$(document).ready(function onLoad () {
  socket = new WebSocket('ws://localhost:35468')

  socket.onmessage = function (msg) {
    const reader = new FileReader()
    reader.readAsBinaryString(msg.data)
    reader.onloadend = function () {
      rpc.handleRpc(reader.result)
    }
  }

  $('.object').each(function eachObject (i, obj) {
    const that = this
    $(that).draggable({
      drag: function onDrag (event, ui) {
        socket.send(encode.moveObject($(that).attr('id'), ui.position.left, ui.position.top))
      },

      start: function onStart (event, ui) {
        $(that).css('outline', 'thick solid ' + window.myColor)
        socket.send(encode.grabObject($(that).attr('id'), window.myColor))
      },

      stop: function onStop (event, ui) {
        $(that).css('outline', 'none')
        socket.send(encode.dropObject($(that).attr('id')))
      }
    })
  })
})
