---
name: audio-designer
description: Use when implementing game audio including sound effects, music systems, ducking, and low-latency playback for iOS games.
---

# Audio Designer

## Core Principles

**Target <20ms latency** for critical feedback. Use CAF format for SFX (software decoded, unlimited simultaneous), AAC for music (1 hardware stream only). iPhone speakers cut off below 400Hz—boost 800Hz-2kHz for clarity.

## Format Selection

| Use Case | Format | Latency | Notes |
|----------|--------|---------|-------|
| Critical SFX | CAF (PCM) | Lowest | Button press, hit feedback |
| Standard SFX | CAF (IMA4) | Low | 4:1 compression, loops well |
| Background music | AAC | Medium | ONE hardware stream only |

**Conversion**: `afconvert -f caff -d LEI16 input.wav output.caf`

## Sound Effect Guidelines

- **Button tap**: 30-80ms, 1-2kHz fundamental
- **Collection**: 80-150ms, 2-4kHz (bright, sparkly)
- **Hit/impact**: 50-150ms, bass thump (150-400Hz) + crack (1-2kHz)
- **Limit same sound**: 3-4 simultaneous max (use pooling)

## Music System

Layer-based adaptive music:
- **Base**: Always playing (0.7 volume)
- **Rhythm**: Fades in at intensity 0.2+
- **Melody**: Fades in at intensity 0.4+
- **Intensity**: Combat/action at 0.7+

Crossfade timing: 500-2000ms for layer transitions.

## Ducking

| Trigger | Duck Amount | Duration |
|---------|-------------|----------|
| Important SFX | -6 to -12dB | SFX + 200ms |
| Pause menu | -12dB | Until resume |
| Dialogue | -12 to -18dB | Dialogue + 500ms |

## Priority System

| Priority | Value | Categories |
|----------|-------|------------|
| Critical | 100 | Player actions |
| High | 75 | Enemy actions |
| Medium | 50 | Environmental |
| Low | 25 | Ambient |

Higher priority always plays. Critical sounds never stolen.

## Silence as Design

- Before boss reveal: 1-2s
- After death: 500ms
- Before critical hit: 100-200ms

## Audio Session Setup

```swift
try session.setCategory(.ambient, options: [.mixWithOthers])
try session.setPreferredIOBufferDuration(0.005) // 5ms
try session.setPreferredSampleRate(48000)
```

## Checklist

- [ ] Preload sounds before gameplay
- [ ] Critical sounds <20ms latency
- [ ] Music at 60-70% relative to SFX
- [ ] Same sound limited to 3-4 simultaneous
- [ ] Frequencies above 400Hz for phone speakers
- [ ] Strategic silence for impact

## References

- [Code Patterns](references/code-patterns.md) - SoundManager, MusicManager, SoundPool, DuckingManager
- [API Reference](references/api-reference.md) - Hardware constraints, format specs, frequency guidelines

## Adjacent Skills

- **haptic-optimizer**: Sync haptics with audio (haptic at T+5ms, sound at T+15ms)
- **animation-system**: Time sounds to animation keyframes
