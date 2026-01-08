---
name: audio-designer
description: Implements satisfying game audio for iOS games including sound effects, music, and audio system architecture. Use this skill when designing sound effect specifications, implementing adaptive music systems, configuring audio file formats and compression, managing simultaneous sound limits, implementing audio priority and ducking systems, or achieving low-latency audio playback. This skill provides exact frequency ranges for phone speakers, file format recommendations, AVAudioEngine implementation patterns, and production-ready Swift code for complete audio systems.
---

# Audio Designer

## Purpose

This skill enables the implementation of satisfying, responsive game audio that enhances gameplay feedback and creates immersive atmosphere. It enforces technical specifications for iOS audio hardware, proper format selection for performance, and audio design principles that make games feel polished. Every specification targets sub-20ms latency for responsive feedback while managing resource constraints of mobile devices.

## Domain Boundaries

- **This skill handles**:
  - Sound effect specifications (frequency, duration, layering)
  - Audio file format selection (CAF, AAC, IMA4, MP3)
  - Compression settings and quality tradeoffs
  - Music implementation (adaptive, looping, layering)
  - Audio priority and ducking systems
  - Volume balancing and mixing
  - Silence as a design tool
  - Latency optimization (<20ms target)
  - AVAudioEngine and AVAudioPlayer patterns
  - Simultaneous sound management

- **This skill does NOT handle**:
  - Haptic feedback (see: haptic-optimizer skill)
  - Animation timing that audio syncs to (see: animation-system skill)
  - Music composition or sound recording
  - Voice acting or dialogue systems

## Core Specifications

### iOS Audio Hardware Constraints

| Constraint | Value | Notes |
|------------|-------|-------|
| iPhone speaker floor | 400Hz | Frequencies below are inaudible/weak |
| Safe clarity range | 800Hz - 10kHz | Best reproduction on phone speakers |
| Harsh zone | 4kHz - 5kHz | Can be piercing, use sparingly |
| Upper limit | 22kHz | iOS system limit |
| Hardware-decoded streams | 1 | Only ONE AAC/MP3/ALAC at a time |
| Software-decoded streams | 32+ | Practical limit for simultaneous SFX |

### Latency Requirements

| Priority | Latency | Use Case |
|----------|---------|----------|
| Critical | <20ms | Button press, hit feedback, collection |
| Important | <50ms | UI sounds, ambient triggers |
| Acceptable | <100ms | Background music, non-interactive |

**Audio Engine Settings for Low Latency**:
- Sample rate: 48kHz
- Buffer size: 64 samples (1.33ms at 48kHz)
- Preferred I/O duration: 0.005 seconds (5ms)

### Audio File Format Selection

| Format | Extension | Compression | Latency | Use Case |
|--------|-----------|-------------|---------|----------|
| CAF (Linear PCM) | .caf | None | Lowest | Critical SFX, rapid-fire sounds |
| CAF (IMA4) | .caf | 4:1 | Low | Standard SFX, seamless loops |
| AAC | .m4a, .aac | High | Medium | Background music (1 stream) |
| AIFF | .aiff | None | Low | Music loops, high-quality SFX |
| MP3 | .mp3 | High | Medium | Fallback music only |

**Format Decision Matrix**:
```
Need simultaneous playback?
├── YES: Use CAF (PCM or IMA4)
└── NO: Is it music?
    ├── YES: Use AAC (hardware decoded)
    └── NO: Use CAF

Need seamless looping?
├── YES: Use IMA4 or AIFF
└── NO: Any format works

File size critical?
├── YES: Use IMA4 (4:1 compression)
└── NO: Use uncompressed CAF for quality
```

### Audio Conversion Commands

```bash
# Uncompressed CAF (lowest latency SFX)
afconvert -f caff -d LEI16 input.wav output.caf

# IMA4 compressed (good SFX, loops well)
afconvert -f AIFC -d ima4 input.wav output.caf

# AAC for music (hardware decoded)
afconvert -f m4af -d aac -b 256000 input.wav output.m4a

# High-quality AIFF (music loops)
afconvert -f AIFF -d BEI16 input.wav output.aiff
```

### Sound Effect Duration Guidelines

| Effect Type | Duration | Notes |
|-------------|----------|-------|
| Button tap | 30-80ms | Short, crisp |
| Collection/pickup | 80-150ms | Satisfying but not lingering |
| Hit/impact | 50-150ms | Sharp attack, quick decay |
| UI whoosh | 100-200ms | Transition accompaniment |
| Success fanfare | 500-1500ms | Celebratory |
| Error/failure | 200-400ms | Clear but not annoying |
| Ambient loop | 2-10s | Seamless loop point |
| Footstep | 50-100ms | Rhythmic, consistent |

### Frequency Guidelines by Effect Type

| Effect Type | Fundamental | Harmonics | Notes |
|-------------|-------------|-----------|-------|
| Button click | 1-2kHz | 3-6kHz | Clean, no bass |
| Coin collect | 2-4kHz | 6-10kHz | Bright, sparkly |
| Hit/punch | 150-400Hz + 1-2kHz | Wide | Bass thump + crack |
| Jump | 400-800Hz | Rising pitch | Upward movement feel |
| Land | 100-300Hz + 800Hz | Impact | Thump + slap |
| UI error | 200-400Hz | Minimal | Low, non-harsh |
| Success | 800Hz-2kHz | Musical | Melodic, major key |
| Explosion | 60-200Hz + 2-5kHz | Wide | Bass rumble + crack |

**Phone Speaker Compensation**: Boost 800Hz-2kHz for clarity on small speakers. Roll off below 400Hz (inaudible anyway).

### Simultaneous Sound Management

| Limit | Value | Notes |
|-------|-------|-------|
| Total active sounds | 32 | Practical maximum |
| Same sound type | 3-4 | Prevent stacking (e.g., rapid-fire) |
| Music channels | 1-2 | Main + ambient layer |
| UI sounds | 4-6 | Reserved priority |
| SFX pool | 20-24 | Gameplay sounds |

### Audio Priority System

| Priority | Value | Categories |
|----------|-------|------------|
| Critical | 100 | Player actions, game-critical feedback |
| High | 75 | Enemy actions, important events |
| Medium | 50 | Environmental, collectibles |
| Low | 25 | Ambient, background detail |
| Lowest | 0 | Music, optional atmosphere |

**Priority Rules**:
1. Higher priority always plays
2. Equal priority: newer sound plays, older may be stolen
3. Critical sounds never stolen
4. Pool sounds by category to prevent starvation

### Volume Balancing Guidelines

| Category | Relative Volume | Notes |
|----------|-----------------|-------|
| Music | 60-70% | Never overpower SFX |
| SFX - UI | 80-90% | Clear feedback |
| SFX - Player actions | 90-100% | Most important |
| SFX - World/Ambient | 40-60% | Background layer |
| SFX - Enemy | 70-80% | Important but not player |
| Voice/Dialogue | 100% | If present, top priority |

### Ducking Specifications

| Trigger | Duck Target | Amount | Duration |
|---------|-------------|--------|----------|
| Important SFX | Music | -6dB to -12dB | SFX duration + 200ms release |
| Dialogue | Music, SFX | -12dB to -18dB | Dialogue + 500ms release |
| Pause menu | All gameplay | -12dB | Instant, until resume |
| Reward reveal | Background | -6dB | Reveal duration |
| Game over | Gameplay SFX | Fade to 0 | 500ms |

### Silence as Design Tool

| Moment | Silence Duration | Purpose |
|--------|------------------|---------|
| Before boss reveal | 1-2s | Build tension |
| After death | 500ms | Gravity of moment |
| Before critical hit | 100-200ms | Emphasize impact |
| Menu open | Brief dip | Focus attention |
| Level complete | 200ms before fanfare | Punctuation |

### Adaptive Music System Layers

| Layer | Content | Trigger |
|-------|---------|---------|
| Base | Ambient pad, low energy | Always playing |
| Rhythm | Percussion, pulse | Player moving/active |
| Melody | Main theme | Normal gameplay |
| Intensity | Additional instruments | Combat/action |
| Danger | Tension elements | Low health/time |
| Victory | Triumphant overlay | Level complete |

### Loop Point Requirements

| Requirement | Specification |
|-------------|---------------|
| Loop gap | 0 samples (seamless) |
| Format | IMA4 or uncompressed |
| Crossfade at loop | 10-50ms if needed |
| Musical alignment | On beat boundary |
| Recommended length | 4, 8, 16, or 32 bars |

### Crossfade Timing

| Transition | Crossfade Duration |
|------------|---------------------|
| Intensity layer add | 500-1000ms |
| Intensity layer remove | 1000-2000ms |
| Track change (same mood) | 2000-4000ms |
| Track change (different mood) | 1000-2000ms |
| Immediate (dramatic) | 0-200ms |

## Implementation Patterns

### Low-Latency Sound Manager with AVAudioEngine

```swift
import AVFoundation

final class SoundManager {
    static let shared = SoundManager()

    private let engine = AVAudioEngine()
    private let mixer = AVAudioMixerNode()
    private var playerNodes: [String: AVAudioPlayerNode] = [:]
    private var audioBuffers: [String: AVAudioPCMBuffer] = [:]

    // Priority and pooling
    private var activeSounds: [String: [SoundInstance]] = [:]
    private let maxSimultaneous: Int = 32
    private let maxPerType: Int = 4

    struct SoundInstance {
        let playerNode: AVAudioPlayerNode
        let priority: Int
        let startTime: Date
    }

    private init() {
        setupAudioSession()
        setupEngine()
    }

    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            // Use playback for games (allows mixing with other apps)
            try session.setCategory(.ambient, mode: .default, options: [.mixWithOthers])
            // Low latency buffer
            try session.setPreferredIOBufferDuration(0.005) // 5ms
            try session.setPreferredSampleRate(48000)
            try session.setActive(true)
        } catch {
            print("Audio session setup failed: \(error)")
        }
    }

    private func setupEngine() {
        engine.attach(mixer)
        engine.connect(mixer, to: engine.mainMixerNode, format: nil)

        do {
            try engine.start()
        } catch {
            print("Audio engine start failed: \(error)")
        }
    }

    func preloadSound(named name: String, fileExtension: String = "caf") {
        guard audioBuffers[name] == nil else { return }

        guard let url = Bundle.main.url(forResource: name, withExtension: fileExtension),
              let file = try? AVAudioFile(forReading: url),
              let buffer = AVAudioPCMBuffer(
                  pcmFormat: file.processingFormat,
                  frameCapacity: AVAudioFrameCount(file.length)
              ) else {
            print("Failed to load sound: \(name)")
            return
        }

        do {
            try file.read(into: buffer)
            audioBuffers[name] = buffer
        } catch {
            print("Failed to read audio file: \(error)")
        }
    }

    func playSound(
        named name: String,
        volume: Float = 1.0,
        pitch: Float = 1.0,
        priority: Int = 50
    ) {
        guard let buffer = audioBuffers[name] else {
            print("Sound not preloaded: \(name)")
            return
        }

        // Check pool limits
        if !canPlaySound(named: name, priority: priority) {
            return
        }

        let playerNode = AVAudioPlayerNode()
        engine.attach(playerNode)

        // Apply pitch via rate (1.0 = normal, 2.0 = octave up)
        let format = buffer.format
        engine.connect(playerNode, to: mixer, format: format)

        playerNode.volume = volume

        // Schedule and play immediately
        playerNode.scheduleBuffer(buffer, at: nil, options: [], completionHandler: { [weak self] in
            DispatchQueue.main.async {
                self?.cleanupPlayerNode(playerNode, soundName: name)
            }
        })

        playerNode.play()

        // Track active instance
        let instance = SoundInstance(playerNode: playerNode, priority: priority, startTime: Date())
        if activeSounds[name] == nil {
            activeSounds[name] = []
        }
        activeSounds[name]?.append(instance)
    }

    private func canPlaySound(named name: String, priority: Int) -> Bool {
        // Check total limit
        let totalActive = activeSounds.values.flatMap { $0 }.count
        if totalActive >= maxSimultaneous {
            // Try to steal lowest priority
            return stealLowestPriority(minimumPriority: priority)
        }

        // Check per-type limit
        if let instances = activeSounds[name], instances.count >= maxPerType {
            // Steal oldest of same type
            if let oldest = instances.first {
                oldest.playerNode.stop()
                engine.detach(oldest.playerNode)
                activeSounds[name]?.removeFirst()
            }
        }

        return true
    }

    private func stealLowestPriority(minimumPriority: Int) -> Bool {
        var lowestPriority = Int.max
        var lowestSound: String?
        var lowestIndex: Int?

        for (name, instances) in activeSounds {
            for (index, instance) in instances.enumerated() {
                if instance.priority < lowestPriority {
                    lowestPriority = instance.priority
                    lowestSound = name
                    lowestIndex = index
                }
            }
        }

        guard lowestPriority < minimumPriority,
              let sound = lowestSound,
              let index = lowestIndex else {
            return false
        }

        if let instance = activeSounds[sound]?[index] {
            instance.playerNode.stop()
            engine.detach(instance.playerNode)
            activeSounds[sound]?.remove(at: index)
        }

        return true
    }

    private func cleanupPlayerNode(_ node: AVAudioPlayerNode, soundName: String) {
        engine.detach(node)
        activeSounds[soundName]?.removeAll { $0.playerNode === node }
    }

    func setMasterVolume(_ volume: Float) {
        mixer.volume = volume
    }
}
```

### Music Manager with Adaptive Layers

```swift
import AVFoundation

final class MusicManager {
    static let shared = MusicManager()

    private var musicPlayer: AVAudioPlayer?
    private var layerPlayers: [String: AVAudioPlayer] = [:]
    private var targetVolumes: [String: Float] = [:]

    private var currentIntensity: Float = 0.0
    private var intensityTimer: Timer?

    enum Layer: String, CaseIterable {
        case base = "base"
        case rhythm = "rhythm"
        case melody = "melody"
        case intensity = "intensity"
        case danger = "danger"
    }

    private init() {}

    func loadTrack(
        baseName: String,
        layers: [Layer] = [.base, .rhythm, .melody, .intensity]
    ) {
        // Stop existing music
        stopAllMusic()

        // Load each layer
        for layer in layers {
            let fileName = "\(baseName)_\(layer.rawValue)"
            guard let url = Bundle.main.url(forResource: fileName, withExtension: "m4a") else {
                continue
            }

            do {
                let player = try AVAudioPlayer(contentsOf: url)
                player.numberOfLoops = -1 // Infinite loop
                player.volume = 0 // Start silent
                player.prepareToPlay()
                layerPlayers[layer.rawValue] = player
                targetVolumes[layer.rawValue] = 0
            } catch {
                print("Failed to load music layer: \(layer.rawValue)")
            }
        }
    }

    func startPlayback() {
        // Synchronize all layers
        let startTime = layerPlayers.values.first?.deviceCurrentTime ?? 0 + 0.1

        for player in layerPlayers.values {
            player.play(atTime: startTime)
        }

        // Start with base layer
        setLayerVolume(.base, volume: 0.7, duration: 1.0)
    }

    func setIntensity(_ intensity: Float) {
        // Intensity 0.0 - 1.0 controls layer volumes
        currentIntensity = max(0, min(1, intensity))

        // Base always on
        setLayerVolume(.base, volume: 0.7, duration: 0.5)

        // Rhythm fades in at 0.2+
        let rhythmVolume = smoothstep(0.2, 0.4, currentIntensity) * 0.6
        setLayerVolume(.rhythm, volume: rhythmVolume, duration: 0.5)

        // Melody at 0.4+
        let melodyVolume = smoothstep(0.4, 0.6, currentIntensity) * 0.5
        setLayerVolume(.melody, volume: melodyVolume, duration: 1.0)

        // Intensity layer at 0.7+
        let intensityVolume = smoothstep(0.7, 0.9, currentIntensity) * 0.7
        setLayerVolume(.intensity, volume: intensityVolume, duration: 0.5)
    }

    func triggerDanger(_ enabled: Bool) {
        let volume: Float = enabled ? 0.5 : 0
        setLayerVolume(.danger, volume: volume, duration: enabled ? 0.5 : 2.0)

        // Duck other layers during danger
        if enabled {
            duckLayers(by: 0.3, duration: 0.5)
        } else {
            restoreLayerVolumes(duration: 1.0)
        }
    }

    private func setLayerVolume(_ layer: Layer, volume: Float, duration: TimeInterval) {
        guard let player = layerPlayers[layer.rawValue] else { return }

        targetVolumes[layer.rawValue] = volume

        // Animate volume change
        let steps = Int(duration * 60)
        let stepDuration = duration / Double(steps)
        let startVolume = player.volume
        let deltaVolume = volume - startVolume

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                let progress = Float(step) / Float(steps)
                player.volume = startVolume + (deltaVolume * progress)
            }
        }
    }

    private func duckLayers(by amount: Float, duration: TimeInterval) {
        for (layerName, player) in layerPlayers {
            guard layerName != Layer.danger.rawValue else { continue }
            let duckedVolume = max(0, player.volume - amount)
            animateVolume(player: player, to: duckedVolume, duration: duration)
        }
    }

    private func restoreLayerVolumes(duration: TimeInterval) {
        for (layerName, player) in layerPlayers {
            if let target = targetVolumes[layerName] {
                animateVolume(player: player, to: target, duration: duration)
            }
        }
    }

    private func animateVolume(player: AVAudioPlayer, to volume: Float, duration: TimeInterval) {
        let steps = Int(duration * 30)
        let stepDuration = duration / Double(steps)
        let startVolume = player.volume
        let delta = volume - startVolume

        for step in 0...steps {
            DispatchQueue.main.asyncAfter(deadline: .now() + stepDuration * Double(step)) {
                player.volume = startVolume + delta * Float(step) / Float(steps)
            }
        }
    }

    func stopAllMusic() {
        for player in layerPlayers.values {
            player.stop()
        }
        layerPlayers.removeAll()
        targetVolumes.removeAll()
    }

    private func smoothstep(_ edge0: Float, _ edge1: Float, _ x: Float) -> Float {
        let t = max(0, min(1, (x - edge0) / (edge1 - edge0)))
        return t * t * (3 - 2 * t)
    }
}
```

### Simple Sound Effect Player (Lightweight)

```swift
import AVFoundation

final class SimpleSFXPlayer {
    static let shared = SimpleSFXPlayer()

    private var soundIDs: [String: SystemSoundID] = [:]

    private init() {}

    /// Preload for instant playback (uses AudioServicesPlaySystemSound)
    func preload(soundNamed name: String, fileExtension: String = "caf") {
        guard soundIDs[name] == nil,
              let url = Bundle.main.url(forResource: name, withExtension: fileExtension) else {
            return
        }

        var soundID: SystemSoundID = 0
        AudioServicesCreateSystemSoundID(url as CFURL, &soundID)
        soundIDs[name] = soundID
    }

    /// Instant playback - lowest possible latency
    func play(_ name: String) {
        guard let soundID = soundIDs[name] else {
            print("Sound not preloaded: \(name)")
            return
        }
        AudioServicesPlaySystemSound(soundID)
    }

    /// Play with haptic (combines audio + haptic for tap feedback)
    func playWithHaptic(_ name: String) {
        guard let soundID = soundIDs[name] else { return }
        AudioServicesPlaySystemSoundWithCompletion(soundID, nil)
    }

    func unloadAll() {
        for soundID in soundIDs.values {
            AudioServicesDisposeSystemSoundID(soundID)
        }
        soundIDs.removeAll()
    }
}
```

### Ducking System Implementation

```swift
import AVFoundation

class AudioDuckingManager {
    static let shared = AudioDuckingManager()

    private var musicPlayer: AVAudioPlayer?
    private var duckingStack: [(reason: String, amount: Float)] = []
    private var originalMusicVolume: Float = 0.7

    func setMusicPlayer(_ player: AVAudioPlayer) {
        self.musicPlayer = player
        self.originalMusicVolume = player.volume
    }

    func duck(reason: String, amount: Float, duration: TimeInterval = 0.2) {
        duckingStack.append((reason, amount))
        applyDucking(duration: duration)
    }

    func unduck(reason: String, duration: TimeInterval = 0.2) {
        duckingStack.removeAll { $0.reason == reason }
        applyDucking(duration: duration)
    }

    private func applyDucking(duration: TimeInterval) {
        guard let player = musicPlayer else { return }

        // Calculate total ducking (additive, capped)
        let totalDuck = min(1.0, duckingStack.reduce(0) { $0 + $1.amount })
        let targetVolume = originalMusicVolume * (1.0 - totalDuck)

        // Animate
        animateVolume(to: targetVolume, duration: duration)
    }

    private func animateVolume(to target: Float, duration: TimeInterval) {
        guard let player = musicPlayer else { return }

        let start = player.volume
        let delta = target - start
        let steps = max(1, Int(duration * 60))

        for i in 0...steps {
            let delay = duration * Double(i) / Double(steps)
            DispatchQueue.main.asyncAfter(deadline: .now() + delay) {
                player.volume = start + delta * Float(i) / Float(steps)
            }
        }
    }
}

// Usage examples
extension AudioDuckingManager {
    func duckForImportantSFX() {
        duck(reason: "sfx", amount: 0.3, duration: 0.1)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.unduck(reason: "sfx", duration: 0.2)
        }
    }

    func duckForDialogue() {
        duck(reason: "dialogue", amount: 0.6, duration: 0.3)
    }

    func endDialogue() {
        unduck(reason: "dialogue", duration: 0.5)
    }

    func duckForPauseMenu() {
        duck(reason: "pause", amount: 0.5, duration: 0.2)
    }

    func resumeFromPause() {
        unduck(reason: "pause", duration: 0.2)
    }
}
```

### Sound Pool for Rapid-Fire Effects

```swift
import AVFoundation

class SoundPool {
    private let engine: AVAudioEngine
    private let mixer: AVAudioMixerNode
    private var players: [AVAudioPlayerNode]
    private var buffer: AVAudioPCMBuffer?
    private var currentIndex = 0

    let poolSize: Int

    init(engine: AVAudioEngine, mixer: AVAudioMixerNode, soundNamed name: String, poolSize: Int = 4) {
        self.engine = engine
        self.mixer = mixer
        self.poolSize = poolSize
        self.players = []

        // Load buffer
        if let url = Bundle.main.url(forResource: name, withExtension: "caf"),
           let file = try? AVAudioFile(forReading: url),
           let buffer = AVAudioPCMBuffer(
               pcmFormat: file.processingFormat,
               frameCapacity: AVAudioFrameCount(file.length)
           ) {
            try? file.read(into: buffer)
            self.buffer = buffer

            // Create pool
            for _ in 0..<poolSize {
                let player = AVAudioPlayerNode()
                engine.attach(player)
                engine.connect(player, to: mixer, format: buffer.format)
                players.append(player)
            }
        }
    }

    func play(volume: Float = 1.0) {
        guard let buffer = buffer else { return }

        let player = players[currentIndex]
        currentIndex = (currentIndex + 1) % poolSize

        // Stop if already playing
        player.stop()

        player.volume = volume
        player.scheduleBuffer(buffer, at: nil, options: [], completionHandler: nil)
        player.play()
    }

    func detachAll() {
        for player in players {
            player.stop()
            engine.detach(player)
        }
        players.removeAll()
    }
}
```

### Complete Game Audio Controller

```swift
import AVFoundation
import Combine

class GameAudioController: ObservableObject {
    static let shared = GameAudioController()

    // Volume settings
    @Published var masterVolume: Float = 1.0 {
        didSet { updateVolumes() }
    }
    @Published var musicVolume: Float = 0.7 {
        didSet { updateVolumes() }
    }
    @Published var sfxVolume: Float = 1.0 {
        didSet { updateVolumes() }
    }
    @Published var isMuted: Bool = false {
        didSet { updateVolumes() }
    }

    private let soundManager = SoundManager.shared
    private let musicManager = MusicManager.shared
    private let duckingManager = AudioDuckingManager.shared

    private init() {
        preloadCommonSounds()
    }

    private func preloadCommonSounds() {
        // Critical - preload for instant playback
        let sounds = [
            "tap", "collect", "hit", "jump", "land",
            "success", "error", "whoosh", "pop"
        ]
        for sound in sounds {
            soundManager.preloadSound(named: sound)
        }
    }

    private func updateVolumes() {
        let effectiveVolume = isMuted ? 0 : masterVolume
        soundManager.setMasterVolume(effectiveVolume * sfxVolume)
        // Music handled separately by MusicManager
    }

    // MARK: - Sound Effect Convenience Methods

    func playTap() {
        soundManager.playSound(named: "tap", volume: 0.8, priority: 100)
    }

    func playCollect() {
        soundManager.playSound(named: "collect", volume: 0.9, priority: 75)
    }

    func playHit() {
        soundManager.playSound(named: "hit", volume: 1.0, priority: 100)
        duckingManager.duckForImportantSFX()
    }

    func playJump() {
        soundManager.playSound(named: "jump", volume: 0.7, priority: 50)
    }

    func playLand() {
        soundManager.playSound(named: "land", volume: 0.6, priority: 50)
    }

    func playSuccess() {
        soundManager.playSound(named: "success", volume: 1.0, priority: 100)
        duckingManager.duckForImportantSFX()
    }

    func playError() {
        soundManager.playSound(named: "error", volume: 0.8, priority: 100)
    }

    // MARK: - Music Control

    func startGameplayMusic(trackName: String) {
        musicManager.loadTrack(baseName: trackName)
        musicManager.startPlayback()
    }

    func setGameplayIntensity(_ intensity: Float) {
        musicManager.setIntensity(intensity)
    }

    func stopMusic() {
        musicManager.stopAllMusic()
    }
}
```

## Decision Trees

### Choosing Audio Format

```
Is this sound effect or music?
├── MUSIC:
│   ├── Need seamless loop? → IMA4 or AIFF
│   ├── File size critical? → AAC (256kbps)
│   └── Default → AAC (hardware decoded, efficient)
└── SOUND EFFECT:
    ├── Needs <20ms latency? (button, hit) → CAF (uncompressed)
    ├── Multiple simultaneous plays? → CAF (PCM or IMA4)
    ├── File size critical? → IMA4 (4:1 compression)
    └── Default → CAF with IMA4
```

### When to Duck Music

```
What is happening?
├── Important SFX (hit, success)
│   └── Duck 3-6dB for SFX duration + 200ms
├── Dialogue playing
│   └── Duck 12-18dB until dialogue ends + 500ms
├── Pause menu opened
│   └── Duck 6-12dB until resume
├── Reward/loot reveal
│   └── Duck 6dB during ceremony
├── Game over
│   └── Fade music to 0 over 500ms
└── Normal gameplay
    └── No ducking
```

### When to Use Silence

```
What moment is this?
├── Before boss reveal
│   └── 1-2s silence builds tension
├── After player death
│   └── 500ms silence for gravity
├── Before critical hit lands
│   └── 100-200ms emphasizes impact
├── Menu opens (important)
│   └── Brief 100ms dip in audio
├── Level complete (before fanfare)
│   └── 200ms pause for punctuation
└── Normal gameplay
    └── Continuous audio appropriate
```

### Setting Sound Priority

```
Who initiated the action?
├── Player directly
│   └── Priority 100 (Critical)
├── Enemy affecting player
│   └── Priority 75 (High)
├── World event player should notice
│   └── Priority 50 (Medium)
├── Ambient/background
│   └── Priority 25 (Low)
└── Music
    └── Priority 0 (Lowest)

Is the game state critical?
├── Game over / Victory
│   └── Boost +25 priority
├── Tutorial moment
│   └── Boost +25 priority
└── Normal play
    └── Use base priority
```

## Quality Checklist

### Technical Setup
- [ ] Audio session category set to `.ambient` or `.playback`
- [ ] Buffer duration set to 0.005s (5ms) or lower
- [ ] Sample rate set to 48kHz
- [ ] Sounds preloaded before gameplay starts
- [ ] Only 1 AAC/MP3 stream for music

### Sound Effects
- [ ] Critical feedback sounds under 20ms latency
- [ ] Button tap has clear, short (30-80ms) sound
- [ ] Collection sounds are satisfying (80-150ms)
- [ ] Hit sounds have punch (bass thump + crack)
- [ ] Fundamental frequencies above 400Hz for clarity
- [ ] Same sound type limited to 3-4 simultaneous

### Music
- [ ] Music loops seamlessly (0 sample gap)
- [ ] Music volume 60-70% relative to SFX max
- [ ] Adaptive layers crossfade smoothly (500-2000ms)
- [ ] Music ducks appropriately for important sounds
- [ ] Music resumes naturally after ducking

### Mixing
- [ ] Player actions are loudest (90-100%)
- [ ] UI sounds are clear (80-90%)
- [ ] Ambient sounds are subtle (40-60%)
- [ ] No sound peaks or clips
- [ ] Volume settings persist across sessions

### Polish
- [ ] Silence used intentionally for impact
- [ ] No audio pops or clicks on start/stop
- [ ] Audio continues through app lifecycle events
- [ ] Mute toggle works correctly
- [ ] Sound plays in sync with visuals (<20ms offset)

## Anti-Patterns

### Wrong File Format
**Problem**: Using MP3 for rapid-fire sound effects
**Consequence**: Only 1 hardware stream, sounds cut each other off
**Solution**: Use CAF (PCM or IMA4) for all SFX, reserve AAC/MP3 for music only

### No Preloading
**Problem**: Loading sounds at moment of playback
**Consequence**: Noticeable delay (100-500ms) before sound plays
**Solution**: Preload all gameplay sounds during loading screen

### Volume Stacking
**Problem**: 20 coin collect sounds playing simultaneously
**Consequence**: Audio clips and distorts, feels chaotic
**Solution**: Limit same sound type to 3-4 simultaneous with pooling

### Constant Full Volume
**Problem**: Music and SFX both at 100%, no ducking
**Consequence**: Audio becomes muddy, important sounds lost
**Solution**: Music at 60-70%, duck during important SFX

### Ignoring Phone Speakers
**Problem**: Bass-heavy sounds that rely on sub-400Hz frequencies
**Consequence**: Sounds weak or inaudible on iPhone speakers
**Solution**: Boost 800Hz-2kHz, accept bass is for headphones only

### No Priority System
**Problem**: Ambient sounds steal channels from player feedback
**Consequence**: Button press sound doesn't play during busy scenes
**Solution**: Implement priority system, critical sounds always play

### Forgetting Silence
**Problem**: Constant audio with no quiet moments
**Consequence**: Audio fatigue, nothing feels impactful
**Solution**: Strategic silence before/after important moments

## Adjacent Skills

- **haptic-optimizer**: Trigger haptics synchronized with sound (haptic at T+5ms, sound at T+15ms in collection sequence)
- **animation-system**: Time sounds to animation keyframes (land sound when squash begins)
- **particle-effects**: Sync particle burst sounds with emission start
- **screen-shake-impact**: Heavy impact sounds accompany screen shake
- **juice-orchestrator**: Coordinate audio with all feedback channels for cohesive game feel
