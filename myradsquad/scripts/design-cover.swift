// Draws docs/screenshots/00-cover.png: the first page of the design file.
// The brief asks for the AI tools at the top of the design file; they are read from
// docs/AI_TOOLS.md (lines starting with "1.", "2.", "3."), so edit that file and rerun:
//   swift scripts/design-cover.swift
import AppKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let toolsFile = root.appendingPathComponent("docs/AI_TOOLS.md")
let out = root.appendingPathComponent("docs/screenshots/00-cover.png")

func clean(_ s: String) -> String {
  s.replacingOccurrences(of: "**", with: "").replacingOccurrences(of: "_", with: "")
    .trimmingCharacters(in: .whitespaces)
}

// Numbered items, joined across wrapped lines.
var tools: [String] = []
if let text = try? String(contentsOf: toolsFile, encoding: .utf8) {
  for line in text.components(separatedBy: "\n") {
    let t = line.trimmingCharacters(in: .whitespaces)
    if let first = t.first, first.isNumber, t.dropFirst().hasPrefix(".") {
      tools.append(clean(String(t.dropFirst(2))))
    } else if !t.isEmpty, !tools.isEmpty, !t.hasPrefix("#"), !t.hasPrefix(">") {
      tools[tools.count - 1] += " " + clean(t)
    }
  }
}

let W: CGFloat = 1206, H: CGFloat = 2622
let canvas = NSColor(red: 0.984, green: 0.965, blue: 0.925, alpha: 1)
let ink = NSColor(red: 0.11, green: 0.098, blue: 0.09, alpha: 1)
let muted = NSColor(red: 0.333, green: 0.325, blue: 0.416, alpha: 1)
let violet = NSColor(red: 0.416, green: 0.373, blue: 0.839, alpha: 1)
let white = NSColor.white

let rep = NSBitmapImageRep(
  bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H), bitsPerSample: 8,
  samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB,
  bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
let ctx = NSGraphicsContext.current!.cgContext
ctx.translateBy(x: 0, y: H)
ctx.scaleBy(x: 1, y: -1)

canvas.setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()

func font(_ size: CGFloat, _ weight: NSFont.Weight) -> NSFont {
  NSFont(name: weight == .semibold ? "Rubik-SemiBold" : "Rubik-Regular", size: size)
    ?? NSFont.systemFont(ofSize: size, weight: weight)
}

var y: CGFloat = 150
let x: CGFloat = 96, width = W - 192

@discardableResult
func draw(_ s: String, _ f: NSFont, _ c: NSColor, gap: CGFloat = 16, at left: CGFloat = x, w: CGFloat = width) -> CGFloat {
  let style = NSMutableParagraphStyle()
  style.lineSpacing = f.pointSize * 0.25
  let attr = NSAttributedString(string: s, attributes: [.font: f, .foregroundColor: c, .paragraphStyle: style])
  let rect = attr.boundingRect(with: NSSize(width: w, height: 2000), options: [.usesLineFragmentOrigin])
  NSGraphicsContext.saveGraphicsState()
  let flip = NSAffineTransform()
  flip.translateX(by: 0, yBy: y + rect.height)
  flip.scaleX(by: 1, yBy: -1)
  flip.concat()
  attr.draw(with: NSRect(x: left, y: 0, width: w, height: rect.height), options: [.usesLineFragmentOrigin])
  NSGraphicsContext.restoreGraphicsState()
  y += rect.height + gap
  return rect.height
}


draw("MYRADSQUAD · CASE A", font(30, .semibold), violet, gap: 18)
draw("Design file", font(96, .semibold), ink, gap: 20)
draw("Screenshots of the working iOS build (Expo / React Native), in flow order.", font(38, .regular), muted, gap: 80)

// AI tools
draw("AI TOOLS USED", font(30, .semibold), violet, gap: 28)
for (i, t) in tools.prefix(3).enumerated() {
  draw("\(i + 1). \(t)", font(38, .regular), ink, gap: 30)
}
y += 60

// Creepy / spammy
draw("SPARK · WHAT WOULD FEEL CREEPY OR SPAMMY TO A 15-YEAR-OLD", font(30, .semibold), violet, gap: 28)
let risks: [(String, String)] = [
  ("It reads things it shouldn't (DMs, photos, faces, location)", "the rules card: reads only this chat (12, 15)"),
  ("It's there without anyone choosing it, and you can't turn it off", "\"Maya added Spark\" + Mute, and anyone can remove it (13, 15)"),
  ("It pings you all day or sits above your friends", "at most one spark a day, only when the chat is quiet, inside the squad's card (10, 11, 14)"),
  ("It pretends to be a friend", "an object, not a mascot: a sparkle in a chat bubble, labelled AI (13)"),
]
for (risk, fix) in risks {
  draw("× " + risk, font(36, .semibold), ink, gap: 8)
  draw("→ " + fix, font(36, .regular), muted, gap: 30)
}
y += 60

draw("SCREENS", font(30, .semibold), violet, gap: 24)
draw(
  "01 Splash · 02 13+ age gate · 03 Why we ask · 04–06 Feature screens · 07 What are you here for? · 08 Paywall A · 09 Ask a parent · 10 Home · 11 Spark's one notification · 12 AI state 1: a member turns it on · 13 AI state 2: what the squad sees · 14 A quiet squad's spark · 15 Spark controls · 16 Paywall B (variant)",
  font(36, .regular), ink, gap: 0)

try! rep.representation(using: .png, properties: [:])!.write(to: out)
print("wrote \(out.path)")
