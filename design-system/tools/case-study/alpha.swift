// prints: file WxH  transparent% (alpha<10)  corner alpha
import AppKit
for f in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: f), let r = NSBitmapImageRep(data: img.tiffRepresentation!) else { continue }
  let W = r.pixelsWide, H = r.pixelsHigh
  guard r.hasAlpha else { print("\(f) \(W)x\(H) noalpha"); continue }
  var t = 0, n = 0
  for y in stride(from: 0, to: H, by: 8) { for x in stride(from: 0, to: W, by: 8) { n += 1; if r.colorAt(x: x, y: y)!.alphaComponent < 0.04 { t += 1 } } }
  print("\(f) \(W)x\(H) transparent=\(t * 100 / n)% corner=\(r.colorAt(x: 2, y: 2)!.alphaComponent)")
}
