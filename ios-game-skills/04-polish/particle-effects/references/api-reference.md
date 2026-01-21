# Particle Effects API Reference

## Global Particle Budget

| Constraint | Value | Notes |
|------------|-------|-------|
| Total active particles | 200-500 maximum | All emitters combined |
| Target for smooth 60fps | 200-300 | Conservative for older devices |
| Per-effect maximum | 35-100 particles | Depends on effect type |
| Simultaneous emitters | 8-12 maximum | Active emitters at once |
| Particle texture size | 32x32 to 64x64 px | Smaller = better performance |

## Per-Effect Particle Counts

| Effect Type | Particle Count | Emission | Duration |
|-------------|----------------|----------|----------|
| Coin collect | 15-25 | Burst | 0.3-0.5s |
| Small explosion | 30-50 | Burst | 0.4-0.6s |
| Large explosion | 50-80 | Burst | 0.6-1.0s |
| Sparkle/shine | 10-20 | Continuous | Looping |
| Confetti | 40-80 | Burst | 1.5-3.0s |
| Dust/debris | 20-40 | Burst | 0.5-1.0s |
| Magic/power-up | 20-35 | Continuous | Effect duration |
| Trail | 15-30/sec | Continuous | While moving |
| Ambient (background) | 10-20 | Continuous | Looping |
| Hit impact | 10-20 | Burst | 0.2-0.4s |
| Fire/flame | 25-40 | Continuous | Looping |
| Smoke | 15-25 | Continuous | Looping |

## Particle Lifetime Guidelines

| Effect Type | Lifetime | Variation | Notes |
|-------------|----------|-----------|-------|
| Quick burst (hit, collect) | 0.3-0.5s | 20% | Short, punchy |
| Standard (explosion) | 0.5-1.0s | 30% | Medium duration |
| Floaty (confetti, feathers) | 1.5-3.0s | 40% | Slow fall |
| Ambient (sparkles, dust) | 2.0-4.0s | 50% | Gentle cycling |
| Trail | 0.2-0.5s | 10% | Quick fade behind |
| Smoke | 1.0-2.0s | 30% | Slower dissipation |

## Emission Patterns

| Pattern | Birth Rate | Use Case |
|---------|------------|----------|
| Single burst | Total / 0.01s | Explosion, impact, collect |
| Rapid burst | Total / 0.1s | Confetti, celebration |
| Continuous | 10-50/sec | Ambient, fire, magic aura |
| Trail | 20-40/sec | Movement trail, projectile |
| Pulsing | Varies | Heartbeat, warning |

## Color Over Lifetime Curves

### Explosion
| Time | Color | Alpha |
|------|-------|-------|
| 0% | White (#FFFFFF) | 1.0 |
| 20% | Yellow (#FFDD00) | 1.0 |
| 50% | Orange (#FF6600) | 0.8 |
| 80% | Dark Red (#AA0000) | 0.4 |
| 100% | Black (#000000) | 0.0 |

### Coin Collect Sparkle
| Time | Color | Alpha |
|------|-------|-------|
| 0% | White (#FFFFFF) | 1.0 |
| 30% | Gold (#FFD700) | 1.0 |
| 70% | Gold (#FFD700) | 0.6 |
| 100% | Transparent Gold | 0.0 |

### Dust/Debris
| Time | Color | Alpha |
|------|-------|-------|
| 0% | Brown (#8B7355) | 0.8 |
| 50% | Light Brown (#A0907B) | 0.5 |
| 100% | Tan (#C0B090) | 0.0 |

## Scale Over Lifetime

| Effect Type | Start Scale | End Scale | Variation |
|-------------|-------------|-----------|-----------|
| Explosion | 0.5 | 2.0-3.0 | 30% |
| Sparkle | 0.8 | 0.2 | 20% |
| Confetti | 1.0 | 1.0 | 10% |
| Dust | 0.3 | 1.5 | 40% |
| Smoke | 0.5 | 2.5 | 30% |
| Fire | 0.8 | 0.3 | 25% |
| Trail | 1.0 | 0.1 | 10% |
| Magic | 0.6 | 1.2 | 20% |

## Velocity and Physics

| Effect Type | Initial Speed | Speed Range | Gravity | Notes |
|-------------|---------------|-------------|---------|-------|
| Explosion | 200-400 pt/s | 150-600 | 0 to 50 | Outward radial |
| Coin collect | 100-200 pt/s | 80-250 | -20 | Upward arc |
| Confetti | 50-150 pt/s | 30-200 | 100-200 | Floaty fall |
| Dust | 30-80 pt/s | 20-100 | 50-100 | Settling |
| Smoke | 20-50 pt/s | 10-70 | -30 to -50 | Rising |
| Fire | 40-80 pt/s | 30-100 | -100 | Strong upward |
| Sparkle | 10-30 pt/s | 5-50 | 0 | Gentle drift |
| Hit impact | 150-300 pt/s | 100-400 | 200-400 | Quick spray |

## Rotation Over Lifetime

| Effect Type | Rotation Speed | Variation | Notes |
|-------------|----------------|-----------|-------|
| Confetti | 90-360 deg/s | High | Tumbling |
| Debris | 180-540 deg/s | High | Spinning fragments |
| Sparkle | 0-45 deg/s | Low | Subtle twinkle |
| Smoke | 0-30 deg/s | Low | Gentle swirl |
| Fire | 0 | - | Oriented upward |
| Leaves | 90-180 deg/s | Medium | Natural tumble |

## Blend Modes

| Effect Type | Blend Mode | Notes |
|-------------|------------|-------|
| Explosion | Additive (.add) | Bright, glowing |
| Fire | Additive (.add) | Hot glow |
| Sparkle | Additive (.add) | Light emission |
| Magic | Additive (.add) | Mystical glow |
| Smoke | Alpha (.alpha) | Realistic |
| Dust | Alpha (.alpha) | Realistic |
| Confetti | Alpha (.alpha) | Solid pieces |
| Debris | Alpha (.alpha) | Solid pieces |

## Texture Atlas Requirements

| Requirement | Specification |
|-------------|---------------|
| Atlas size | 512x512 or 1024x1024 maximum |
| Particle texture size | 32x32 (standard), 64x64 (detailed) |
| Particles per atlas | 16-64 textures |
| Texture format | ASTC 4x4 (quality) or ASTC 6x6 (balance) |
| Alpha channel | Required for soft edges |
| Texture variations | 4-8 per effect type |
