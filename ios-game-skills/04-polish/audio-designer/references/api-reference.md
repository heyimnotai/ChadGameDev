# Audio Designer API Reference

## iOS Audio Hardware Constraints

| Constraint | Value | Notes |
|------------|-------|-------|
| iPhone speaker floor | 400Hz | Below inaudible/weak |
| Safe clarity range | 800Hz - 10kHz | Best phone speaker reproduction |
| Harsh zone | 4kHz - 5kHz | Use sparingly |
| Upper limit | 22kHz | iOS system limit |
| Hardware-decoded streams | 1 | Only ONE AAC/MP3/ALAC at a time |
| Software-decoded streams | 32+ | Practical limit for simultaneous SFX |

## Latency Requirements

| Priority | Latency | Use Case |
|----------|---------|----------|
| Critical | <20ms | Button press, hit feedback, collection |
| Important | <50ms | UI sounds, ambient triggers |
| Acceptable | <100ms | Background music, non-interactive |

**Low Latency Settings:** Sample rate 48kHz, Buffer 64 samples, I/O duration 0.005s

## Audio File Format Selection

| Format | Extension | Compression | Latency | Use Case |
|--------|-----------|-------------|---------|----------|
| CAF (Linear PCM) | .caf | None | Lowest | Critical SFX, rapid-fire |
| CAF (IMA4) | .caf | 4:1 | Low | Standard SFX, seamless loops |
| AAC | .m4a | High | Medium | Background music (1 stream) |
| AIFF | .aiff | None | Low | Music loops, high-quality SFX |
| MP3 | .mp3 | High | Medium | Fallback music only |

## Conversion Commands

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

## Sound Effect Duration Guidelines

| Effect Type | Duration | Notes |
|-------------|----------|-------|
| Button tap | 30-80ms | Short, crisp |
| Collection/pickup | 80-150ms | Satisfying but not lingering |
| Hit/impact | 50-150ms | Sharp attack, quick decay |
| UI whoosh | 100-200ms | Transition accompaniment |
| Success fanfare | 500-1500ms | Celebratory |
| Error/failure | 200-400ms | Clear but not annoying |
| Ambient loop | 2-10s | Seamless loop point |

## Frequency Guidelines by Effect Type

| Effect Type | Fundamental | Harmonics | Notes |
|-------------|-------------|-----------|-------|
| Button click | 1-2kHz | 3-6kHz | Clean, no bass |
| Coin collect | 2-4kHz | 6-10kHz | Bright, sparkly |
| Hit/punch | 150-400Hz + 1-2kHz | Wide | Bass thump + crack |
| Jump | 400-800Hz | Rising pitch | Upward movement |
| Land | 100-300Hz + 800Hz | Impact | Thump + slap |
| Explosion | 60-200Hz + 2-5kHz | Wide | Bass rumble + crack |

**Phone Speaker Compensation:** Boost 800Hz-2kHz for clarity. Roll off below 400Hz.

## Simultaneous Sound Management

| Limit | Value | Notes |
|-------|-------|-------|
| Total active sounds | 32 | Practical maximum |
| Same sound type | 3-4 | Prevent stacking |
| Music channels | 1-2 | Main + ambient layer |
| UI sounds | 4-6 | Reserved priority |
| SFX pool | 20-24 | Gameplay sounds |

## Audio Priority System

| Priority | Value | Categories |
|----------|-------|------------|
| Critical | 100 | Player actions, game-critical feedback |
| High | 75 | Enemy actions, important events |
| Medium | 50 | Environmental, collectibles |
| Low | 25 | Ambient, background detail |
| Lowest | 0 | Music, optional atmosphere |

## Volume Balancing Guidelines

| Category | Relative Volume | Notes |
|----------|-----------------|-------|
| Music | 60-70% | Never overpower SFX |
| SFX - UI | 80-90% | Clear feedback |
| SFX - Player actions | 90-100% | Most important |
| SFX - World/Ambient | 40-60% | Background layer |
| SFX - Enemy | 70-80% | Important but not player |

## Ducking Specifications

| Trigger | Duck Target | Amount | Duration |
|---------|-------------|--------|----------|
| Important SFX | Music | -6dB to -12dB | SFX duration + 200ms |
| Dialogue | Music, SFX | -12dB to -18dB | Dialogue + 500ms |
| Pause menu | All gameplay | -12dB | Until resume |
| Game over | Gameplay SFX | Fade to 0 | 500ms |

## Silence as Design Tool

| Moment | Duration | Purpose |
|--------|----------|---------|
| Before boss reveal | 1-2s | Build tension |
| After death | 500ms | Gravity of moment |
| Before critical hit | 100-200ms | Emphasize impact |
| Level complete (before fanfare) | 200ms | Punctuation |

## Adaptive Music Layers

| Layer | Content | Trigger |
|-------|---------|---------|
| Base | Ambient pad, low energy | Always playing |
| Rhythm | Percussion, pulse | Player active |
| Melody | Main theme | Normal gameplay |
| Intensity | Additional instruments | Combat/action |
| Danger | Tension elements | Low health/time |

## Crossfade Timing

| Transition | Crossfade Duration |
|------------|---------------------|
| Intensity layer add | 500-1000ms |
| Intensity layer remove | 1000-2000ms |
| Track change (same mood) | 2000-4000ms |
| Track change (different mood) | 1000-2000ms |
| Immediate (dramatic) | 0-200ms |
