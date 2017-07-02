# Tabletop 2d

Tabletop 2d is a project to create something akin to [Tabletop
Simulator](http://berserk-games.com/tabletop-simulator/), but for the browser.

Instead of using 3d models, Tabletop 2d uses regular images. This means it'll
be easier to port any game's pieces into it.

To test the game on localhost, run:

```
npm install
npm start
```

Hit `Shift+D` to bring up the "load file" prompt, and enter `/chess.dat`.
You'll see a set-up chess board appear on the page. You can look at
`scripts/generate-chess.js` to see how to make a file yourself.

_Note: The assets used for the chess example were created by user 'Cburnett' on
Wikipedia, and are under the [CC BY-SA
3.0](http://creativecommons.org/licenses/by-sa/3.0/) license_

## Planned Features

- ~~Loading many objects from a file~~
- ~~Set Grid~~
- Websocket Reconnection
- Decks
- Dice
- Multiple boards on one server
- Deleting objects
- Unlocking objects
- Snap to Grid

## RPC Format

Tabletop 2d uses a binary format for RPC, in order to minimize the amount of
data transmitted when objects are being moved. RPC calls can be batched
together through concatenation.

### Set Color

```
01 ff 00 00
1  2
```

1. The method byte, `01`.
2. The 8-bit RGB color.

### Move Object

```
02 00 c1 01 81 07 6f 62 6a 65 63 74 31
1  2     3     4  5
```

1. The method byte, `02`.
2. The 2-byte x (left) position of the object.
3. The 2-byte y (top) position of the object.
4. The length prefix for the element ID.
5. The element ID, `object1`.

### Grab Object

```
03 ff 00 00 07 6f 62 6a 65 63 74 31
1  2        3  4
```

1. The method byte, `03`.
2. The 8-bit RGB color.
3. The length prefix for the element ID.
4. The element ID, `object1`.

### Drop Object

```
04 07 6f 62 6a 65 63 74 31
1  2  3
```

1. The method byte, `04`.
2. The length prefix for the element ID.
3. The element ID, `object1`.

### Add Object

```
05 00 c1 01 81 1a 68 74 74 70 3a 2f 2f 65 78 61 6d 70 6c 65 2e 63 6f 6d 2f 69 6d
1  2     3     4  5

67 2e 70 6e 67 07 6f 62 6a 65 63 74 31
               6  7
```

1. The method byte, `05`.
2. The x coordinate (left) to add the object at.
3. The y coordinate (top) to add the object at.
4. The length prefix for the image source.
5. The image source, `http://example.com/image.png`.
6. The length prefix for the element ID.
7. The element ID, `object1`.

### Lock Object

```
06 07 6f 62 6a 65 63 74 31
1  2  3
```

1. The method byte, `06`.
2. The length prefix for the element ID.
3. The element ID, `object1`.

### Grid Size

```
07 00 20
1  2
```

1. The method byte, `07`.
2. The grid size, in pixels.

### Add Die

```
08 00 c1 01 81 02 09 2f 63 6f 69 6e 31 2e 70 6e 67 09 2f 63 6f 69 6e 32 2e 70 
1  2     3     4  5  6                             7  8

6e 67 07 6f 62 6a 65 63 74 31
      9  10
```

1. The method byte, `08`.
2. The x coordinate (left) to add the die at.
3. The y coordinate (top) to add the die at.
4. Length prefix for a list of sides, `02`.
5. Length prefix for first side's image source.
6. First side's image source, `/coin1.png`.
7. Length prefix for the second side's image source.
8. Second side's image source, `/coin2.png`.
9. Length prefix for the die's ID.
10. The die's ID, `object1`.

### Roll Die

```
09 07 6f 62 6a 65 63 74 31
1  2  3
```

1. The method byte, `09`.
2. Length prefix for the die's ID.
3. The die's ID, `object1`.

### Chat Message

```
0a 0b 68 65 6c 6c 6f 20 77 6f 72 6c 64
1  2  3
```

1. The method byte, `0a`.
2. Length prefix for the chat message.
3. Message contents (utf-8 encoded), `hello world`. 

### Private Chat Message

```
0b 05 61 6c 69 63 65 0b 68 65 6c 6c 6f 20 77 6f 72 6c 64
1  2  3              4  5
```

1. The method byte, `0b`.
2. Length prefix for the target nickname.
3. The target nickname (utf-8 encoded), `alice`.
4. Length prefix for the chat message.
5. Message contents (utf-8 encoded), `hello world`.
