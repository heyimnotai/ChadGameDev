---
name: performance-optimizer
description: Maintains 60fps (or 120fps on ProMotion devices) and efficient resource usage for iOS games. Use this skill when optimizing frame rates, configuring ProMotion support, monitoring memory usage, handling thermal throttling, improving battery life, or profiling with Instruments. Triggers on any performance concern, frame rate drop, memory warning, thermal state change, or when preparing a game for production release.
---

# Performance Optimizer

## Purpose

This skill enables Claude to build and maintain games that achieve consistent 60fps (or 120fps on ProMotion devices) across all supported iOS devices. It covers frame rate monitoring, memory budgeting, thermal management, battery optimization, and profiling workflows. The quality bar ensures games run smoothly on devices as old as A10 chips while fully utilizing ProMotion capabilities on newer hardware.

## Domain Boundaries

- **This skill handles**:
  - Frame rate monitoring and ProMotion (120Hz) configuration
  - CADisplayLink with proper targetTimestamp usage
  - Memory profiling and budget enforcement (<1GB)
  - Texture memory optimization
  - CPU vs GPU bound detection
  - Thermal state monitoring and response
  - Battery optimization techniques
  - Common performance pitfall avoidance
  - Instruments profiling workflows
  - Performance monitoring code implementations
  - Info.plist settings for ProMotion

- **This skill does NOT handle**:
  - SpriteKit scene architecture (see: spritekit-patterns)
  - SwiftUI game UI optimization (see: swiftui-game-ui)
  - Asset compression formats (see: asset-pipeline)
  - Analytics implementation (see: analytics-integration)
  - Specific Metal shader optimization

## Core Specifications

### Frame Rate Targets

| Device Class | Target FPS | Frame Budget |
|--------------|-----------|--------------|
| A10-A11 (iPhone 7-X) | 60 fps | 16.67ms |
| A12-A14 (iPhone XS-12) | 60 fps (default) | 16.67ms |
| A15+ with ProMotion | 120 fps | 8.33ms |
| iPad Pro (2017+) | 120 fps | 8.33ms |

### Memory Budgets

| Resource Type | Budget | Notes |
|---------------|--------|-------|
| Total app memory | < 1GB | WKWebView terminates at ~1.25GB |
| Texture memory | < 256MB | More on high-end devices |
| Audio buffers | < 32MB | Including all loaded sounds |
| Physics simulation | < 16MB | Depends on body count |
| Per-scene overhead | < 50MB | Scene transition safety margin |

### Thermal Thresholds

| Thermal State | Action Required |
|---------------|----------------|
| `.nominal` | Full quality, 120Hz allowed |
| `.fair` | Monitor closely, no changes |
| `.serious` | Reduce to 60Hz, lower particle counts |
| `.critical` | Minimum quality, pause non-essential work |

### Launch Time Budget

| Phase | Budget |
|-------|--------|
| System initialization | 100ms |
| App initialization | 200ms |
| First frame render | 100ms |
| **Total to first frame** | **< 400ms** |

## Implementation Patterns

### ProMotion Configuration

```swift
// MARK: - Info.plist Configuration

// Add to Info.plist for ProMotion support:
// Key: CADisableMinimumFrameDurationOnPhone
// Type: Boolean
// Value: YES (true)

/*
<key>CADisableMinimumFrameDurationOnPhone</key>
<true/>
*/

// MARK: - CADisplayLink Setup

import UIKit

final class GameLoop {
    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0
    private var frameCount: Int = 0
    private var fpsAccumulator: TimeInterval = 0
    private(set) var currentFPS: Double = 60

    weak var delegate: GameLoopDelegate?

    func start() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))

        // Configure for ProMotion
        if #available(iOS 15.0, *) {
            displayLink?.preferredFrameRateRange = CAFrameRateRange(
                minimum: 60,
                maximum: 120,
                preferred: 120
            )
        }

        displayLink?.add(to: .main, forMode: .common)
    }

    func stop() {
        displayLink?.invalidate()
        displayLink = nil
    }

    func setTargetFrameRate(_ fps: Int) {
        guard #available(iOS 15.0, *) else { return }

        displayLink?.preferredFrameRateRange = CAFrameRateRange(
            minimum: Float(min(fps, 60)),
            maximum: Float(fps),
            preferred: Float(fps)
        )
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        // CRITICAL: Use targetTimestamp, not timestamp
        // targetTimestamp = when this frame should be displayed
        // timestamp = when last frame was displayed
        let currentTime = displayLink.targetTimestamp

        if lastTimestamp == 0 {
            lastTimestamp = currentTime
            return
        }

        // Calculate delta time
        let deltaTime = currentTime - lastTimestamp
        lastTimestamp = currentTime

        // Cap delta time to prevent physics explosions
        let cappedDelta = min(deltaTime, 1.0 / 30.0)

        // Update FPS counter
        updateFPSCounter(deltaTime: deltaTime)

        // Notify delegate
        delegate?.gameLoop(self, updateWithDelta: cappedDelta)
    }

    private func updateFPSCounter(deltaTime: TimeInterval) {
        frameCount += 1
        fpsAccumulator += deltaTime

        if fpsAccumulator >= 1.0 {
            currentFPS = Double(frameCount) / fpsAccumulator
            frameCount = 0
            fpsAccumulator = 0
        }
    }
}

protocol GameLoopDelegate: AnyObject {
    func gameLoop(_ loop: GameLoop, updateWithDelta deltaTime: TimeInterval)
}
```

### Adaptive Frame Rate

```swift
import UIKit

final class AdaptiveFrameRateManager {
    private let gameLoop: GameLoop
    private var thermalObserver: NSObjectProtocol?
    private var lowPowerModeObserver: NSObjectProtocol?

    private(set) var currentTargetFPS: Int = 120
    private var isLowPowerMode: Bool = false
    private var thermalState: ProcessInfo.ThermalState = .nominal

    init(gameLoop: GameLoop) {
        self.gameLoop = gameLoop
        setupObservers()
        updateTargetFrameRate()
    }

    deinit {
        if let observer = thermalObserver {
            NotificationCenter.default.removeObserver(observer)
        }
        if let observer = lowPowerModeObserver {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    private func setupObservers() {
        // Thermal state monitoring
        thermalObserver = NotificationCenter.default.addObserver(
            forName: ProcessInfo.thermalStateDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.thermalState = ProcessInfo.processInfo.thermalState
            self?.updateTargetFrameRate()
        }

        // Low power mode monitoring
        lowPowerModeObserver = NotificationCenter.default.addObserver(
            forName: .NSProcessInfoPowerStateDidChange,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.isLowPowerMode = ProcessInfo.processInfo.isLowPowerModeEnabled
            self?.updateTargetFrameRate()
        }

        // Initial state
        thermalState = ProcessInfo.processInfo.thermalState
        isLowPowerMode = ProcessInfo.processInfo.isLowPowerModeEnabled
    }

    private func updateTargetFrameRate() {
        let newTarget: Int

        // Low power mode forces 60Hz
        if isLowPowerMode {
            newTarget = 60
        } else {
            // Thermal-based adjustment
            switch thermalState {
            case .nominal, .fair:
                newTarget = 120
            case .serious:
                newTarget = 60
            case .critical:
                newTarget = 30 // Emergency mode
            @unknown default:
                newTarget = 60
            }
        }

        if newTarget != currentTargetFPS {
            currentTargetFPS = newTarget
            gameLoop.setTargetFrameRate(newTarget)
            notifyFrameRateChange()
        }
    }

    private func notifyFrameRateChange() {
        NotificationCenter.default.post(
            name: .targetFrameRateDidChange,
            object: self,
            userInfo: ["fps": currentTargetFPS]
        )
    }
}

extension Notification.Name {
    static let targetFrameRateDidChange = Notification.Name("targetFrameRateDidChange")
}
```

### Memory Monitoring

```swift
import Foundation
import os.log

final class MemoryMonitor {
    static let shared = MemoryMonitor()

    private let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "Game", category: "Memory")
    private var warningObserver: NSObjectProtocol?
    private var timer: Timer?

    // Memory thresholds in bytes
    private let warningThreshold: UInt64 = 800 * 1024 * 1024  // 800 MB
    private let criticalThreshold: UInt64 = 950 * 1024 * 1024 // 950 MB
    private let targetBudget: UInt64 = 700 * 1024 * 1024      // 700 MB

    private(set) var currentMemoryUsage: UInt64 = 0
    private(set) var peakMemoryUsage: UInt64 = 0

    weak var delegate: MemoryMonitorDelegate?

    private init() {
        setupMemoryWarningObserver()
    }

    func startMonitoring(interval: TimeInterval = 1.0) {
        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { [weak self] _ in
            self?.checkMemory()
        }
    }

    func stopMonitoring() {
        timer?.invalidate()
        timer = nil
    }

    private func setupMemoryWarningObserver() {
        warningObserver = NotificationCenter.default.addObserver(
            forName: UIApplication.didReceiveMemoryWarningNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.handleMemoryWarning()
        }
    }

    private func checkMemory() {
        currentMemoryUsage = getMemoryUsage()
        peakMemoryUsage = max(peakMemoryUsage, currentMemoryUsage)

        let usageMB = currentMemoryUsage / (1024 * 1024)

        if currentMemoryUsage > criticalThreshold {
            logger.critical("CRITICAL: Memory usage at \(usageMB)MB")
            delegate?.memoryMonitor(self, didReachCriticalLevel: currentMemoryUsage)
        } else if currentMemoryUsage > warningThreshold {
            logger.warning("WARNING: Memory usage at \(usageMB)MB")
            delegate?.memoryMonitor(self, didReachWarningLevel: currentMemoryUsage)
        }
    }

    private func getMemoryUsage() -> UInt64 {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size) / 4

        let result = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
                task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
            }
        }

        return result == KERN_SUCCESS ? info.resident_size : 0
    }

    private func handleMemoryWarning() {
        logger.warning("System memory warning received")
        delegate?.memoryMonitorDidReceiveSystemWarning(self)
    }

    func logMemorySnapshot() {
        let usage = getMemoryUsage()
        let usageMB = Double(usage) / (1024 * 1024)
        let peakMB = Double(peakMemoryUsage) / (1024 * 1024)
        let budgetMB = Double(targetBudget) / (1024 * 1024)

        logger.info("""
            Memory Snapshot:
            - Current: \(String(format: "%.1f", usageMB))MB
            - Peak: \(String(format: "%.1f", peakMB))MB
            - Budget: \(String(format: "%.1f", budgetMB))MB
            - Headroom: \(String(format: "%.1f", budgetMB - usageMB))MB
            """)
    }
}

protocol MemoryMonitorDelegate: AnyObject {
    func memoryMonitor(_ monitor: MemoryMonitor, didReachWarningLevel bytes: UInt64)
    func memoryMonitor(_ monitor: MemoryMonitor, didReachCriticalLevel bytes: UInt64)
    func memoryMonitorDidReceiveSystemWarning(_ monitor: MemoryMonitor)
}
```

### Thermal State Handler

```swift
import Foundation

final class ThermalStateHandler: ObservableObject {
    static let shared = ThermalStateHandler()

    @Published private(set) var currentState: ProcessInfo.ThermalState = .nominal
    @Published private(set) var qualityLevel: QualityLevel = .high

    private var observer: NSObjectProtocol?

    enum QualityLevel: Int, Comparable {
        case low = 0
        case medium = 1
        case high = 2

        static func < (lhs: QualityLevel, rhs: QualityLevel) -> Bool {
            lhs.rawValue < rhs.rawValue
        }
    }

    struct QualitySettings {
        let particleMultiplier: Float
        let shadowQuality: Int
        let textureQuality: Int
        let maxEnemies: Int
        let targetFPS: Int

        static let high = QualitySettings(
            particleMultiplier: 1.0,
            shadowQuality: 2,
            textureQuality: 2,
            maxEnemies: 50,
            targetFPS: 120
        )

        static let medium = QualitySettings(
            particleMultiplier: 0.5,
            shadowQuality: 1,
            textureQuality: 1,
            maxEnemies: 30,
            targetFPS: 60
        )

        static let low = QualitySettings(
            particleMultiplier: 0.25,
            shadowQuality: 0,
            textureQuality: 0,
            maxEnemies: 15,
            targetFPS: 30
        )
    }

    private init() {
        currentState = ProcessInfo.processInfo.thermalState
        updateQualityLevel()

        observer = NotificationCenter.default.addObserver(
            forName: ProcessInfo.thermalStateDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.handleThermalStateChange()
        }
    }

    deinit {
        if let observer = observer {
            NotificationCenter.default.removeObserver(observer)
        }
    }

    private func handleThermalStateChange() {
        let newState = ProcessInfo.processInfo.thermalState
        guard newState != currentState else { return }

        currentState = newState
        updateQualityLevel()

        NotificationCenter.default.post(
            name: .thermalQualityDidChange,
            object: self,
            userInfo: ["qualityLevel": qualityLevel]
        )
    }

    private func updateQualityLevel() {
        qualityLevel = switch currentState {
        case .nominal, .fair:
            .high
        case .serious:
            .medium
        case .critical:
            .low
        @unknown default:
            .medium
        }
    }

    var currentSettings: QualitySettings {
        switch qualityLevel {
        case .high: return .high
        case .medium: return .medium
        case .low: return .low
        }
    }
}

extension Notification.Name {
    static let thermalQualityDidChange = Notification.Name("thermalQualityDidChange")
}
```

### Frame Time Profiler

```swift
import Foundation
import os.signpost

final class FrameProfiler {
    static let shared = FrameProfiler()

    private let signpostLog = OSLog(subsystem: Bundle.main.bundleIdentifier ?? "Game", category: .pointsOfInterest)
    private var frameSignpostID: OSSignpostID?

    // Frame timing breakdown
    private(set) var lastUpdateTime: TimeInterval = 0
    private(set) var lastPhysicsTime: TimeInterval = 0
    private(set) var lastRenderTime: TimeInterval = 0
    private(set) var lastTotalFrameTime: TimeInterval = 0

    // Rolling averages
    private var frameTimes: [TimeInterval] = []
    private let maxSamples = 60

    private(set) var averageFrameTime: TimeInterval = 0
    private(set) var worstFrameTime: TimeInterval = 0

    private init() {}

    // MARK: - Signpost Integration (for Instruments)

    func beginFrame() {
        frameSignpostID = OSSignpostID(log: signpostLog)
        os_signpost(.begin, log: signpostLog, name: "Frame", signpostID: frameSignpostID!)
    }

    func endFrame() {
        guard let id = frameSignpostID else { return }
        os_signpost(.end, log: signpostLog, name: "Frame", signpostID: id)
    }

    func markEvent(_ name: StaticString) {
        os_signpost(.event, log: signpostLog, name: name)
    }

    // MARK: - Manual Timing

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

    func measureRender(_ block: () -> Void) {
        let start = CACurrentMediaTime()
        block()
        lastRenderTime = CACurrentMediaTime() - start
    }

    func recordFrameTime(_ time: TimeInterval) {
        lastTotalFrameTime = time

        frameTimes.append(time)
        if frameTimes.count > maxSamples {
            frameTimes.removeFirst()
        }

        averageFrameTime = frameTimes.reduce(0, +) / Double(frameTimes.count)
        worstFrameTime = frameTimes.max() ?? 0
    }

    // MARK: - Analysis

    var isCPUBound: Bool {
        // If update + physics takes more than 60% of frame time
        let cpuTime = lastUpdateTime + lastPhysicsTime
        return cpuTime > lastTotalFrameTime * 0.6
    }

    var isGPUBound: Bool {
        // If render takes more than 60% of frame time
        return lastRenderTime > lastTotalFrameTime * 0.6
    }

    func getPerformanceReport() -> String {
        let targetFrameTime = 1.0 / 60.0
        let percentOfBudget = (averageFrameTime / targetFrameTime) * 100

        return """
        === Performance Report ===
        Average Frame Time: \(String(format: "%.2f", averageFrameTime * 1000))ms
        Worst Frame Time: \(String(format: "%.2f", worstFrameTime * 1000))ms
        Budget Usage: \(String(format: "%.1f", percentOfBudget))%

        Breakdown (last frame):
        - Update: \(String(format: "%.2f", lastUpdateTime * 1000))ms
        - Physics: \(String(format: "%.2f", lastPhysicsTime * 1000))ms
        - Render: \(String(format: "%.2f", lastRenderTime * 1000))ms

        Bottleneck: \(isCPUBound ? "CPU" : isGPUBound ? "GPU" : "Balanced")
        """
    }
}

// MARK: - Usage in Game Loop

extension FrameProfiler {
    func profiledUpdate(
        update: () -> Void,
        physics: () -> Void,
        render: () -> Void
    ) {
        let frameStart = CACurrentMediaTime()

        beginFrame()

        measureUpdate(update)
        measurePhysics(physics)
        measureRender(render)

        endFrame()

        let frameTime = CACurrentMediaTime() - frameStart
        recordFrameTime(frameTime)
    }
}
```

### Battery Optimization

```swift
import UIKit

final class BatteryOptimizer {
    static let shared = BatteryOptimizer()

    private var batteryObserver: NSObjectProtocol?

    @Published private(set) var batteryLevel: Float = 1.0
    @Published private(set) var isCharging: Bool = false
    @Published private(set) var shouldConserveBattery: Bool = false

    // Thresholds
    private let conservationThreshold: Float = 0.20  // 20%
    private let criticalThreshold: Float = 0.10      // 10%

    private init() {
        UIDevice.current.isBatteryMonitoringEnabled = true
        updateBatteryState()

        batteryObserver = NotificationCenter.default.addObserver(
            forName: UIDevice.batteryLevelDidChangeNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.updateBatteryState()
        }
    }

    private func updateBatteryState() {
        batteryLevel = UIDevice.current.batteryLevel
        isCharging = UIDevice.current.batteryState == .charging ||
                     UIDevice.current.batteryState == .full

        // Determine if battery conservation should be active
        shouldConserveBattery = !isCharging && batteryLevel <= conservationThreshold
    }

    var recommendedSettings: BatterySettings {
        if isCharging || batteryLevel > conservationThreshold {
            return .fullPerformance
        } else if batteryLevel > criticalThreshold {
            return .balanced
        } else {
            return .powerSaver
        }
    }

    struct BatterySettings {
        let targetFPS: Int
        let enableParticles: Bool
        let enableHaptics: Bool
        let reduceAnimations: Bool

        static let fullPerformance = BatterySettings(
            targetFPS: 120,
            enableParticles: true,
            enableHaptics: true,
            reduceAnimations: false
        )

        static let balanced = BatterySettings(
            targetFPS: 60,
            enableParticles: true,
            enableHaptics: true,
            reduceAnimations: false
        )

        static let powerSaver = BatterySettings(
            targetFPS: 30,
            enableParticles: false,
            enableHaptics: false,
            reduceAnimations: true
        )
    }
}
```

### Texture Memory Manager

```swift
import SpriteKit

final class TextureMemoryManager {
    static let shared = TextureMemoryManager()

    private var loadedTextures: [String: SKTexture] = [:]
    private var textureUsage: [String: Date] = [:]
    private var estimatedMemoryUsage: Int = 0

    // Memory budget in bytes (256MB default)
    private let memoryBudget: Int = 256 * 1024 * 1024

    private init() {}

    func loadTexture(named name: String, estimatedSize: Int = 0) -> SKTexture {
        // Return cached if available
        if let cached = loadedTextures[name] {
            textureUsage[name] = Date()
            return cached
        }

        // Check if we need to free memory
        if estimatedMemoryUsage + estimatedSize > memoryBudget {
            freeUnusedTextures(targetFreeBytes: estimatedSize)
        }

        // Load new texture
        let texture = SKTexture(imageNamed: name)
        texture.filteringMode = .nearest // Pixel art, use .linear for smooth

        loadedTextures[name] = texture
        textureUsage[name] = Date()
        estimatedMemoryUsage += estimatedSize

        return texture
    }

    func loadAtlas(named name: String) -> SKTextureAtlas {
        let atlas = SKTextureAtlas(named: name)
        atlas.preload { }
        return atlas
    }

    func preloadTextures(_ names: [String], completion: @escaping () -> Void) {
        let textures = names.map { SKTexture(imageNamed: $0) }
        SKTexture.preload(textures) {
            for (index, name) in names.enumerated() {
                self.loadedTextures[name] = textures[index]
                self.textureUsage[name] = Date()
            }
            completion()
        }
    }

    func unloadTexture(named name: String) {
        loadedTextures.removeValue(forKey: name)
        textureUsage.removeValue(forKey: name)
    }

    func unloadAllTextures() {
        loadedTextures.removeAll()
        textureUsage.removeAll()
        estimatedMemoryUsage = 0
    }

    private func freeUnusedTextures(targetFreeBytes: Int) {
        // Sort textures by last use time (oldest first)
        let sortedTextures = textureUsage.sorted { $0.value < $1.value }

        var freedBytes = 0
        for (name, _) in sortedTextures {
            if freedBytes >= targetFreeBytes { break }

            // Don't unload textures used in last 30 seconds
            if let lastUsed = textureUsage[name],
               Date().timeIntervalSince(lastUsed) < 30 {
                continue
            }

            unloadTexture(named: name)
            freedBytes += 1024 * 1024 // Estimate 1MB per texture
        }
    }

    func logMemoryUsage() {
        print("""
        Texture Memory Usage:
        - Loaded textures: \(loadedTextures.count)
        - Estimated memory: \(estimatedMemoryUsage / (1024 * 1024))MB
        - Budget: \(memoryBudget / (1024 * 1024))MB
        """)
    }
}
```

### Comprehensive Performance Monitor

```swift
import Foundation
import UIKit

final class PerformanceMonitor: ObservableObject {
    static let shared = PerformanceMonitor()

    // Published metrics for UI
    @Published private(set) var fps: Double = 60
    @Published private(set) var memoryUsageMB: Double = 0
    @Published private(set) var thermalState: String = "Normal"
    @Published private(set) var batteryLevel: Float = 1.0
    @Published private(set) var performanceScore: Int = 100

    // Sub-monitors
    private let memoryMonitor = MemoryMonitor.shared
    private let thermalHandler = ThermalStateHandler.shared
    private let batteryOptimizer = BatteryOptimizer.shared
    private let frameProfiler = FrameProfiler.shared

    private var displayLink: CADisplayLink?
    private var lastTimestamp: TimeInterval = 0
    private var frameCount: Int = 0
    private var fpsAccumulator: TimeInterval = 0

    private init() {
        memoryMonitor.delegate = self
        memoryMonitor.startMonitoring()
    }

    func startMonitoring() {
        displayLink = CADisplayLink(target: self, selector: #selector(update))
        displayLink?.add(to: .main, forMode: .common)
    }

    func stopMonitoring() {
        displayLink?.invalidate()
        displayLink = nil
        memoryMonitor.stopMonitoring()
    }

    @objc private func update(_ displayLink: CADisplayLink) {
        let currentTime = displayLink.timestamp

        if lastTimestamp == 0 {
            lastTimestamp = currentTime
            return
        }

        let deltaTime = currentTime - lastTimestamp
        lastTimestamp = currentTime

        frameCount += 1
        fpsAccumulator += deltaTime

        // Update metrics every second
        if fpsAccumulator >= 1.0 {
            fps = Double(frameCount) / fpsAccumulator
            frameCount = 0
            fpsAccumulator = 0

            // Update other metrics
            memoryUsageMB = Double(memoryMonitor.currentMemoryUsage) / (1024 * 1024)
            thermalState = thermalStateString(thermalHandler.currentState)
            batteryLevel = batteryOptimizer.batteryLevel
            performanceScore = calculatePerformanceScore()
        }
    }

    private func thermalStateString(_ state: ProcessInfo.ThermalState) -> String {
        switch state {
        case .nominal: return "Normal"
        case .fair: return "Warm"
        case .serious: return "Hot"
        case .critical: return "Critical"
        @unknown default: return "Unknown"
        }
    }

    private func calculatePerformanceScore() -> Int {
        var score = 100

        // FPS penalty
        if fps < 60 {
            score -= Int((60 - fps) * 2)
        }

        // Memory penalty
        if memoryUsageMB > 700 {
            score -= Int((memoryUsageMB - 700) / 10)
        }

        // Thermal penalty
        switch thermalHandler.currentState {
        case .nominal: break
        case .fair: score -= 5
        case .serious: score -= 20
        case .critical: score -= 40
        @unknown default: break
        }

        return max(0, min(100, score))
    }

    // MARK: - Debug Overlay

    var debugString: String {
        """
        FPS: \(String(format: "%.1f", fps))
        Memory: \(String(format: "%.1f", memoryUsageMB))MB
        Thermal: \(thermalState)
        Battery: \(Int(batteryLevel * 100))%
        Score: \(performanceScore)
        """
    }
}

extension PerformanceMonitor: MemoryMonitorDelegate {
    func memoryMonitor(_ monitor: MemoryMonitor, didReachWarningLevel bytes: UInt64) {
        // Trigger cache cleanup
        TextureMemoryManager.shared.unloadAllTextures()
    }

    func memoryMonitor(_ monitor: MemoryMonitor, didReachCriticalLevel bytes: UInt64) {
        // Emergency cleanup
        TextureMemoryManager.shared.unloadAllTextures()
        // Pause game, show memory warning
    }

    func memoryMonitorDidReceiveSystemWarning(_ monitor: MemoryMonitor) {
        // System-level memory pressure
        TextureMemoryManager.shared.unloadAllTextures()
    }
}
```

### Debug Overlay View

```swift
import SwiftUI

struct PerformanceOverlay: View {
    @ObservedObject var monitor = PerformanceMonitor.shared
    @State private var isExpanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // Compact view
            HStack(spacing: 8) {
                fpsIndicator
                memoryIndicator
                thermalIndicator

                Button {
                    withAnimation { isExpanded.toggle() }
                } label: {
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 10))
                }
            }

            // Expanded details
            if isExpanded {
                Divider()
                Text(monitor.debugString)
                    .font(.system(size: 10, design: .monospaced))
            }
        }
        .padding(8)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 8))
        .frame(maxWidth: 200)
    }

    private var fpsIndicator: some View {
        HStack(spacing: 2) {
            Circle()
                .fill(fpsColor)
                .frame(width: 8, height: 8)
            Text("\(Int(monitor.fps))")
                .font(.system(size: 12, weight: .bold, design: .monospaced))
        }
    }

    private var memoryIndicator: some View {
        Text("\(Int(monitor.memoryUsageMB))MB")
            .font(.system(size: 10, design: .monospaced))
            .foregroundStyle(memoryColor)
    }

    private var thermalIndicator: some View {
        Image(systemName: thermalIcon)
            .font(.system(size: 10))
            .foregroundStyle(thermalColor)
    }

    private var fpsColor: Color {
        if monitor.fps >= 58 { return .green }
        if monitor.fps >= 30 { return .yellow }
        return .red
    }

    private var memoryColor: Color {
        if monitor.memoryUsageMB < 500 { return .green }
        if monitor.memoryUsageMB < 800 { return .yellow }
        return .red
    }

    private var thermalIcon: String {
        switch monitor.thermalState {
        case "Normal": return "thermometer.low"
        case "Warm": return "thermometer.medium"
        case "Hot", "Critical": return "thermometer.high"
        default: return "thermometer"
        }
    }

    private var thermalColor: Color {
        switch monitor.thermalState {
        case "Normal": return .green
        case "Warm": return .yellow
        case "Hot": return .orange
        case "Critical": return .red
        default: return .gray
        }
    }
}
```

## Decision Trees

### Frame Rate Target Selection

```
Is device ProMotion capable?
├─ NO → Target 60fps
└─ YES → Is low power mode enabled?
    ├─ YES → Target 60fps
    └─ NO → What is thermal state?
        ├─ .nominal/.fair → Target 120fps
        ├─ .serious → Target 60fps
        └─ .critical → Target 30fps
```

### Performance Bottleneck Identification

```
Is frame time > 16.67ms?
├─ NO → Performance is acceptable
└─ YES → Measure update/physics/render times
    ├─ Update + Physics > 60% → CPU bound
    │   └─ Optimize: Object count, algorithms, pooling
    ├─ Render > 60% → GPU bound
    │   └─ Optimize: Draw calls, texture size, particles
    └─ Balanced
        └─ Optimize: Both CPU and GPU paths
```

### Memory Warning Response

```
What is memory pressure level?
├─ Warning (800MB+)
│   ├─ Unload unused textures
│   ├─ Clear audio caches
│   └─ Release pooled objects
├─ Critical (950MB+)
│   ├─ Unload all cached resources
│   ├─ Pause game
│   └─ Force garbage collection
└─ System warning
    ├─ Emergency resource release
    ├─ Save game state
    └─ Prepare for potential termination
```

## Quality Checklist

### ProMotion Configuration
- [ ] `CADisableMinimumFrameDurationOnPhone` set in Info.plist
- [ ] CADisplayLink uses `preferredFrameRateRange`
- [ ] Frame rate adapts to thermal state
- [ ] Low power mode detected and handled

### Memory Management
- [ ] Total memory usage < 1GB
- [ ] Memory warning observer implemented
- [ ] Texture caching with eviction policy
- [ ] Object pooling for frequent allocations
- [ ] Memory profiled with Instruments

### Thermal Handling
- [ ] Thermal state notifications observed
- [ ] Quality settings adapt to thermal state
- [ ] User notified of thermal throttling
- [ ] Critical state triggers quality reduction

### Frame Time Budget
- [ ] Update loop < 8ms
- [ ] Physics step < 4ms
- [ ] Total frame time monitored
- [ ] Delta time capped to prevent explosions

### Profiling
- [ ] Signposts added for Instruments
- [ ] FPS counter available in debug builds
- [ ] Memory usage logged periodically
- [ ] Performance bottleneck identifiable

## Anti-Patterns

### DO NOT: Use timestamp instead of targetTimestamp

```swift
// WRONG - Uses when last frame displayed
@objc func update(_ displayLink: CADisplayLink) {
    let deltaTime = displayLink.timestamp - lastTimestamp
    lastTimestamp = displayLink.timestamp
}

// CORRECT - Uses when this frame should display
@objc func update(_ displayLink: CADisplayLink) {
    let deltaTime = displayLink.targetTimestamp - lastTimestamp
    lastTimestamp = displayLink.targetTimestamp
}
```

### DO NOT: Ignore thermal state

```swift
// WRONG - Always runs at max
func startGame() {
    targetFPS = 120
    particleCount = 500
    // No thermal monitoring
}

// CORRECT - Adapts to conditions
func startGame() {
    ThermalStateHandler.shared.$qualityLevel
        .sink { [weak self] level in
            self?.applyQualitySettings(for: level)
        }
        .store(in: &cancellables)
}
```

### DO NOT: Allocate in game loop

```swift
// WRONG - Creates garbage every frame
override func update(_ currentTime: TimeInterval) {
    let enemies = children.filter { $0 is Enemy } // New array every frame
    for enemy in enemies {
        let direction = CGVector(dx: 1, dy: 0) // Stack allocation OK
    }
}

// CORRECT - Reuse collections
private var enemyCache: [Enemy] = []

override func update(_ currentTime: TimeInterval) {
    enemyCache.removeAll(keepingCapacity: true)
    for child in children {
        if let enemy = child as? Enemy {
            enemyCache.append(enemy)
        }
    }
}
```

### DO NOT: Skip delta time capping

```swift
// WRONG - Physics explodes after pause
func update(deltaTime: TimeInterval) {
    position.y += velocity.y * CGFloat(deltaTime)
    // If deltaTime is 5 seconds after pause, object teleports
}

// CORRECT - Cap delta time
func update(deltaTime: TimeInterval) {
    let cappedDelta = min(deltaTime, 1.0 / 30.0) // Max ~33ms
    position.y += velocity.y * CGFloat(cappedDelta)
}
```

## Instruments Profiling Guide

### Time Profiler
1. Product > Profile (Cmd+I)
2. Select "Time Profiler"
3. Record gameplay for 30-60 seconds
4. Look for hotspots in:
   - `update()` methods
   - Physics calculations
   - Node enumeration

### Metal System Trace
1. For GPU-bound analysis
2. Check for:
   - Encoder wait time
   - GPU utilization
   - Draw call count

### Allocations
1. Track memory growth over time
2. Mark generations between levels
3. Look for:
   - Persistent growth (leaks)
   - Allocation spikes during gameplay

### Game Performance Template
1. Combined view of:
   - Frame rate graph
   - CPU/GPU usage
   - Metal performance
2. Identify frame drops and correlate with activity

## Adjacent Skills

- **spritekit-patterns**: Scene architecture affects performance significantly
- **asset-pipeline**: Proper texture compression reduces memory and improves load times
- **swiftui-game-ui**: UI performance considerations for overlays
- **analytics-integration**: Track performance metrics for production monitoring
