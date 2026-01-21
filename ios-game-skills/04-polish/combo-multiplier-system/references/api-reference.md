# Combo Multiplier System API Reference

## Timing Windows

| Combo Level | Time Window | Decay Rate | Tension Level |
|-------------|-------------|------------|---------------|
| 1-5x | 2.5 seconds | Linear | Relaxed |
| 6-15x | 2.0 seconds | Faster | Building |
| 16-30x | 1.5 seconds | Accelerated | Tense |
| 31x+ | 1.0 seconds | High-stakes | Intense |

## Timer Extension Bonuses

| Action Quality | Bonus Time |
|----------------|------------|
| Normal action | +0ms (reset only) |
| Perfect/Critical | +500ms |
| Near-miss (close) | Reset to 75% |

## Multiplier Tiers

| Combo Count | Multiplier | Tier Name | Primary Color | Unlock Feel |
|-------------|------------|-----------|---------------|-------------|
| 1-4 | x1 | - | White | Baseline |
| 5-9 | x2 | Nice! | Yellow (#FFD700) | Encouraging |
| 10-14 | x3 | Great! | Orange (#FFA500) | Satisfying |
| 15-24 | x4 | Awesome! | Red (#FF4444) | Exciting |
| 25-49 | x5 | Amazing! | Purple (#AA44FF) | Impressive |
| 50-99 | x8 | Incredible! | Blue (#4488FF) | Epic |
| 100+ | x10 | LEGENDARY! | Gold + Rainbow | Legendary |

## Anti-Spam Protection

| Repetition | Point Modifier | Visual Indicator |
|------------|----------------|------------------|
| 1st-2nd use | 100% | Normal |
| 3rd use | 75% | Slight dim |
| 4th use | 50% | Noticeable dim |
| 5th+ use | 25% | Grayed out |

## Visual Escalation - Combo Counter Display

| Tier | Font Scale | Glow Effect | Animation |
|------|------------|-------------|-----------|
| x1 | 100% | None | Subtle pulse |
| x2 | 110% | Slight yellow | Bounce |
| x3 | 120% | Yellow glow | Strong bounce + shake |
| x4 | 135% | Orange glow + outline | Pop + 5 particles |
| x5 | 150% | Red pulsing glow | Pop + 10 particles + ring |
| x8 | 175% | Purple flames | Pop + 20 particles + flash |
| x10 | 200% | Gold + rainbow cycle | Everything + chromatic |

## Timer Bar States

| Remaining | Visual State |
|-----------|--------------|
| 100-75% | Solid, tier color |
| 75-50% | Normal |
| 50-25% | Pulsing warning |
| 25-10% | Rapid pulse, shifts red |
| <10% | Frantic flash + vignette |

## Milestone Celebrations

| Milestone | Celebration Sequence |
|-----------|---------------------|
| x5 | Screen flash (yellow, 80ms) + "Nice!" text + ring burst |
| x10 | Screen flash (orange, 100ms) + "Great!" slam + particles (15) |
| x25 | Screen flash (red, 100ms) + "AWESOME!" slam + particles (25) + shake |
| x50 | Screen flash (purple, 120ms) + "INCREDIBLE!" + explosion + zoom punch |
| x100 | Full screen gold flash + "LEGENDARY!" + fireworks + camera shake + slow-mo |

## Audio Escalation - Per-Action Sound Scaling

| Combo | Pitch Modifier | Sound Layers |
|-------|----------------|--------------|
| 1-4 | 1.00x | Base only |
| 5-9 | 1.05x | Base + chime |
| 10-14 | 1.10x | Base + chime + harmonics |
| 15-24 | 1.15x | All + ambient swell |
| 25-49 | 1.20x | All + tension build |
| 50-99 | 1.25x | All + drums kick in |
| 100+ | 1.30x | Full orchestra |

## Haptic Escalation - Per-Action Haptics

| Combo | Impact Type | Intensity | Pattern |
|-------|-------------|-----------|---------|
| 1-4 | Light | 0.3 | Single tap |
| 5-9 | Light | 0.5 | Single tap |
| 10-14 | Medium | 0.6 | Single tap |
| 15-24 | Medium | 0.7 | Double tap |
| 25-49 | Heavy | 0.8 | Double tap |
| 50-99 | Heavy | 0.9 | Triple pulse |
| 100+ | Rigid | 1.0 | Triple + buzz |

## Milestone Haptic Patterns

| Milestone | Pattern | Duration |
|-----------|---------|----------|
| x5 | Success notification | 100ms |
| x10 | Success + light | 150ms |
| x25 | Double success | 200ms |
| x50 | Triple crescendo | 300ms |
| x100 | Full celebration | 500ms |

## Near-Miss Recovery (Combo Saver)

| Condition | Recovery Window | Restored Combo |
|-----------|-----------------|----------------|
| Break at x10-24 | 2.0 seconds | 50% (min x5) |
| Break at x25-49 | 2.0 seconds | 50% (min x12) |
| Break at x50+ | 2.5 seconds | 50% (min x25) |

## Streak Milestone Bonuses

| Milestone | Score Bonus | Rarity |
|-----------|-------------|--------|
| x5 | +500 | Common |
| x10 | +2,000 | Regular |
| x25 | +5,000 | Uncommon |
| x50 | +10,000 | Rare |
| x100 | +25,000 | Very Rare |
