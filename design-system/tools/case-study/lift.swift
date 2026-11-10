// usage: lift in out maxW [x y w h]  — optional source crop, then Vision "lift subject": keeps every foreground instance,
// background becomes transparent, cropped to the subjects. Saves PNG.
import AppKit
import Vision
import CoreImage

let a = CommandLine.arguments
var cg = NSBitmapImageRep(data: NSImage(contentsOfFile: a[1])!.tiffRepresentation!)!.cgImage!
if a.count > 7 { cg = cg.cropping(to: CGRect(x: Int(a[4])!, y: Int(a[5])!, width: Int(a[6])!, height: Int(a[7])!))! }
let handler = VNImageRequestHandler(cgImage: cg)
let req = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([req])
guard let obs = req.results?.first else { print("no subject found"); exit(1) }
print("instances:", obs.allInstances.count)
let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: handler, croppedToInstancesExtent: true)
let ci = CIImage(cvPixelBuffer: buf)
let out = CIContext().createCGImage(ci, from: ci.extent)!
let maxW = Int(a[3])!
let s = min(1.0, Double(maxW) / Double(out.width))
let ow = Int(Double(out.width) * s), oh = Int(Double(out.height) * s)
let ctx = CGContext(data: nil, width: ow, height: oh, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .high
ctx.draw(out, in: CGRect(x: 0, y: 0, width: ow, height: oh))
try! NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], ow, oh)
