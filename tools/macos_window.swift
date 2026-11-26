// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
// Report visible application windows for the desktop smoke test.
import AppKit
import CoreGraphics
import Foundation

if CommandLine.arguments[1] == "--check-dark" {
    let appearance = NSApplication.shared.effectiveAppearance
    let match = appearance.bestMatch(from: [.darkAqua, .aqua])
    print("AppKit appearance: \(match?.rawValue ?? "unknown")")
    let image = NSBitmapImageRep(data: try Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[2])))!
    let background = image.colorAt(x: image.pixelsWide / 2, y: image.pixelsHigh / 4)!.usingColorSpace(.deviceRGB)!
    print("Window background brightness: \(background.brightnessComponent)")
    exit(match == .darkAqua && background.brightnessComponent < 0.5 ? 0 : 1)
}

let pid = Int32(CommandLine.arguments[1])!
let windows = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
let result = windows.compactMap { window -> [Int]? in
    guard window[kCGWindowOwnerPID as String] as? Int32 == pid,
          window[kCGWindowLayer as String] as? Int == 0,
          let number = window[kCGWindowNumber as String] as? Int,
          let bounds = window[kCGWindowBounds as String] as? [String: Any],
          let width = bounds["Width"] as? NSNumber,
          let height = bounds["Height"] as? NSNumber else { return nil }
    return [number, width.intValue, height.intValue]
}
print(String(decoding: try JSONSerialization.data(withJSONObject: result), as: UTF8.self))
