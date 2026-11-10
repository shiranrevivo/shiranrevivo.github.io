// usage: polish in out [sharpen=0.4] [feather=2] [maxW=0]
// For a cut-out PNG: gentle unsharp mask on the colour, then a soft edge — the alpha is blurred `feather` px and
// pulled in a touch, so the jagged cut becomes a smooth edge with no dark fringe. Optional downscale (0 = keep).
import AppKit
import CoreImage

let a = CommandLine.arguments
let sharpen = a.count > 3 ? Double(a[3])! : 0.4
let feather = a.count > 4 ? Int(a[4])! : 2
let maxW = a.count > 5 ? Int(a[5])! : 0
var ci = CIImage(data: try! Data(contentsOf: URL(fileURLWithPath: a[1])))!
if sharpen > 0 {
  ci = ci.applyingFilter("CIUnsharpMask", parameters: [kCIInputRadiusKey: 1.6, kCIInputIntensityKey: sharpen]).cropped(to: ci.extent)
}
if maxW > 0 && Int(ci.extent.width) > maxW {
  let s = Double(maxW) / Double(ci.extent.width)
  ci = ci.applyingFilter("CILanczosScaleTransform", parameters: [kCIInputScaleKey: s, kCIInputAspectRatioKey: 1.0])
}
let cg = CIContext().createCGImage(ci, from: ci.extent, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)!
let W = cg.width, H = cg.height
let ctx = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
let p = ctx.data!.bindMemory(to: UInt8.self, capacity: W * H * 4)

// box-blur the alpha twice (≈ gaussian) with radius `feather`
var al = [Double](repeating: 0, count: W * H)
for i in 0..<(W * H) { al[i] = Double(p[i * 4 + 3]) / 255 }
func blur(_ src: [Double], horizontal: Bool) -> [Double] {
  var out = src, r = feather
  if r == 0 { return src }
  let (n, m) = horizontal ? (W, H) : (H, W)
  for j in 0..<m {
    var sum = 0.0
    func idx(_ k: Int) -> Int { horizontal ? j * W + k : k * W + j }
    for k in -r...r { sum += src[idx(min(n - 1, max(0, k)))] }
    for k in 0..<n {
      out[idx(k)] = sum / Double(2 * r + 1)
      sum += src[idx(min(n - 1, k + r + 1))] - src[idx(max(0, k - r))]
    }
  }
  return out
}
var b = al
for _ in 0..<2 { b = blur(blur(b, horizontal: true), horizontal: false) }
for i in 0..<(W * H) {
  let o = i * 4, A = Double(p[o + 3])
  let k = min(1, max(0, (b[i] - 0.2) / 0.8))            // pull the edge in slightly: no dark halo from the old background
  let newA = min(al[i], k)                              // never add alpha where there was none
  if A > 0 { for c in 0..<3 { p[o + c] = UInt8(min(255, Double(p[o + c]) / A * 255 * newA)) } }
  p[o + 3] = UInt8(255 * newA)
}
try! NSBitmapImageRep(cgImage: ctx.makeImage()!).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], W, H)
