// usage: blackkey in out maxW [lo hi]  — near-black becomes transparent: alpha ramps from 0 (max channel <= lo) to 1 (>= hi).
// The slide backdrop was black, so the stored RGB is already the colour premultiplied by that alpha.
import AppKit
let a = CommandLine.arguments
let cg0 = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!.cgImage!
let maxW = Int(a[3])!, lo = a.count > 4 ? Double(a[4])! : 6, hi = a.count > 5 ? Double(a[5])! : 26
let s = min(1.0, Double(maxW) / Double(cg0.width))
let W = Int(Double(cg0.width) * s), H = Int(Double(cg0.height) * s)
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(cg0, in: CGRect(x: 0, y: 0, width: W, height: H))
let p = ctx.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)
for i in 0..<(W * H) {
  let o = i * 4
  let m = Double(max(p[o], p[o + 1], p[o + 2]))
  let al = min(1, max(0, (m - lo) / (hi - lo)))
  let A = UInt8(al * 255)
  p[o + 3] = A
  for c in 0..<3 { p[o + c] = min(p[o + c], A) }   // keep it valid premultiplied
}
try! NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], W, H)
