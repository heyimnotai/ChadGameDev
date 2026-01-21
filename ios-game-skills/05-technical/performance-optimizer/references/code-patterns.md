# Performance Optimizer Code Patterns

## CADisplayLink with ProMotion

```swift
// Info.plist: CADisableMinimumFrameDurationOnPhone = YES

import UIKit

final class GameLoop {
    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0

    func start() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))
        if #available(iOS 15.0, *) {
            displayLink?.preferredFrameRateRange = CAFrameRateRange(
                minimum: 60, maximum: 120, preferred: 120
            )
        }
        displayLink?.add(to: .main, forMode: .common)
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        // CRITICAL: Use targetTimestamp, not timestamp
        let currentTime = displayLink.targetTimestamp
        if lastTimestamp == 0 { lastTimestamp = currentTime; return }

        let deltaTime = min(currentTime - lastTimestamp, 1.0/30.0) // Cap delta
        lastTimestamp = currentTime
        // Update game with deltaTime
    }
}
```

## Adaptive Frame Rate Manager

```swift
final class AdaptiveFrameRateManager {
    private let gameLoop: GameLoop
    private var thermalObserver: NSObjectProtocol?

    init(gameLoop: GameLoop) {
        self.gameLoop = gameLoop

        thermalObserver = NotificationCenter.default.addObserver(
            forName: ProcessInfo.thermalStateDidChangeNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            self?.updateTargetFrameRate()
        }
    }

    private func updateTargetFrameRate() {
        let fps: Int = switch ProcessInfo.processInfo.thermalState {
        case .nominal, .fair: 120
        case .serious: 60
        case .critical: 30
        @unknown default: 60
        }
        gameLoop.setTargetFrameRate(fps)
    }
}
```

## Memory Monitoring

```swift
import Foundation

final class MemoryMonitor {
    static let shared = MemoryMonitor()

    private let warningThreshold: UInt64 = 800 * 1024 * 1024  // 800MB
    private let criticalThreshold: UInt64 = 950 * 1024 * 1024 // 950MB

    func checkMemory() -> UInt64 {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size) / 4

        let result = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
                task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
            }
        }
        return result == KERN_SUCCESS ? info.resident_size : 0
    }

    func startMonitoring() {
        NotificationCenter.default.addObserver(
            forName: UIApplication.didReceiveMemoryWarningNotification,
            object: nil, queue: .main
        ) { _ in
            // Emergency cleanup: unload textures, clear caches
        }
    }
}
```

## Thermal State Handler

```swift
final class ThermalStateHandler: ObservableObject {
    static let shared = ThermalStateHandler()

    @Published private(set) var qualityLevel: QualityLevel = .high

    enum QualityLevel { case low, medium, high }

    struct QualitySettings {
        let particleMultiplier: Float
        let maxEnemies: Int
        let targetFPS: Int

        static let high = QualitySettings(particleMultiplier: 1.0, maxEnemies: 50, targetFPS: 120)
        static let medium = QualitySettings(particleMultiplier: 0.5, maxEnemies: 30, targetFPS: 60)
        static let low = QualitySettings(particleMultiplier: 0.25, maxEnemies: 15, targetFPS: 30)
    }

    init() {
        NotificationCenter.default.addObserver(
            forName: ProcessInfo.thermalStateDidChangeNotification,
            object: nil, queue: .main
        ) { [weak self] _ in
            self?.updateQualityLevel()
        }
    }

    private func updateQualityLevel() {
        qualityLevel = switch ProcessInfo.processInfo.thermalState {
        case .nominal, .fair: .high
        case .serious: .medium
        case .critical: .low
        @unknown default: .medium
        }
    }
}
```

## Frame Profiler with Signposts

```swift
import os.signpost

final class FrameProfiler {
    static let shared = FrameProfiler()
    private let signpostLog = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "Game", category: .pointsOfInterest)

    private var lastUpdateTime: TimeInterval = 0
    private var lastPhysicsTime: TimeInterval = 0
    private var lastRenderTime: TimeInterval = 0

    func measureUpdate(_ block: () -> Void) {
        let start = CACurrentMediaTime()
        block()
        lastUpdateTime = CACurrentMediaTime() - start
    }

    func measurePhysics(_ block: () -> Void) {
        let start = CACurrentMediaTime()
        block()
        lastPhysicsTime = CACurrentMediaTime() - start
    }

    var isCPUBound: Bool { lastUpdateTime + lastPhysicsTime > lastRenderTime }

    func beginFrame() {
        os_signpost(.begin, log: signpostLog, name: "Frame")
    }

    func endFrame() {
        os_signpost(.end, log: signpostLog, name: "Frame")
    }
}
```

## Performance Monitor View

```swift
import SwiftUI

struct PerformanceOverlay: View {
    @ObservedObject var monitor = PerformanceMonitor.shared

    var body: some View {
        HStack(spacing: 8) {
            Circle()
                .fill(monitor.fps >= 58 ? .green : monitor.fps >= 30 ? .yellow : .red)
                .frame(width: 8, height: 8)
            Text("\(Int(monitor.fps)) FPS")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
            Text("\(Int(monitor.memoryUsageMB))MB")
                .font(.system(size: 10, design: .monospaced))
        }
        .padding(8)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 8))
    }
}

final class PerformanceMonitor: ObservableObject {
    static let shared = PerformanceMonitor()
    @Published private(set) var fps: Double = 60
    @Published private(set) var memoryUsageMB: Double = 0

    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0
    private var frameCount = 0

    func startMonitoring() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))
        displayLink?.add(to: .main, forMode: .common)
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        frameCount += 1
        let delta = displayLink.timestamp - lastTimestamp
        if delta >= 1.0 {
            fps = Double(frameCount) / delta
            memoryUsageMB = Double(MemoryMonitor.shared.checkMemory()) / (1024 * 1024)
            frameCount = 0
            lastTimestamp = displayLink.timestamp
        }
    }
}
```

## Texture Memory Manager

```swift
import SpriteKit

final class TextureMemoryManager {
    static let shared = TextureMemoryManager()

    private var loadedTextures: [String: SKTexture] = [:]
    private var textureUsage: [String: Date] = [:]
    private let memoryBudget: Int = 256 * 1024 * 1024 // 256MB

    func loadTexture(named name: String) -> SKTexture {
        if let cached = loadedTextures[name] {
            textureUsage[name] = Date()
            return cached
        }

        let texture = SKTexture(imageNamed: name)
        loadedTextures[name] = texture
        textureUsage[name] = Date()
        return texture
    }

    func freeUnusedTextures() {
        let threshold = Date().addingTimeInterval(-30) // 30 seconds
        for (name, lastUsed) in textureUsage where lastUsed < threshold {
            loadedTextures.removeValue(forKey: name)
            textureUsage.removeValue(forKey: name)
        }
    }
}
```

## Battery Optimization

```swift
import UIKit

final class BatteryOptimizer {
    static let shared = BatteryOptimizer()

    var shouldConserveBattery: Bool {
        UIDevice.current.isBatteryMonitoringEnabled = true
        let level = UIDevice.current.batteryLevel
        let charging = UIDevice.current.batteryState == .charging
        return !charging && level <= 0.20
    }

    struct Settings {
        let targetFPS: Int
        let enableParticles: Bool
        let enableHaptics: Bool

        static let full = Settings(targetFPS: 120, enableParticles: true, enableHaptics: true)
        static let balanced = Settings(targetFPS: 60, enableParticles: true, enableHaptics: true)
        static let saver = Settings(targetFPS: 30, enableParticles: false, enableHaptics: false)
    }
}
```
