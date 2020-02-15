import { Hand } from "./Hand"
import { Tile, isPair, isSet, isHonor, isTerminal } from "./Tile"

export const AGARI_YAME = -1

export function shanten(hand: Hand): number {
  checkHandValid(hand)
  return Math.min(basicShanten(hand), chiToitsuShanten(hand), kokushiShanten(hand))
}

function checkHandValid(hand: Hand): void {
  let tiles = 0
  for (let block of hand) {
    tiles += block.length
  }
  if (tiles !== 14 && tiles !== 13) {
    throw new Error("Shaten can be calculated only for hands with 13 or 14 tiles")
  }
}

function basicShanten(hand: Hand): number {
  let num = AGARI_YAME
  hand = hand.slice()
  if (!removeBlock(hand, isPair)) {
    num += 1
  }
  for (let i = 0; i < 4; i++) {
    if (removeBlock(hand, isSet)) {
      continue
    } else if (removeBlock(hand, b => b.length === 2)) {
      num += 1
    } else if (removeBlock(hand, b => b.length === 1)) {
      num += 2
    } else {
      throw new Error("Should not be possible with valid hands...")
    }
  }
  return num
}

function chiToitsuShanten(hand: Hand): number {
  let num = AGARI_YAME
  hand = hand.slice()
  for (let i = 0; i < 7; i++) {
    if (!removeBlock(hand, isPair)) {
      num += 1
    }
  }
  return num
}

function kokushiShanten(hand: Hand): number {
  let num = AGARI_YAME
  let used = new Set<Tile>()
  let hasPair = false
  for (let block of hand) {
    for (let tile of block) {
      if (isHonor(tile) || isTerminal(tile)) {
        if (used.has(tile)) {
          if (!hasPair) {
            hasPair = true
          } else {
            num += 1
          }
        } else {
          used.add(tile)
        }
      } else {
        num += 1
      }
    }
  }
  return num
}

function removeBlock(hand: Hand, pred: (block: Tile[]) => boolean): boolean {
  const idx = hand.findIndex(pred)
  if (idx !== -1) {
    hand.splice(idx, 1)
    return true
  }
  return false
}
