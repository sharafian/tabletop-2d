const encode = require('../src/encode')
const objects = [
  ['chess-board', '/img/board.png', 30, 30],

  ['chess-rook-1-black', '/img/black_rook.png', 35, 35],
  ['chess-knight-1-black', '/img/black_knight.png', 95, 35],
  ['chess-bishop-1-black', '/img/black_bishop.png', 155, 35],
  ['chess-queen-black', '/img/black_queen.png', 215, 35],
  ['chess-king-black', '/img/black_king.png', 275, 35],
  ['chess-bishop-2-black', '/img/black_bishop.png', 335, 35],
  ['chess-knight-2-black', '/img/black_knight.png', 395, 30],
  ['chess-rook-2-black', '/img/black_rook.png', 455, 30],

  ['chess-pawn-1-black', '/img/black_pawn.png', 35, 95],
  ['chess-pawn-2-black', '/img/black_pawn.png', 95, 95],
  ['chess-pawn-3-black', '/img/black_pawn.png', 155, 95],
  ['chess-pawn-4-black', '/img/black_pawn.png', 215, 95],
  ['chess-pawn-5-black', '/img/black_pawn.png', 275, 95],
  ['chess-pawn-6-black', '/img/black_pawn.png', 335, 95],
  ['chess-pawn-7-black', '/img/black_pawn.png', 395, 95],
  ['chess-pawn-8-black', '/img/black_pawn.png', 455, 95],

  ['chess-rook-1-white', '/img/white_rook.png', 35, 455],
  ['chess-knight-1-white', '/img/white_knight.png', 95, 455],
  ['chess-bishop-1-white', '/img/white_bishop.png', 155, 455],
  ['chess-king-white', '/img/white_king.png', 215, 455],
  ['chess-queen-white', '/img/white_queen.png', 275, 455],
  ['chess-bishop-2-white', '/img/white_bishop.png', 335, 455],
  ['chess-knight-2-white', '/img/white_knight.png', 395, 455],
  ['chess-rook-1-white', '/img/white_rook.png', 455, 455],

  ['chess-pawn-1-white', '/img/white_pawn.png', 35, 395],
  ['chess-pawn-2-white', '/img/white_pawn.png', 95, 395],
  ['chess-pawn-3-white', '/img/white_pawn.png', 155, 395],
  ['chess-pawn-4-white', '/img/white_pawn.png', 215, 395],
  ['chess-pawn-5-white', '/img/white_pawn.png', 275, 395],
  ['chess-pawn-6-white', '/img/white_pawn.png', 335, 395],
  ['chess-pawn-7-white', '/img/white_pawn.png', 395, 395],
  ['chess-pawn-8-white', '/img/white_pawn.png', 455, 395]
]

const encoded = Buffer
  .concat([
    ...objects.map((e) => encode.addObject.apply(null, e)),
    encode.lockObject('chess-board')
  ])
  .toString('base64')

console.log(encoded)
