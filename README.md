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
