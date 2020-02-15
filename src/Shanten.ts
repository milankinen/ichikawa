import { Hand } from "./Hand"
import { Tile, isPair, isSet } from "./Tile"

export function shanten(hand: Hand): number {
  hand = [...hand]
  let num = -1
  if (!remove(hand, isPair)) {
    num += 1
  }
  for (let i = 0; i < 4; i++) {
    if (remove(hand, isSet)) {
      continue
    } else if (remove(hand, b => b.length === 2)) {
      num += 1
    } else if (remove(hand, b => b.length === 1)) {
      num += 2
    } else {
      throw new Error("Should not be possible with valid hands...")
    }
  }
  return num
}

function remove(hand: Hand, pred: (block: Tile[]) => boolean): boolean {
  const idx = hand.findIndex(pred)
  if (idx !== -1) {
    hand.splice(idx, 1)
    return true
  }
  return false
}
