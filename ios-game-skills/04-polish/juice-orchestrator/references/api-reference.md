# Juice Orchestrator API Reference

## Feedback Layer Timing (Relative to Event Trigger at T+0)

| Layer | Offset | Duration | Priority |
|-------|--------|----------|----------|
| **Haptic** | T+0ms | Instant | 1 (first) |
| **Sound** | T+5-15ms | Varies | 2 |
| **Visual Flash** | T+0-10ms | 50-150ms | 3 |
| **Animation Start** | T+0-20ms | Varies | 4 |
| **Particle Spawn** | T+20-50ms | 200-2000ms | 5 |
| **Screen Shake** | T+0-30ms | 100-600ms | 6 |
| **UI Update** | T+50-200ms | 200-500ms | 7 (last) |

## Feedback Intensity Tiers

| Tier | Name | Use Case | Layer Count | Max Duration |
|------|------|----------|-------------|--------------|
| **1** | Micro | UI taps, minor collisions | 1-2 layers | 100ms |
| **2** | Small | Coin pickup, basic hits | 2-3 layers | 300ms |
| **3** | Medium | Enemy defeat, combo milestone | 3-4 layers | 500ms |
| **4** | Large | Level complete, achievement | 4-5 layers | 1000ms |
| **5** | Epic | Boss defeat, new high score | All layers | 2000ms+ |

## Feedback Fatigue Prevention

| Mechanism | Threshold | Cooldown |
|-----------|-----------|----------|
| **Same Event Cooldown** | Any repeat | 50-100ms minimum |
| **Haptic Rate Limit** | 10/second max | 100ms forced gap |
| **Sound Overlap Limit** | 8 simultaneous | Oldest dropped |
| **Particle Budget** | 500 total active | New effects throttled |
| **Screen Shake Cap** | Trauma 1.0 max | Additive capped |

## Performance Budget Per Frame

| System | Target Budget | Max Budget |
|--------|---------------|------------|
| **Haptic Trigger** | 0.1ms | 0.5ms |
| **Audio Mix** | 1.0ms | 2.0ms |
| **Particle Update** | 2.0ms | 4.0ms |
| **Screen Shake Calc** | 0.3ms | 0.5ms |
| **Total Juice** | 5.0ms | 8.0ms |

## Event-to-Feedback Mappings

### Tier 1: Micro Feedback

**UI Button Tap**
| Layer | Specification |
|-------|--------------|
| Haptic | Light impact |
| Sound | Soft click, 20ms |
| Animation | Scale 0.95x, 100ms |

### Tier 2: Small Feedback

**Collect Coin/Common Item**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Light impact |
| T+5ms | Sound | Coin chime, 100-200ms |
| T+10ms | Animation | Item scales up 1.3x over 50ms |
| T+30ms | Particle | 5-10 sparkles, burst |
| T+60ms | Animation | Item flies to counter, 200ms |
| T+260ms | UI | Score increment animation, 300ms |

**Basic Enemy Hit**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Light impact |
| T+0ms | Flash | White sprite flash, 50ms |
| T+5ms | Sound | Hit sound, 80ms |
| T+10ms | Animation | Enemy knockback/flinch |
| T+20ms | Particle | 3-5 impact sparks |

### Tier 3: Medium Feedback

**Enemy Defeated**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 8-12 frames (133-200ms) |
| T+0ms | Haptic | Medium impact |
| T+0ms | Flash | White flash on enemy, 80ms |
| T+10ms | Sound | Defeat sound, 300ms |
| T+10ms | Screen Shake | Light (3px, 0.15s) |
| T+50ms | Particle | 15-25 explosion particles |
| T+100ms | Animation | Enemy death animation |
| T+150ms | Spawn | XP/loot drops with arcs |
| T+300ms | UI | Score popup at enemy position |

**Damage Taken**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 4-8 frames (66-133ms) |
| T+0ms | Haptic | Heavy impact |
| T+0ms | Flash | Red screen flash, 0.4 opacity, 100ms |
| T+10ms | Sound | Damage sound, 200ms |
| T+20ms | Screen Shake | Medium (6px, 0.2s) |
| T+20ms | Animation | Player knockback/flinch |
| T+50ms | UI | Health bar pulse red |
| T+100ms | Camera | Subtle zoom in 1.02x, 150ms |

### Tier 4: Large Feedback

**Level Complete**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Haptic | Success notification |
| T+0ms | Sound | Victory fanfare start |
| T+100ms | Camera | Slow zoom to player, 500ms |
| T+200ms | Particle | Confetti burst, 50 particles |
| T+300ms | Animation | Player victory pose |
| T+500ms | UI | "Level Complete" banner slides in |
| T+700ms | UI | Star rating reveal (staggered) |
| T+1000ms | UI | Score tally begins (rolling numbers) |

### Tier 5: Epic Feedback

**Boss Defeated**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 20-30 frames (333-500ms) |
| T+0ms | Haptic | Heavy impact sequence |
| T+0ms | Flash | White screen flash, 0.8 opacity |
| T+50ms | Screen Shake | Heavy (15px, 0.5s) |
| T+100ms | Sound | Boss defeat fanfare |
| T+200ms | Particle | Massive explosion, 100+ particles |
| T+300ms | Camera | Zoom in on boss, 500ms |
| T+500ms | Animation | Boss death sequence |
| T+800ms | Slow Motion | 0.3x speed for 1 second |
| T+1000ms | Particle | Secondary explosions |

**Game Over**
| Timing | Layer | Specification |
|--------|-------|--------------|
| T+0ms | Hitstop | 15-20 frames |
| T+0ms | Haptic | Heavy impact |
| T+0ms | Flash | Red flash, 0.6 opacity |
| T+50ms | Sound | Failure sound |
| T+100ms | Screen Shake | Heavy (12px, 0.4s) |
| T+200ms | Animation | Player death animation |
| T+300ms | Color | Desaturate screen over 500ms |
| T+500ms | Audio | Music fade out, 1000ms |
| T+1000ms | UI | "Game Over" text fades in |

## Event Priority System

| Priority | Value | Categories |
|----------|-------|------------|
| Low | 0 | Ambient, decoration |
| Normal | 1 | Standard gameplay |
| High | 2 | Important events |
| Critical | 3 | Cannot be interrupted |
