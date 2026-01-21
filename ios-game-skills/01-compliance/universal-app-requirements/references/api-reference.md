# Universal App Reference Tables

## Size Class Reference

| Device Configuration | Width Class | Height Class |
|---------------------|-------------|--------------|
| iPhone Portrait | Compact | Regular |
| iPhone Landscape | Compact | Compact |
| iPhone Plus/Max Landscape | Regular | Compact |
| iPad Portrait (Full Screen) | Regular | Regular |
| iPad Landscape (Full Screen) | Regular | Regular |
| iPad Split View (1/3) | Compact | Regular |
| iPad Split View (1/2) | Compact | Regular |
| iPad Split View (2/3) | Regular | Regular |
| iPad Slide Over | Compact | Regular |

## Screen Dimensions (Points)

| Device | Portrait (W x H) | Landscape (W x H) | Scale |
|--------|-----------------|-------------------|-------|
| iPhone SE (3rd) | 375 x 667 | 667 x 375 | @2x |
| iPhone 14 | 390 x 844 | 844 x 390 | @3x |
| iPhone 14 Plus | 428 x 926 | 926 x 428 | @3x |
| iPhone 14 Pro | 393 x 852 | 852 x 393 | @3x |
| iPhone 14 Pro Max | 430 x 932 | 932 x 430 | @3x |
| iPhone 15 Pro Max | 430 x 932 | 932 x 430 | @3x |
| iPad (10th gen) | 820 x 1180 | 1180 x 820 | @2x |
| iPad Air (5th) | 820 x 1180 | 1180 x 820 | @2x |
| iPad Pro 11" | 834 x 1194 | 1194 x 834 | @2x |
| iPad Pro 12.9" | 1024 x 1366 | 1366 x 1024 | @2x |

## Safe Area Insets (Typical Values)

| Device/Feature | Top | Bottom | Left | Right |
|---------------|-----|--------|------|-------|
| iPhone (no notch) | 20 | 0 | 0 | 0 |
| iPhone (notch/Dynamic Island) Portrait | 59 | 34 | 0 | 0 |
| iPhone (notch/Dynamic Island) Landscape | 0 | 21 | 59 | 59 |
| iPad (no Home button) | 24 | 20 | 0 | 0 |
| iPad (Home button) | 20 | 0 | 0 | 0 |

## Asset Scale Factors

| Scale | Device Type | Pixel Multiplier |
|-------|-------------|------------------|
| @1x | Legacy (not current) | 1x |
| @2x | All iPads, iPhone SE | 2x |
| @3x | All modern iPhones | 3x |

## Touch Target Sizes

| Type | Size (points) | Notes |
|------|---------------|-------|
| Apple HIG Minimum | 44 x 44 | Required minimum |
| Recommended for Games | 48-60 | Frequently used controls |
| Maximum Reasonable | 80 | Larger wastes screen space |

## App Icon Sizes

| Size | Pixels | Device |
|------|--------|--------|
| icon-20@2x | 40x40 | iPhone Notification |
| icon-20@3x | 60x60 | iPhone Notification |
| icon-29@2x | 58x58 | iPhone Settings |
| icon-29@3x | 87x87 | iPhone Settings |
| icon-40@2x | 80x80 | iPhone Spotlight |
| icon-40@3x | 120x120 | iPhone Spotlight |
| icon-60@2x | 120x120 | iPhone App |
| icon-60@3x | 180x180 | iPhone App |
| icon-76@2x | 152x152 | iPad App |
| icon-83.5@2x | 167x167 | iPad Pro App |
| icon-1024 | 1024x1024 | App Store |

## Info.plist Orientation Keys

### iPhone
```xml
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### iPad (should support all)
```xml
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
    <string>UIInterfaceOrientationLandscapeLeft</string>
    <string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

### Disable Multitasking (only if necessary)
```xml
<key>UIRequiresFullScreen</key>
<true/>
```

## Launch Screen (Info.plist)

```xml
<key>UILaunchScreen</key>
<dict>
    <key>UIColorName</key>
    <string>LaunchBackgroundColor</string>
    <key>UIImageName</key>
    <string>LaunchLogo</string>
    <key>UIImageRespectsSafeAreaInsets</key>
    <true/>
</dict>
```

## Decision Trees

### Layout Strategy
- **Fixed aspect ratio** (puzzles): Center content, letterbox edges, scale uniformly
- **Flexible content** (RPGs): Use size classes, show more on larger screens
- **Full-screen immersive** (action): Extend to edges, keep controls in safe areas

### Orientation Support
- **Portrait-only** (match-3): Support portrait + upside-down on iPad
- **Landscape-only** (racing): Support both landscape orientations
- **Both** (most games): Implement adaptive layouts, test all combinations

### Split View Support
- **Can work in compact**: Implement compact layout, support fully
- **Partially works**: Pause and show "expand to play" message
- **Cannot work**: Set UIRequiresFullScreen, document why
