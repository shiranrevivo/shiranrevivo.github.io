// usage: trim in out maxW [x y w h]  — optional source crop first, then trim fully-transparent margins (alpha <= 8/255), resize, save PNG
import AppKit
let a = CommandLine.arguments
let rep = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!
var cg = rep.cgImage!
if a.count > 7 { cg = cg.cropping(to: CGRect(x: Int(a[4])!, y: Int(a[5])!, width: Int(a[6])!, height: Int(a[7])!))! }
// redraw into a known RGBA buffer to read alpha
let W = cg.width, H = cg.height
let ctx0 = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx0.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
let p = ctx0.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)
var minX = W, minY = H, maxX = 0, maxY = 0
for y in 0..<H { for x in 0..<W where p[(y * W + x) * 4 + 3] > 8 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) } }
let full = ctx0.makeImage()!
let box = CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)   // buffer rows are top-down here
let cut = full.cropping(to: box)!
let maxW = Int(a[3])!
let s = min(1.0, Double(maxW) / Double(cut.width))
let ow = Int(Double(cut.width) * s), oh = Int(Double(cut.height) * s)
let ctx = CGContext(data: nil, width: ow, height: oh, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(cut, in: CGRect(x: 0, y: 0, width: ow, height: oh))
try! NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], ow, oh)
