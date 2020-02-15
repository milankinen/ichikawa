import { parse } from "../Tile"
import { potentialHands } from "../Hand"
import { shanten, AGARI_YAME } from "../Shanten"

describe("shanten calculation", () => {
  const handShanten = (handStr: string) =>
    potentialHands(parse(handStr))
      .map(shanten)
      .sort()[0]

  it("handles basic cases", () => {
    expect(handShanten("567m11p111234567s")).toEqual(AGARI_YAME)
    expect(handShanten("567m11p111345677s")).toEqual(0)
    expect(handShanten("567m15p111345677s")).toEqual(1)
    expect(handShanten("1578m15p11134567s")).toEqual(2)
    expect(handShanten("1358m1358p113456s")).toEqual(3)
    expect(handShanten("1358m13588p1589s1w")).toEqual(4)
    expect(handShanten("1358m13588p159s12w")).toEqual(5)
    expect(handShanten("1358m258p1589s123w")).toEqual(6)
    expect(handShanten("11123456788999s")).toEqual(AGARI_YAME)
    expect(handShanten("11122245679999s")).toEqual(0)
  })

  it("handles chi toitsu", () => {
    expect(handShanten("77m114477p114477s")).toEqual(AGARI_YAME)
    expect(handShanten("76m114477p114477s")).toEqual(0)
    expect(handShanten("76m114479p114477s")).toEqual(1)
    expect(handShanten("76m14479p114477s1w")).toEqual(2)
  })

  it("handles kokushi musou", () => {
    expect(handShanten("19m19p19s12345677w")).toEqual(AGARI_YAME)
    expect(handShanten("19m19p129s1234567w")).toEqual(0)
    expect(handShanten("19m129p129s123456w")).toEqual(1)
    expect(handShanten("129m129p129s12345w")).toEqual(2)
  })
})
