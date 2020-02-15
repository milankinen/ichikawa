export type Tile =
  | "1m"
  | "2m"
  | "3m"
  | "4m"
  | "5m"
  | "6m"
  | "7m"
  | "8m"
  | "9m"
  | "1s"
  | "2s"
  | "3s"
  | "4s"
  | "5s"
  | "6s"
  | "7s"
  | "8s"
  | "9s"
  | "1p"
  | "2p"
  | "3p"
  | "4p"
  | "5p"
  | "6p"
  | "7p"
  | "8p"
  | "9p"
  | "1w"
  | "2w"
  | "3w"
  | "4w"
  | "5w"
  | "6w"
  | "7w"

const protorunLookup: Map<Tile, Set<Tile>> = new Map()
;["m", "p", "s"].forEach(c => {
  ;[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(i => {
    const lookup = new Set<Tile>()
    protorunLookup.set(`${i}${c}` as Tile, lookup)
    for (let j = i - 2; j <= i + 2; j++) {
      if (j >= 1 && j <= 9) {
        lookup.add(`${j}${c}` as Tile)
      }
    }
  })
})
;[1, 2, 3, 4, 5, 6, 7].forEach(i => {
  const tile = `${i}w` as Tile
  protorunLookup.set(tile, new Set([tile]))
})

export function parse(hand: string): Tile[] {
  const regex = /[1-9]+[wmsp]/g
  const tiles: Tile[] = []
  let match: RegExpExecArray | null = null

  while ((match = regex.exec(hand)) !== null) {
    const s = match[0]
    for (let i = 0; i < s.length - 1; i++) {
      tiles.push(`${parseInt(s[i], 10)}${s[s.length - 1]}` as Tile)
    }
  }
  return sortTiles(tiles)
}

export function isHonor(tile: Tile): boolean {
  return tile[1] === "w"
}

export function isTerminal(tile: Tile): boolean {
  if (isHonor(tile)) {
    return false
  }
  const num = getNumber(tile)
  return num === 1 || num === 9
}

export function getKind(tile: Tile): string {
  return tile[1]
}

export function getNumber(tile: Tile): number {
  return parseInt(tile[0])
}

export function canFormSet(a: Tile, b: Tile): boolean {
  const s = protorunLookup.get(a)
  if (s !== undefined) {
    return s.has(b)
  } else {
    return false
  }
}

export function isSet(block: Tile[]): boolean {
  if (block.length !== 3) {
    return false
  }
  const [a, b, c] = block
  if (getKind(a) === getKind(b) && getKind(b) === getKind(c)) {
    const [n1, n2, n3] = [getNumber(a), getNumber(b), getNumber(c)].sort()
    return (n1 === n2 && n2 === n3) || (!isHonor(a) && (n1 + 1 === n2 && n2 + 1 === n3))
  } else {
    return false
  }
}

export function isPair(block: Tile[]): boolean {
  if (block.length !== 2) {
    return false
  }
  const [a, b] = block
  return a === b
}

const kindValues: Record<string, number> = {
  m: 10,
  p: 20,
  s: 30,
  w: 40,
}

export function sortTiles(tiles: Tile[]): Tile[] {
  const tileValue = (tile: Tile) => (kindValues[getKind(tile)] || 0) + getNumber(tile)
  return tiles.slice().sort((a, b) => tileValue(a) - tileValue(b))
}
