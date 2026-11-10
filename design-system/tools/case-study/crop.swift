// usage: crop in out x y w h maxW [bx by bw bh ...]
// crop (top-left px), erase rects (source px) by blending each column between the rows just above and below, resize, save jpg/png
import AppKit

let a = CommandLine.arguments
let rep = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!
let W = rep.pixelsWide, H = rep.pixelsHigh
let x = Int(a[3])!, y = Int(a[4])!, w = Int(a[5])!, h = Int(a[6])!
let maxW = Int(a[7])!
// erase on the raw bytes (8-bit RGB/RGBA): each channel blends from the darkest of 15 pixels just above to those just below
let buf = rep.bitmapData!, spp = rep.samplesPerPixel, bpr = rep.bytesPerRow
func px(_ x: Int, _ y: Int) -> Int { y * bpr + x * spp }
func edge(_ cx: Int, _ cy: Int) -> Int {   // offset of the darkest pixel around (cx, cy) on that row, so stars don't streak
  var best = px(cx, cy), lum = Int.max
  for x in max(0, cx - 7)...min(W - 1, cx + 7) {
    let o = px(x, cy), l = Int(buf[o]) + Int(buf[o + 1]) + Int(buf[o + 2])
    if l < lum { lum = l; best = o }
  }
  return best
}
var i = 8
while i + 3 < a.count {
  let bx = Int(a[i])!, by = Int(a[i+1])!, bw = Int(a[i+2])!, bh = Int(a[i+3])!; i += 4
  for cx in max(0, bx)..<min(W, bx + bw) {
    let t0 = edge(cx, max(0, by - 3)), b0 = edge(cx, min(H - 1, by + bh + 2))
    for cy in by..<min(H, by + bh) {
      let t = Double(cy - by + 1) / Double(bh + 1), o = px(cx, cy)
      for c in 0..<3 { buf[o + c] = UInt8(Double(buf[t0 + c]) * (1 - t) + Double(buf[b0 + c]) * t) }
    }
  }
}
let cg = rep.cgImage!.cropping(to: CGRect(x: x, y: y, width: min(w, W - x), height: min(h, H - y)))!
let scale = min(1.0, Double(maxW) / Double(cg.width))
let ow = Int(Double(cg.width) * scale), oh = Int(Double(cg.height) * scale)
let png = a[2].hasSuffix(".png")
let ctx = CGContext(data: nil, width: ow, height: oh, bitsPerComponent: 8, bytesPerRow: 0,
                    space: CGColorSpace(name: CGColorSpace.sRGB)!,
                    bitmapInfo: png ? CGImageAlphaInfo.premultipliedLast.rawValue : CGImageAlphaInfo.noneSkipLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: ow, height: oh))
let out = NSBitmapImageRep(cgImage: ctx.makeImage()!)
let data = png ? out.representation(using: .png, properties: [:])!
               : out.representation(using: .jpeg, properties: [.compressionFactor: 0.86])!
try! data.write(to: URL(fileURLWithPath: a[2]))
print(a[2], ow, oh)
