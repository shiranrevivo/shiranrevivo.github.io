// usage: solid in out maxW [lo hi]  — drops soft shadows/haze from a transparent PNG: alpha below lo becomes 0,
// above hi stays solid, a short ramp between keeps the device edges smooth. Then trims to the content. Saves PNG.
import AppKit
let a = CommandLine.arguments
let cg0 = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!.cgImage!
let maxW = Int(a[3])!, lo = a.count > 4 ? Double(a[4])! : 150, hi = a.count > 5 ? Double(a[5])! : 235
let s = min(1.0, Double(maxW) / Double(cg0.width))
let W = Int(Double(cg0.width) * s), H = Int(Double(cg0.height) * s)
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(cg0, in: CGRect(x: 0, y: 0, width: W, height: H))
let p = ctx.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)
var minX = W, minY = H, maxX = 0, maxY = 0
for y in 0..<H { for x in 0..<W {
  let o = (y * W + x) * 4
  let A = Double(p[o + 3])
  let k = min(1, max(0, (A - lo) / (hi - lo)))          // new alpha as a fraction of full
  if A > 0 { for c in 0..<3 { p[o + c] = UInt8(min(255, Double(p[o + c]) / A * 255 * k)) } }   // re-premultiply by the new alpha
  p[o + 3] = UInt8(255 * k)
  if k > 0 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) }
}}
let cut = ctx.makeImage()!.cropping(to: CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1))!
try! NSBitmapImageRep(cgImage: cut).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], cut.width, cut.height)
