// Draws docs/screenshots/10b-home-annotated.png: Home with every element numbered and,
// beside it, why it is there (cause → effect), as the brief asks.
//   swift scripts/home-annotated.swift
import AppKit

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let shot = NSImage(contentsOf: root.appendingPathComponent("docs/screenshots/10-home.png"))!
let out = root.appendingPathComponent("docs/screenshots/10b-home-annotated.png")

let canvas = NSColor(red: 0.984, green: 0.965, blue: 0.925, alpha: 1)
let ink = NSColor(red: 0.11, green: 0.098, blue: 0.09, alpha: 1)
let muted = NSColor(red: 0.333, green: 0.325, blue: 0.416, alpha: 1)
let violet = NSColor(red: 0.416, green: 0.373, blue: 0.839, alpha: 1)

// Marker centres on the 1206 × 2622 screenshot, and what each element is for.
let items: [(CGFloat, CGFloat, String, String)] = [
  (26, 269, "Squads + today's date", "A plain title, no promo: you land on your friends, not on us."),
  (742, 299, "+ New squad", "Most people arrive by invite (A1), so starting your own squad is one tap, top right, not the main path."),
  (26, 468, "Live now, first", "A quiet squad feels dead (P1), so Home leads with the squads that are alive right now."),
  (26, 700, "Who's here", "Faces and names are the reason to open it now. Maya's table comes first because she invited you."),
  (26, 852, "The chat, rolling by", "The conversation is already happening: you feel the vibe before you tap in."),
  (26, 1048, "Hangout · Join", "The one next step (RQ10): one tap and you're in a room with your friends."),
  (26, 1216, "Start a room · 2 open now", "Your own move. Focus, study and game rooms are where Squad+ shows up (A2)."),
  (26, 1657, "Quiet · Cousins", "An honest state: says it's quiet and since when, instead of hiding the squad (RQ10)."),
  (26, 1900, "Spark's vote", "Today's spark sits inside the squad's own card, never above your friends (RQ11). Voting pings the squad; you do, not Spark."),
  (26, 2167, "Spark, added by Nia", "The AI is visible and was chosen by a member, so it never feels like a watcher (RQ7, A3)."),
  (26, 2463, "Tab bar", "iOS convention. Messages and Moments hold the other two jobs: studying and sharing moments."),
]

let pad: CGFloat = 90
let shotW: CGFloat = 1206, shotH: CGFloat = 2622
let colX = pad + shotW + 110, colW: CGFloat = 1250
let W = colX + colW + pad, H = shotH + pad * 2

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

func font(_ size: CGFloat, _ bold: Bool) -> NSFont {
  NSFont(name: bold ? "Rubik-SemiBold" : "Rubik-Regular", size: size)
    ?? NSFont.systemFont(ofSize: size, weight: bold ? .semibold : .regular)
}

/// Text drawn top-down at (x, y); returns its height.
@discardableResult
func text(_ s: String, _ f: NSFont, _ c: NSColor, x: CGFloat, y: CGFloat, w: CGFloat, align: NSTextAlignment = .left) -> CGFloat {
  let style = NSMutableParagraphStyle()
  style.lineSpacing = f.pointSize * 0.2
  style.alignment = align
  let a = NSAttributedString(string: s, attributes: [.font: f, .foregroundColor: c, .paragraphStyle: style])
  let r = a.boundingRect(with: NSSize(width: w, height: 3000), options: [.usesLineFragmentOrigin])
  NSGraphicsContext.saveGraphicsState()
  let t = NSAffineTransform()
  t.translateX(by: 0, yBy: y + r.height)
  t.scaleX(by: 1, yBy: -1)
  t.concat()
  a.draw(with: NSRect(x: x, y: 0, width: w, height: r.height), options: [.usesLineFragmentOrigin])
  NSGraphicsContext.restoreGraphicsState()
  return r.height
}

// The screenshot, rounded like a phone, on the app's soft lip.
let frame = NSRect(x: pad, y: pad, width: shotW, height: shotH)
NSColor(red: 0.886, green: 0.89, blue: 0.937, alpha: 1).setFill()
NSBezierPath(roundedRect: frame.offsetBy(dx: 0, dy: 10), xRadius: 110, yRadius: 110).fill()
NSGraphicsContext.saveGraphicsState()
NSBezierPath(roundedRect: frame, xRadius: 110, yRadius: 110).addClip()
NSGraphicsContext.saveGraphicsState()
let flip = NSAffineTransform()
flip.translateX(by: 0, yBy: pad * 2 + shotH)
flip.scaleX(by: 1, yBy: -1)
flip.concat()
shot.draw(in: NSRect(x: pad, y: pad, width: shotW, height: shotH))
NSGraphicsContext.restoreGraphicsState()
NSGraphicsContext.restoreGraphicsState()

func marker(_ n: Int, x: CGFloat, y: CGFloat, r: CGFloat) {
  violet.setFill()
  NSBezierPath(ovalIn: NSRect(x: x - r, y: y - r, width: r * 2, height: r * 2)).fill()
  let f = font(r * 1.1, true)
  let h = f.ascender - f.descender
  text("\(n)", f, .white, x: x - r, y: y - h / 2, w: r * 2, align: .center)
}

for (i, it) in items.enumerated() {
  marker(i + 1, x: pad + it.0 - 4, y: pad + it.1, r: 21)
}

// The column: title, then one row per element.
var y = pad + 20
text("HOME · TWO MINUTES AFTER ONBOARDING", font(30, true), violet, x: colX, y: y, w: colW)
y += 56
y += text("Every element, and why it's there", font(64, true), ink, x: colX, y: y, w: colW) + 50
for (i, it) in items.enumerated() {
  marker(i + 1, x: colX + 30, y: y + 30, r: 30)
  let h1 = text(it.2, font(40, true), ink, x: colX + 84, y: y + 6, w: colW - 84)
  let h2 = text(it.3, font(36, false), muted, x: colX + 84, y: y + 14 + h1, w: colW - 84)
  y += max(66, h1 + h2 + 24) + 26
}
y += 20
text("NOT HERE, ON PURPOSE", font(30, true), violet, x: colX, y: y, w: colW)
y += 52
text("Streaks (42% of teens would remove them), an AI card at the top, ads, and an empty \"explore\" feed.", font(36, false), muted, x: colX, y: y, w: colW)

try! rep.representation(using: .png, properties: [:])!.write(to: out)
print("wrote \(out.path)")
