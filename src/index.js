const ws = require('ws')
const uuid = require('uuid')
const http = require('http')
const fs = require('fs')
const path = require('path')

const encode = require('./encode')
const decode = require('./decode')

const wss = new ws.Server({
  perMessageDeflate: false,
  port: 35468
})

const state = {}

function _handleMessageInner (decoder) {
  const method = decoder.readUInt8()

  if (method === 0x02) {
    const x = decoder.readUInt16()
    const y = decoder.readUInt16()
    const id = decoder.readLengthPrefixedString()

    if (!state[id]) state[id] = {}
    state[id].x = x
    state[id].y = y
  }

  else if (method === 0x06) {
    const id = decoder.readLengthPrefixedString()

    if (!state[id]) state[id] = {}
    state[id].lock = true
  }

  else if (method === 0x05) {
    const x = decoder.readUInt16()
    const y = decoder.readUInt16()
    const source = decoder.readLengthPrefixedString()
    const id = decoder.readLengthPrefixedString()

    state[id] = { source, x, y }
  }

  else return

  if (decoder.length()) _handleMessageInner(decoder)
}

function handleMessage (message) {
  return _handleMessageInner(new decode.Decoder(Buffer.from(message)))
}

function _batchObjectPositionsInner (keys) {
  if (keys.length === 0) return new Buffer([])
  const entry = state[keys[0]]

  const nextCmd = entry.source
    ? encode.addObject(keys[0], entry.source, entry.x, entry.y)
    : encode.moveObject(keys[0], entry.x, entry.y)

  const lockCmd = entry.lock
    ? encode.lockObject(keys[0])
    : new Buffer([])

  return Buffer.concat([
    nextCmd,
    lockCmd,
    _batchObjectPositionsInner(keys.slice(1))
  ])
}

function batchObjectPositions () {
  return _batchObjectPositionsInner(Object.keys(state))
}

function broadcast (source, message, sockets) {
  sockets.forEach((socket) => {
    if (socket === source) return
    socket.send(message)
  })
  handleMessage(message)
}

let nextColor = 0
const colors = [
  '#ff00ff',
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#0000ff'
]

wss.on('connection', (socket) => {
  const id = uuid()
  console.log('incoming connection', id)

  socket.send(Buffer.concat([
    encode.setColor(colors[nextColor++ % colors.length]),
    batchObjectPositions()
  ]))

  socket.on('message', (message) => {
    // this produces way too many logs
    // console.log('broadcasting message from', id, message)
    broadcast(socket, message, wss.clients)
  })

  socket.on('close', () => {
    console.log('closing connection', id)
  })
})

function loadLocal (file) {
  return fs
    .readFileSync(path.resolve(__dirname, file))
    .toString('utf8')
}

const mainPage = loadLocal('../static/index.html')
const scriptPage = loadLocal('../dist/bundle.js')
const stylePage = loadLocal('../static/style.css')

const server = http.createServer((req, res) => {
  console.log('serving page')
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.write(mainPage
    .replace(
      '<script src="../dist/bundle.js"></script>',
      '<script>' + scriptPage + '</script>')
    .replace(
      '<link type="text/css" rel="stylesheet"href="./style.css" />',
      '<style>' + stylePage + '</style>'))
  res.end()
})

console.log('listening on 35469')
server.listen(35469)
