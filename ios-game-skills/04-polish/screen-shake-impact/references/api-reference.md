# Screen Shake & Impact API Reference

## Screen Shake Intensity Values

| Impact Level | Magnitude (pixels) | Duration | Use Case |
|-------------|-------------------|----------|----------|
| **Light** | 2-5 px | 0.1-0.2s | Small hits, footsteps, light bumps |
| **Medium** | 5-10 px | 0.2-0.4s | Standard damage, explosions, heavy landings |
| **Heavy** | 10-20 px | 0.3-0.6s | Critical hits, boss attacks, major events |
| **Extreme** | 20-30 px | 0.4-0.8s | Screen-clearing events, death, phase transitions |

## Shake Direction Types

| Direction | Application | Feel |
|-----------|-------------|------|
| **Horizontal** | Side impacts, horizontal knockback | Pushed sideways |
| **Vertical** | Ground pounds, vertical hits | Jarring, heavy |
| **Omni-directional** | Explosions, general impacts | Chaotic, powerful |
| **Rotational** | Disorientation, stun effects | Dizzying, off-balance |

## Freeze Frame (Hitstop) Duration

| Impact Type | Frame Count | Duration (at 60fps) | Use Case |
|------------|-------------|---------------------|----------|
| **Fast/Light** | 2-4 frames | 33-66ms | Quick jabs, light attacks |
| **Standard** | 8-12 frames | 133-200ms | Normal combat hits |
| **Heavy** | 15-20 frames | 250-333ms | Charged attacks, finishers |
| **Ultra** | 20-30 frames | 333-500ms | Critical kills, boss phase ends |

## Flash Effect Specifications

| Flash Type | Color | Opacity | Duration | Decay |
|-----------|-------|---------|----------|-------|
| **Hit Flash** | White (#FFFFFF) | 0.6-0.8 | 50-100ms | Linear |
| **Damage Flash** | Red (#FF0000) | 0.3-0.5 | 100-150ms | Ease-out |
| **Critical Flash** | Yellow (#FFFF00) | 0.7-0.9 | 80-120ms | Linear |
| **Heal Flash** | Green (#00FF00) | 0.3-0.5 | 150-200ms | Ease-out |
| **Shield Flash** | Blue (#0088FF) | 0.4-0.6 | 100-150ms | Ease-out |

## Camera Zoom/Punch Values

| Effect | Scale Change | Duration | Easing |
|--------|-------------|----------|--------|
| **Subtle punch** | 1.0 -> 1.02 -> 1.0 | 100-150ms | Ease-out |
| **Medium punch** | 1.0 -> 1.05 -> 1.0 | 150-250ms | Ease-out |
| **Heavy punch** | 1.0 -> 1.08 -> 1.0 | 200-350ms | Ease-out-elastic |
| **Zoom in (focus)** | 1.0 -> 1.15 | 300-500ms | Ease-in-out |

## Trauma-Based Shake Formula

**Trauma-squared decay** produces the most satisfying shake:

```
Effective Shake = Trauma^2
```

This creates:
- Intense initial shake at high trauma
- Rapid falloff as trauma decreases
- Natural-feeling deceleration

## Configuration Values

| Parameter | Default | Range | Notes |
|-----------|---------|-------|-------|
| Max Offset | 20 pixels | 5-30 | Maximum pixel displacement |
| Max Rotation | 0.05 radians | 0-0.1 | ~3 degrees max |
| Trauma Decay | 2.0/second | 1.0-4.0 | Trauma units lost per second |
| Noise Speed | 30 | 20-50 | Perlin noise sample speed |
