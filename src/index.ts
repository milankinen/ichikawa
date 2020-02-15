import { parse, isSet } from "./Tile"
import { potentialHands } from "./Hand"
import { shanten } from "./Shanten"

const tiles = parse("123678m111p677s55w")
console.log(tiles)
const t = Date.now()
const hands = potentialHands(tiles)
console.log("took", Date.now() - t, "ms")
hands
  .filter(hand => shanten(hand) === 0)
  .forEach(hand => {
    console.log("HAND", hand, "SHANTEN", shanten(hand))
  })
