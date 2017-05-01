const decode = require('../decode')
const drag = require('./drag')

function handleSetColor (decoder) {
  const color = decoder.readBytes(3).toString('hex')
  window.myColor = '#' + color
}

function handleMoveObject (decoder) {
  const x = decoder.readUInt16()
  const y = decoder.readUInt16()
  const id = decoder.readLengthPrefixedString()

  // console.log('moving', id, 'to', x, ',', y)

  const elem = document.getElementById(id)
  elem.style.top = y
  elem.style.left = x
}

function handleGrabObject (decoder) {
  const color = decoder.readBytes(3).toString('hex')
  const id = decoder.readLengthPrefixedString()

  const elem = document.getElementById(id)
  elem.style.outline = 'thick solid #' + color
  elem.style['z-index'] = '' + window.myNextZIndex++
}

function handleDropObject (decoder) {
  const id = decoder.readLengthPrefixedString()

  const elem = document.getElementById(id)
  elem.style.outline = 'none'
}

function handleAddObject (decoder) {
  const x = decoder.readUInt16()
  const y = decoder.readUInt16()
  const source = decoder.readLengthPrefixedString()
  const id = decoder.readLengthPrefixedString()

  const elem = document.createElement('img')
  elem.class = 'object'
  elem.style.position = 'absolute'
  elem.style.top = y
  elem.style.left = x
  elem.id = id
  elem.src = source
  document.body.appendChild(elem)
  drag.makeDraggable($(elem))
}

function handleLockObject (decoder) {
  const id = decoder.readLengthPrefixedString()

  const elem = document.getElementById(id)
  $(elem).draggable('disable')
}

function handleGridSize (decoder) {
  const gridSize = decoder.readUInt16()

  document.body.style['background-size'] = (+gridSize)
    ? `${gridSize}px ${gridSize}px`
    : 'none'
  document.body.style['background-image'] =
    'linear-gradient(to right, #ccc 1px, transparent 1px),' +
    'linear-gradient(to bottom, #ccc 1px, transparent 1px)'
}

function handleRpcInner (decoder) {
  const method = decoder.readUInt8()
  switch (method) {
    case 0x01:
      handleSetColor(decoder)
      break
    case 0x02:
      handleMoveObject(decoder)
      break
    case 0x03:
      handleGrabObject(decoder)
      break
    case 0x04:
      handleDropObject(decoder)
      break
    case 0x05:
      handleAddObject(decoder)
      break
    case 0x06:
      handleLockObject(decoder)
      break
    case 0x07:
      handleGridSize(decoder)
      break
    default:
      // TODO: error?
      return
  }

  // console.log(decoder)
  if (decoder.length()) handleRpcInner(decoder)
}

function handleRpc (data) {
  const buffer = new Buffer(data)
  // console.log(buffer.toString('hex'))
  handleRpcInner(new decode.Decoder(buffer))
}

module.exports = { handleRpc }
