const ws = require('ws')
const uuid = require('uuid')
const Koa = require('koa')
const koaServe = require('koa-static')
const koaProxy = require('koa-proxy')
const router = require('koa-router')()
const path = require('path')

const app = new Koa()
app.use(koaServe(path.resolve(__dirname, '../static')))
app.use(koaServe(path.resolve(__dirname, '../dist')))

const port = process.env.TABLETOP_PORT || 35469
console.log('listening on ' + port)
const server = app.listen(port)

const encode = require('./encode')
const decode = require('./decode')

const wss = new ws.Server({
  perMessageDeflate: false,
  server: server
})

let gridSize = 0
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

  else if (method === 0x07) {
    const size = decoder.readUInt16()
    gridSize = size    
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
    encode.setGrid(gridSize),
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
