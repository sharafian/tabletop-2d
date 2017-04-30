const encode = require('../encode')

function makeDraggable (elem) {
  const socket = window.mySocket

  elem.draggable({
    containment: 'document',

    drag: function onDrag (event, ui) {
      socket.send(encode.moveObject(elem.attr('id'), ui.position.left, ui.position.top))
    },

    start: function onStart (event, ui) {
      elem.css('outline', 'thick solid ' + window.myColor)
      elem.css('z-index', '' + window.myNextZIndex++)
      socket.send(encode.grabObject(elem.attr('id'), window.myColor))
    },

    stop: function onStop (event, ui) {
      elem.css('outline', 'none')
      socket.send(encode.dropObject(elem.attr('id')))
    }
  }).click(function onClick (event, ui) {
    if (window.myLockMode) {
      window.myLockMode = false
      $('body,html').css('cursor', 'auto')

      elem.draggable('disable')
      socket.send(encode.lockObject(elem.attr('id')))
    }
  })
}

module.exports = { makeDraggable }
