// usage: erase in out x y w h [x y w h …] [--preview dark.png]
// Makes rectangles of a PNG fully transparent (source pixels, top-left origin), e.g. to cut one mark out of a logo.
// --preview writes a copy on a dark background so white artwork can be checked.
import AppKit
var a = Array(CommandLine.arguments.dropFirst())
var preview: String? = nil
if let i = a.firstIndex(of: "--preview") { preview = a[i + 1]; a.removeSubrange(i...(i + 1)) }
let cg = NSBitmapImageRep(data: NSImage(contentsOfFile: a[0])!.tiffRepresentation!)!.cgImage!
let W = cg.width, H = cg.height
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
var i = 2
while i + 3 < a.count {
  let r = CGRect(x: Int(a[i])!, y: H - Int(a[i + 1])! - Int(a[i + 3])!, width: Int(a[i + 2])!, height: Int(a[i + 3])!)
  ctx.clear(r); i += 4
}
let out = ctx.makeImage()!
try! NSBitmapImageRep(cgImage: out).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[1]))
if let pv = preview {
  let c2 = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  c2.setFillColor(CGColor(red: 0.04, green: 0.02, blue: 0.03, alpha: 1)); c2.fill(CGRect(x: 0, y: 0, width: W, height: H))
  c2.draw(out, in: CGRect(x: 0, y: 0, width: W, height: H))
  try! NSBitmapImageRep(cgImage: c2.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: pv))
}
print(a[1], W, H)
