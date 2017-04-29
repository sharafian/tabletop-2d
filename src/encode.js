function colorToRgb (color) {
  return Buffer.from(color.substring(1), 'hex')
}

function setColor (color) {
  return Buffer.concat([
    new Buffer([ 0x01 ]),
    colorToRgb(color)
  ])
}

function moveObject (id, x, y) {
  return Buffer.concat([
    new Buffer([ 0x02,
      x >> 8 & 0xff, x & 0xff,
      y >> 8 & 0xff, y & 0xff,
      id.length]),
    Buffer.from(id, 'utf8')
  ])
}

function grabObject (id, color) {
  return Buffer.concat([
    new Buffer([ 0x03 ]),
    colorToRgb(color),
    new Buffer([ id.length ]),
    Buffer.from(id, 'utf8')
  ])
}

function dropObject (id, color) {
  return Buffer.concat([
    new Buffer([ 0x04, id.length ]),
    Buffer.from(id, 'utf8')
  ])
}

module.exports = {
  setColor,
  moveObject,
  grabObject,
  dropObject
}
