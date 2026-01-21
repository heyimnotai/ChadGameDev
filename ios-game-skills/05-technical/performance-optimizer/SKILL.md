---
name: performance-optimizer
description: Use when optimizing frame rates, configuring ProMotion, monitoring memory, handling thermal throttling, or profiling with Instruments. Triggers on frame drops, memory warnings, thermal issues, or production release preparation.
---

# Performance Optimizer

## Purpose

Maintain 60fps (120fps on ProMotion) and efficient resource usage across all iOS devices. Handle memory budgets, thermal throttling, battery optimization, and profiling.

## When to Use

- Frame rate below 60fps
- Memory warnings or crashes
- Thermal throttling issues
- Enabling ProMotion (120Hz)
- Pre-release performance audit

## Core Process

1. Add `CADisableMinimumFrameDurationOnPhone: YES` to Info.plist
2. Configure CADisplayLink with `preferredFrameRateRange`
3. Use `targetTimestamp` (not `timestamp`) for delta time
4. Cap delta time to prevent physics explosions
5. Monitor thermal state and adapt quality
6. Track memory usage, stay under 1GB
7. Profile with Instruments (Time Profiler, Allocations)

## Key Rules

- **Frame budget**: 16.67ms (60fps) or 8.33ms (120fps)
- **Memory**: Peak <1GB, stable <800MB
- **Launch**: First frame <400ms
- **Delta time**: Always cap to ~33ms max

## Quick Reference

### Frame Rate Targets

| Condition | Target |
|-----------|--------|
| ProMotion, nominal thermal | 120fps |
| Standard device or thermal .serious | 60fps |
| Thermal .critical or low power | 30fps |

### Memory Budgets

| Resource | Budget |
|----------|--------|
| Total app | <1GB |
| Textures | <256MB |
| Audio buffers | <32MB |
| Per-scene overhead | <50MB |

### Thermal Response

| State | Action |
|-------|--------|
| .nominal | Full quality, 120Hz |
| .fair | Monitor, no changes |
| .serious | 60Hz, reduce particles |
| .critical | 30Hz, minimal quality |

## Critical Code

```swift
// Info.plist: CADisableMinimumFrameDurationOnPhone = YES

// CADisplayLink setup
if #available(iOS 15.0, *) {
    displayLink.preferredFrameRateRange = CAFrameRateRange(
        minimum: 60, maximum: 120, preferred: 120
    )
}

// CRITICAL: Use targetTimestamp, not timestamp
let deltaTime = displayLink.targetTimestamp - lastTimestamp
let cappedDelta = min(deltaTime, 1.0 / 30.0)
```

## Anti-Patterns

**Using timestamp**: Use targetTimestamp for proper frame pacing
**Ignoring thermal**: Always monitor and respond to thermal state
**Allocating in game loop**: Pool objects, reuse collections
**Uncapped delta time**: Cap to prevent physics explosions after pause

## Profiling Checklist

- [ ] Time Profiler: Find CPU hotspots
- [ ] Metal System Trace: Check GPU utilization
- [ ] Allocations: Track memory leaks
- [ ] Game Performance template: Correlate frame drops

## Adjacent Skills

- `spritekit-patterns` - Scene architecture
- `asset-pipeline` - Texture compression
- `analytics-integration` - Performance telemetry

## References

See `references/code-patterns.md` for monitoring implementations.
See `references/api-reference.md` for benchmarks.
