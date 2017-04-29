const decode = require('../decode')

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
}

function handleDropObject (decoder) {
  const id = decoder.readLengthPrefixedString()

  const elem = document.getElementById(id)
  elem.style.outline = 'none'
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
  }

  // console.log(decoder)
  if (decoder.length()) handleRpcInner(decoder)
}

function handleRpc (data) {
  const buffer = Buffer.from(data, 'binary')
  // console.log(buffer)
  handleRpcInner(new decode.Decoder(buffer))
}

module.exports = { handleRpc }
