import { Tile, canFormSet, isSet } from "./Tile"

export type Block = Tile[]
export type Hand = Block[]

export function potentialHands(tiles: Tile[]): Hand[] {
  return findHands(toLinked(tiles))
}

function findHands(tiles: LinkedTiles): Hand[] {
  const result: Hand[] = []
  const firstTile = first(tiles)
  const collect = (block: Block) => {
    findHands(tiles).forEach(hand => {
      hand.unshift(block)
      result.push(hand)
    })
  }
  if (firstTile !== null) {
    take(firstTile, first => {
      collect([first])
      let secondTile = next(firstTile)
      while (secondTile !== null) {
        const valid = take(secondTile, second => {
          if (canFormSet(first, second)) {
            collect([first, second])
            let thirdTile = next(secondTile as LinkedTile)
            while (thirdTile !== null) {
              const valid = take(thirdTile, third => {
                if (isSet([first, second, third])) {
                  collect([first, second, third])
                  return true
                } else {
                  return false
                }
              })
              thirdTile = valid ? next(thirdTile) : null
            }
            return true
          } else {
            return false
          }
        })
        secondTile = valid ? next(secondTile) : null
      }
    })
    return result
  } else {
    return [[]]
  }
}

type LinkedTiles = {
  head: LinkedTile
  tail: LinkedTile
}

type LinkedTile = {
  prev: LinkedTile
  next: LinkedTile
  value: Tile
}

function first(hand: LinkedTiles): LinkedTile | null {
  return isEmpty(hand) ? null : hand.head.next
}

function next(tile: LinkedTile): LinkedTile | null {
  const n = tile.next
  return n.next === null ? null : n
}

function take<R>(tile: LinkedTile, f: (value: Tile) => R): R {
  const prev = tile.prev
  const next = tile.next
  prev.next = next
  next.prev = prev
  const result = f(tile.value)
  next.prev = tile
  prev.next = tile
  return result
}

function toLinked(tiles: Tile[]): LinkedTiles {
  const head = ({ prev: null, next: null, value: null } as any) as LinkedTile
  let tail = head
  for (let i = 0; i < tiles.length; i++) {
    tail.next = ({ prev: tail, next: null, value: tiles[i] } as any) as LinkedTile
    tail = tail.next
  }
  tail = tail.next = ({ prev: tail, next: null, value: null } as any) as LinkedTile
  return { head, tail }
}

function isEmpty(hand: LinkedTiles): boolean {
  return hand.head.next === hand.tail
}
