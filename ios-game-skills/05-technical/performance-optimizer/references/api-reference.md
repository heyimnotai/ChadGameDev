# Performance Optimizer API Reference

## Frame Rate Targets

| Device Class | Target | Frame Budget |
|--------------|--------|--------------|
| A10-A11 (iPhone 7-X) | 60fps | 16.67ms |
| A12-A14 (iPhone XS-12) | 60fps | 16.67ms |
| A15+ with ProMotion | 120fps | 8.33ms |
| iPad Pro (2017+) | 120fps | 8.33ms |

## Memory Budgets

| Resource | Budget | Notes |
|----------|--------|-------|
| Total app | <1GB | Terminate at ~1.25GB |
| Textures | <256MB | More on high-end |
| Audio buffers | <32MB | All loaded sounds |
| Physics | <16MB | Depends on body count |
| Per-scene | <50MB | Transition safety |

## Thermal States

| State | Action |
|-------|--------|
| .nominal | Full quality, 120Hz |
| .fair | Monitor, no changes |
| .serious | 60Hz, reduce particles |
| .critical | 30Hz, pause non-essential |

## Launch Time Budget

| Phase | Budget |
|-------|--------|
| System init | 100ms |
| App init | 200ms |
| First frame | 100ms |
| **Total** | **<400ms** |

## Memory Thresholds

| Level | Bytes | Action |
|-------|-------|--------|
| Normal | <700MB | Continue |
| Warning | 700-900MB | Clear caches |
| Critical | >900MB | Emergency cleanup |
| Terminate | ~1.25GB | iOS kills app |

## Instruments Templates

| Template | Use Case |
|----------|----------|
| Time Profiler | CPU hotspots |
| Metal System Trace | GPU analysis |
| Allocations | Memory leaks |
| Game Performance | Combined view |

## CADisplayLink Best Practices

| Property | Use |
|----------|-----|
| targetTimestamp | When frame should display (USE THIS) |
| timestamp | When last frame displayed (DON'T use for delta) |
| preferredFrameRateRange | Set min/max/preferred FPS |

## Battery Optimization

| Condition | Recommended FPS |
|-----------|----------------|
| Charging | 120fps |
| Battery >50% | 60fps |
| Battery <20% | 60fps, reduce particles |
| Low Power Mode | 30fps |

## Frame Time Analysis

| Bottleneck | Indicator |
|------------|-----------|
| CPU bound | update + physics > 60% frame |
| GPU bound | render > 60% frame |
| Balanced | Neither dominant |

## Common Causes

### Frame Drops
- Allocations in game loop
- Node enumeration every frame
- Uncached physics queries
- Too many particles

### Memory Growth
- Texture cache unbounded
- Audio buffers not released
- Strong reference cycles
- SKNode not removed from parent
