class Decoder {
  constructor (buf) {
    this.buf = buf
  }

  readBytes (n) {
    const ret = this.buf.slice(0, n)
    this.buf = this.buf.slice(n)
    return ret
  }

  readUInt8 () {
    return this.readBytes(1).readUInt8(0)
  }

  readUInt16 () {
    return this.readBytes(2).readUInt16BE(0)
  }

  readLengthPrefixedString () {
    const len = this.readUInt8()
    const str = this.readBytes(len)
    return str.toString('utf8')
  }

  length () {
    return this.buf.length
  }
}

module.exports = { Decoder }
