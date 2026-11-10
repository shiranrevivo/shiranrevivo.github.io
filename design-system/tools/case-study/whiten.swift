// whiten in out — turns grey/black (low-saturation) pixels white, keeps coloured pixels and alpha
import Foundation; import CoreGraphics; import ImageIO; import UniformTypeIdentifiers
let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!
let img = CGImageSourceCreateImageAtIndex(src, 0, nil)!
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w*h*4)
let ctx = CGContext(data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w*4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
for i in stride(from: 0, to: px.count, by: 4) {
  let al = Int(px[i+3]); if al == 0 { continue }
  let r = Int(px[i])*255/al, g = Int(px[i+1])*255/al, b = Int(px[i+2])*255/al
  let mx = max(r,g,b), mn = min(r,g,b)
  let sat = mx == 0 ? 0 : (mx-mn)*100/mx
  if sat < 25 { px[i] = UInt8(al); px[i+1] = UInt8(al); px[i+2] = UInt8(al) }
}
let out = ctx.makeImage()!
let d = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(d, out, nil); CGImageDestinationFinalize(d)
