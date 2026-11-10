// usage: center in out  — pads a transparent PNG so its solid part (alpha > 50%) sits in the horizontal and vertical middle.
// Soft shadows stay, they just stop pulling the visual centre to one side.
import AppKit
let a = CommandLine.arguments
let cg = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!.cgImage!
let W = cg.width, H = cg.height
let ctx0 = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx0.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
let p = ctx0.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)
var minX = W, minY = H, maxX = 0, maxY = 0
for y in 0..<H { for x in 0..<W where p[(y * W + x) * 4 + 3] > 128 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) } }
let cx = Double(minX + maxX) / 2, cy = Double(minY + maxY) / 2     // centre of the solid part (buffer rows: bottom-up in CG coords)
let padL = max(0, Int((Double(W) - cx) - cx)), padR = max(0, Int(cx - (Double(W) - cx)))
let padB = max(0, Int((Double(H) - cy) - cy)), padT = max(0, Int(cy - (Double(H) - cy)))
let OW = W + padL + padR, OH = H + padT + padB
let ctx = CGContext(data: nil, width: OW, height: OH, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: padL, y: padB, width: W, height: H))
try! NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], OW, OH, "pad L\(padL) R\(padR) T\(padT) B\(padB)")
