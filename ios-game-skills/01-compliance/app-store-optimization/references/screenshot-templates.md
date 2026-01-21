# Screenshot Templates Reference

## Screenshot Strategy

### The First Three Rule

Most users see only first 3 screenshots. Structure:

1. **Screenshot 1**: Hero shot - best gameplay moment + main value prop
2. **Screenshot 2**: Core mechanic in action + key feature
3. **Screenshot 3**: Progression/reward system + social proof

### Screenshot 4-10 (if they scroll)

4. Secondary features
5. Customization/variety
6. Social features
7. Achievements/leaderboards
8. Settings/accessibility
9. Update preview (for updates)
10. Call to action

## Required Dimensions

| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone 6.9" | 1320 x 2868 | 2868 x 1320 |
| iPhone 6.7" | 1290 x 2796 | 2796 x 1290 |
| iPhone 6.5" | 1284 x 2778 | 2778 x 1284 |
| iPhone 5.5" | 1242 x 2208 | 2208 x 1242 |
| iPad Pro 12.9" | 2048 x 2732 | 2732 x 2048 |

## Text Overlay Guidelines

### DO
- Benefits over features ("Relax your mind" vs "100 levels")
- Action verbs ("Solve", "Discover", "Build")
- Short (3-5 words max)
- High contrast, readable at thumbnail size
- Consistent font across all screenshots

### DON'T
- Prices (vary by region)
- "Free" (unless truly free, no IAP)
- Competitor mentions
- Tiny text
- More than 2 lines

## Visual Consistency

Maintain across all screenshots:
- Color palette (from game)
- Typography (1-2 fonts max)
- Device frame style (or none)
- Text position (top/bottom)
- Background treatment

## A/B Testing with Product Page Optimization

Test variations of:
- Screenshot order
- Text overlay copy
- With/without device frames
- Different hero shots

Minimum traffic: 1000 impressions per variant
Test duration: 7-14 days minimum
Statistical significance: 90%+ before deciding

## Capture Process

```bash
# iOS Simulator capture (highest quality)
xcrun simctl io booted screenshot screenshot.png

# Or use Xcode: Debug > View Debugging > Take Screenshot
```

Post-process:
1. Crop to exact dimensions
2. Add text overlays
3. Optional: device frame
4. Export as PNG (no compression artifacts)
