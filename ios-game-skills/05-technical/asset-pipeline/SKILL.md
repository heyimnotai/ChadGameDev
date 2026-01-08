---
name: asset-pipeline
description: Manages optimal asset preparation and delivery for iOS games including image compression, audio formats, asset catalogs, and on-demand resources. Use this skill when preparing textures, audio files, setting up asset catalogs, implementing on-demand resources, or optimizing app size. Triggers on any asset-related task, file format decision, compression setting, or app thinning requirement.
---

# Asset Pipeline

## Purpose

This skill enables Claude to prepare and manage game assets optimally for iOS delivery. It covers image compression formats (ASTC, PVRTC), audio processing (CAF, IMA4, AAC), asset catalog configuration, on-demand resources, and app thinning. The quality bar ensures minimal download sizes while maintaining visual and audio quality appropriate for each device class.

## Domain Boundaries

- **This skill handles**:
  - Image resolution targets per device class
  - Texture compression formats (ASTC 4x4 to 12x12, PVRTC)
  - Asset catalog setup and organization
  - Audio format selection (CAF, IMA4, AAC)
  - Audio compression settings and commands
  - Streaming vs preloaded audio decisions
  - afconvert command usage
  - On-demand resources setup (8GB limit per pack)
  - App thinning optimization
  - Asset naming conventions
  - Build settings for asset delivery

- **This skill does NOT handle**:
  - SpriteKit texture atlas usage in code (see: spritekit-patterns)
  - Runtime texture memory management (see: performance-optimizer)
  - Sound playback implementation (see: 04-polish/audio-designer)
  - Analytics for asset loading (see: analytics-integration)

## Core Specifications

### Image Resolution Targets

| Device Class | Screen Scale | Max Texture Size | Recommended Atlas Size |
|--------------|--------------|------------------|------------------------|
| iPhone SE/8 | @2x | 4096x4096 | 2048x2048 |
| iPhone 12-15 | @3x | 4096x4096 | 2048x2048 |
| iPad (non-Pro) | @2x | 4096x4096 | 2048x2048 |
| iPad Pro | @2x | 8192x8192 | 4096x4096 |

### Texture Compression Formats

| Format | Quality | Bits/Pixel | Use Case | Device Support |
|--------|---------|------------|----------|----------------|
| ASTC 4x4 | Highest | 8 bpp | UI, character sprites | A8+ (2014+) |
| ASTC 5x5 | Very High | 5.12 bpp | Detailed backgrounds | A8+ |
| ASTC 6x6 | High | 3.56 bpp | Large textures | A8+ |
| ASTC 8x8 | Medium | 2 bpp | Distant backgrounds | A8+ |
| ASTC 10x10 | Low | 1.28 bpp | Skyboxes, large fills | A8+ |
| ASTC 12x12 | Lowest | 0.89 bpp | Massive textures | A8+ |
| PVRTC 4bpp | Medium | 4 bpp | Legacy support | A7+ |
| PVRTC 2bpp | Low | 2 bpp | Legacy, size critical | A7+ |

### Audio Format Specifications

| Format | Extension | Compression | Latency | Simultaneous | Use Case |
|--------|-----------|-------------|---------|--------------|----------|
| Linear PCM | .caf | None | Lowest | Many | Critical SFX |
| IMA4 | .caf | 4:1 | Low | Many | Standard SFX |
| AAC | .m4a/.caf | ~10:1 | Higher | 1 (HW decode) | Music |
| MP3 | .mp3 | ~10:1 | Higher | 1 (HW decode) | Music (legacy) |
| ALAC | .m4a | ~2:1 | Medium | 1 | Music (lossless) |

### Audio Specifications

| Parameter | Specification |
|-----------|---------------|
| Sample rate | 44.1kHz or 48kHz |
| Bit depth | 16-bit (standard), 24-bit (music) |
| SFX duration | < 10 seconds preferred |
| Music loop points | Sample-accurate |
| Simultaneous SFX | 32 practical limit |
| Latency target | < 20ms for feedback |

### On-Demand Resources Limits

| Limit | Value |
|-------|-------|
| Per asset pack | 8GB maximum |
| Initial install tags | Downloaded at install |
| Prefetch tags | Downloaded when space available |
| On-demand tags | Downloaded when requested |
| Cache expiration | System managed |

## Implementation Patterns

### Asset Catalog Structure

```
Assets.xcassets/
├── AppIcon.appiconset/
│   └── Contents.json
├── Colors/
│   ├── PrimaryColor.colorset/
│   ├── SecondaryColor.colorset/
│   └── Contents.json
├── UI/
│   ├── Buttons.spriteatlas/
│   │   ├── button_play.imageset/
│   │   ├── button_pause.imageset/
│   │   └── Contents.json
│   ├── Icons.spriteatlas/
│   └── Contents.json
├── Characters/
│   ├── Player.spriteatlas/
│   │   ├── player_idle_1.imageset/
│   │   ├── player_idle_2.imageset/
│   │   ├── player_walk_1.imageset/
│   │   └── Contents.json
│   ├── Enemies.spriteatlas/
│   └── Contents.json
├── Environment/
│   ├── Level1.spriteatlas/
│   ├── Level2.spriteatlas/
│   └── Contents.json
├── Effects/
│   ├── Particles.spriteatlas/
│   ├── Explosions.spriteatlas/
│   └── Contents.json
└── Contents.json
```

### Asset Catalog Contents.json Templates

**Sprite Atlas Contents.json**:
```json
{
  "info": {
    "author": "xcode",
    "version": 1
  },
  "properties": {
    "compression-type": "gpu-optimized-best",
    "optimization-mode": "performance"
  }
}
```

**Image Set Contents.json (Universal)**:
```json
{
  "images": [
    {
      "filename": "sprite@1x.png",
      "idiom": "universal",
      "scale": "1x"
    },
    {
      "filename": "sprite@2x.png",
      "idiom": "universal",
      "scale": "2x"
    },
    {
      "filename": "sprite@3x.png",
      "idiom": "universal",
      "scale": "3x"
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  },
  "properties": {
    "compression-type": "gpu-optimized-best",
    "preserves-vector-representation": false,
    "template-rendering-intent": "original"
  }
}
```

**Image Set Contents.json (Device-Specific)**:
```json
{
  "images": [
    {
      "filename": "background_iphone@2x.png",
      "idiom": "iphone",
      "scale": "2x"
    },
    {
      "filename": "background_iphone@3x.png",
      "idiom": "iphone",
      "scale": "3x"
    },
    {
      "filename": "background_ipad@1x.png",
      "idiom": "ipad",
      "scale": "1x"
    },
    {
      "filename": "background_ipad@2x.png",
      "idiom": "ipad",
      "scale": "2x"
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  }
}
```

### Texture Compression Configuration

**Build Settings for ASTC**:
```
ASSETCATALOG_COMPILER_OPTIMIZATION = space

// For specific atlas compression in Contents.json:
{
  "properties": {
    "compression-type": "gpu-optimized-best"
  }
}
```

**Compression Type Options**:
```
automatic          - Let Xcode decide
lossless           - No compression (largest)
basic              - Basic compression
gpu-optimized-best - ASTC with best quality settings
gpu-optimized-smallest - ASTC with smallest size settings
```

### Image Processing Script

```bash
#!/bin/bash
# prepare_textures.sh - Prepare game textures for iOS

set -e

INPUT_DIR="source_assets"
OUTPUT_DIR="Assets.xcassets"

# Function to create image set
create_imageset() {
    local name=$1
    local src=$2
    local dest_dir="${OUTPUT_DIR}/${name}.imageset"

    mkdir -p "$dest_dir"

    # Generate @1x, @2x, @3x versions
    # Assuming source is @3x resolution

    # @3x - original
    cp "$src" "${dest_dir}/${name}@3x.png"

    # @2x - 66.67% of @3x
    sips --resampleWidth $(echo "$(sips -g pixelWidth "$src" | tail -1 | awk '{print $2}') * 2 / 3" | bc) \
         "$src" --out "${dest_dir}/${name}@2x.png"

    # @1x - 33.33% of @3x
    sips --resampleWidth $(echo "$(sips -g pixelWidth "$src" | tail -1 | awk '{print $2}') / 3" | bc) \
         "$src" --out "${dest_dir}/${name}@1x.png"

    # Create Contents.json
    cat > "${dest_dir}/Contents.json" << 'EOF'
{
  "images": [
    { "filename": "NAME@1x.png", "idiom": "universal", "scale": "1x" },
    { "filename": "NAME@2x.png", "idiom": "universal", "scale": "2x" },
    { "filename": "NAME@3x.png", "idiom": "universal", "scale": "3x" }
  ],
  "info": { "author": "xcode", "version": 1 },
  "properties": { "compression-type": "gpu-optimized-best" }
}
EOF
    sed -i '' "s/NAME/${name}/g" "${dest_dir}/Contents.json"

    echo "Created imageset: $name"
}

# Process all PNGs in source directory
for file in "$INPUT_DIR"/*.png; do
    filename=$(basename "$file" .png)
    create_imageset "$filename" "$file"
done

echo "Texture preparation complete!"
```

### Audio Conversion Commands

**Convert to Uncompressed CAF (lowest latency)**:
```bash
# 16-bit 44.1kHz Linear PCM
afconvert -f caff -d LEI16@44100 -c 1 input.wav output.caf

# 16-bit 48kHz Linear PCM (modern standard)
afconvert -f caff -d LEI16@48000 -c 1 input.wav output.caf

# Stereo version
afconvert -f caff -d LEI16@44100 -c 2 input.wav output_stereo.caf
```

**Convert to IMA4 (4:1 compression, good for SFX)**:
```bash
# Mono IMA4
afconvert -f AIFC -d ima4 -c 1 input.wav output.caf

# Stereo IMA4
afconvert -f AIFC -d ima4 -c 2 input.wav output.caf
```

**Convert to AAC (for music)**:
```bash
# High quality AAC (256kbps)
afconvert -f m4af -d aac -b 256000 input.wav output.m4a

# Standard quality AAC (128kbps)
afconvert -f m4af -d aac -b 128000 input.wav output.m4a

# AAC in CAF container
afconvert -f caff -d aac -b 256000 input.wav output.caf
```

### Audio Processing Script

```bash
#!/bin/bash
# prepare_audio.sh - Prepare game audio for iOS

set -e

SFX_INPUT="source_audio/sfx"
MUSIC_INPUT="source_audio/music"
OUTPUT_DIR="Sounds"

mkdir -p "$OUTPUT_DIR/sfx"
mkdir -p "$OUTPUT_DIR/music"

echo "Processing sound effects..."
for file in "$SFX_INPUT"/*.wav; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .wav)

        # Get file duration
        duration=$(afinfo "$file" | grep "duration" | awk '{print $3}')

        # Critical SFX (< 0.5s) - use uncompressed
        if (( $(echo "$duration < 0.5" | bc -l) )); then
            echo "  $filename: Critical SFX -> Linear PCM"
            afconvert -f caff -d LEI16@44100 -c 1 "$file" "$OUTPUT_DIR/sfx/${filename}.caf"
        else
            # Standard SFX - use IMA4
            echo "  $filename: Standard SFX -> IMA4"
            afconvert -f AIFC -d ima4 -c 1 "$file" "$OUTPUT_DIR/sfx/${filename}.caf"
        fi
    fi
done

echo "Processing music..."
for file in "$MUSIC_INPUT"/*.wav; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .wav)
        echo "  $filename: Music -> AAC 256kbps"
        afconvert -f m4af -d aac -b 256000 -c 2 "$file" "$OUTPUT_DIR/music/${filename}.m4a"
    fi
done

echo "Audio preparation complete!"

# Print size summary
echo ""
echo "Size Summary:"
echo "SFX: $(du -sh "$OUTPUT_DIR/sfx" | awk '{print $1}')"
echo "Music: $(du -sh "$OUTPUT_DIR/music" | awk '{print $1}')"
```

### On-Demand Resources Setup

**Xcode Project Configuration**:

1. Enable On-Demand Resources in Project Settings:
```
Build Settings > Enable On Demand Resources > Yes
```

2. Tag resources in Asset Catalog:
```json
// In Contents.json for an asset
{
  "info": { "author": "xcode", "version": 1 },
  "properties": {
    "on-demand-resource-tags": ["level_5_assets"]
  }
}
```

**Resource Request Implementation**:
```swift
import Foundation

final class OnDemandResourceManager {
    static let shared = OnDemandResourceManager()

    private var activeRequests: [String: NSBundleResourceRequest] = [:]
    private var loadedTags: Set<String> = []

    private init() {}

    // MARK: - Resource Loading

    func loadResources(
        tags: Set<String>,
        priority: Double = NSBundleResourceRequestLoadingPriorityUrgent,
        progress: ((Double) -> Void)? = nil,
        completion: @escaping (Result<Void, Error>) -> Void
    ) {
        // Filter out already loaded tags
        let tagsToLoad = tags.subtracting(loadedTags)

        guard !tagsToLoad.isEmpty else {
            completion(.success(()))
            return
        }

        let request = NSBundleResourceRequest(tags: tagsToLoad)
        request.loadingPriority = priority

        // Store request to prevent deallocation
        let requestKey = tagsToLoad.sorted().joined(separator: ",")
        activeRequests[requestKey] = request

        // Start progress observation
        var observation: NSKeyValueObservation?
        if let progressHandler = progress {
            observation = request.progress.observe(\.fractionCompleted) { prog, _ in
                DispatchQueue.main.async {
                    progressHandler(prog.fractionCompleted)
                }
            }
        }

        // Begin access
        request.beginAccessingResources { [weak self] error in
            observation?.invalidate()

            DispatchQueue.main.async {
                if let error = error {
                    self?.activeRequests.removeValue(forKey: requestKey)
                    completion(.failure(error))
                } else {
                    self?.loadedTags.formUnion(tagsToLoad)
                    completion(.success(()))
                }
            }
        }
    }

    // MARK: - Conditional Loading

    func conditionallyLoadResources(
        tags: Set<String>,
        completion: @escaping (Bool) -> Void
    ) {
        let request = NSBundleResourceRequest(tags: tags)

        request.conditionallyBeginAccessingResources { available in
            DispatchQueue.main.async {
                if available {
                    self.loadedTags.formUnion(tags)
                }
                completion(available)
            }
        }
    }

    // MARK: - Resource Release

    func releaseResources(tags: Set<String>) {
        let requestKey = tags.sorted().joined(separator: ",")

        if let request = activeRequests[requestKey] {
            request.endAccessingResources()
            activeRequests.removeValue(forKey: requestKey)
            loadedTags.subtract(tags)
        }
    }

    func releaseAllResources() {
        for (_, request) in activeRequests {
            request.endAccessingResources()
        }
        activeRequests.removeAll()
        loadedTags.removeAll()
    }

    // MARK: - Prefetching

    func prefetchResources(tags: Set<String>) {
        let tagsToFetch = tags.subtracting(loadedTags)
        guard !tagsToFetch.isEmpty else { return }

        let request = NSBundleResourceRequest(tags: tagsToFetch)
        request.loadingPriority = NSBundleResourceRequestLoadingPriorityLowPriority

        let requestKey = "prefetch_" + tagsToFetch.sorted().joined(separator: ",")
        activeRequests[requestKey] = request

        request.beginAccessingResources { [weak self] error in
            if error == nil {
                self?.loadedTags.formUnion(tagsToFetch)
            }
        }
    }

    // MARK: - Status

    func isLoaded(tag: String) -> Bool {
        loadedTags.contains(tag)
    }

    func areLoaded(tags: Set<String>) -> Bool {
        tags.isSubset(of: loadedTags)
    }
}
```

**Level-Based Resource Loading**:
```swift
final class LevelResourceLoader {
    private let resourceManager = OnDemandResourceManager.shared

    // Resource tags per level
    private let levelTags: [Int: Set<String>] = [
        1: ["level_1_assets", "common_assets"],
        2: ["level_2_assets", "common_assets"],
        3: ["level_3_assets", "common_assets", "boss_assets"],
        // ...
    ]

    func loadLevel(
        _ level: Int,
        progress: @escaping (Double) -> Void,
        completion: @escaping (Result<Void, Error>) -> Void
    ) {
        guard let tags = levelTags[level] else {
            completion(.failure(ResourceError.invalidLevel))
            return
        }

        resourceManager.loadResources(
            tags: tags,
            progress: progress,
            completion: completion
        )
    }

    func prefetchNextLevel(_ currentLevel: Int) {
        let nextLevel = currentLevel + 1
        guard let tags = levelTags[nextLevel] else { return }
        resourceManager.prefetchResources(tags: tags)
    }

    func unloadLevel(_ level: Int) {
        guard let tags = levelTags[level] else { return }
        // Only unload level-specific assets, not common
        let specificTags = tags.filter { !$0.contains("common") }
        resourceManager.releaseResources(tags: specificTags)
    }

    enum ResourceError: Error {
        case invalidLevel
    }
}
```

### App Thinning Configuration

**Asset Catalog Slicing**:
```json
// Contents.json with device-specific assets
{
  "images": [
    {
      "filename": "background_iphone.png",
      "idiom": "iphone",
      "scale": "2x",
      "memory": "2GB",
      "graphics-feature-set": "metal2v2"
    },
    {
      "filename": "background_iphone_low.png",
      "idiom": "iphone",
      "scale": "2x",
      "memory": "1GB"
    },
    {
      "filename": "background_ipad.png",
      "idiom": "ipad",
      "scale": "2x"
    }
  ],
  "info": { "author": "xcode", "version": 1 }
}
```

**Build Settings for App Thinning**:
```
ASSETCATALOG_COMPILER_OPTIMIZATION = time
ENABLE_BITCODE = NO  // Deprecated as of Xcode 14
STRIP_INSTALLED_PRODUCT = YES
DEAD_CODE_STRIPPING = YES
```

### Asset Naming Conventions

```
# Sprites
player_idle_1.png
player_idle_2.png
player_walk_1.png
player_walk_2.png
player_jump.png
player_fall.png

enemy_goblin_idle_1.png
enemy_goblin_walk_1.png

# UI Elements
button_play_normal.png
button_play_pressed.png
button_play_disabled.png

icon_coin.png
icon_heart.png
icon_star.png

# Backgrounds
background_menu.png
background_level_1.png
background_level_1_parallax_far.png
background_level_1_parallax_mid.png
background_level_1_parallax_near.png

# Tiles
tile_grass_top.png
tile_grass_middle.png
tile_dirt.png
tile_platform_left.png
tile_platform_middle.png
tile_platform_right.png

# Effects
particle_spark_1.png
particle_explosion_1.png
effect_glow.png

# Audio
sfx_button_tap.caf
sfx_coin_collect.caf
sfx_player_jump.caf
sfx_enemy_hit.caf
sfx_explosion.caf

music_menu.m4a
music_level_1.m4a
music_boss.m4a
```

### Asset Validation Script

```bash
#!/bin/bash
# validate_assets.sh - Validate game assets before build

set -e

ASSETS_DIR="Assets.xcassets"
AUDIO_DIR="Sounds"
ERRORS=0

echo "=== Asset Validation ==="
echo ""

# Check for missing @2x and @3x variants
echo "Checking image scales..."
find "$ASSETS_DIR" -name "*.imageset" -type d | while read imageset; do
    name=$(basename "$imageset" .imageset)
    has_2x=$(ls "$imageset" | grep -c "@2x" || true)
    has_3x=$(ls "$imageset" | grep -c "@3x" || true)

    if [ "$has_2x" -eq 0 ]; then
        echo "  WARNING: $name missing @2x variant"
    fi
    if [ "$has_3x" -eq 0 ]; then
        echo "  WARNING: $name missing @3x variant"
    fi
done

# Check texture sizes
echo ""
echo "Checking texture dimensions..."
find "$ASSETS_DIR" -name "*.png" -type f | while read png; do
    width=$(sips -g pixelWidth "$png" | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$png" | tail -1 | awk '{print $2}')

    # Check power of 2 for atlas efficiency
    if ! [[ $width =~ ^(64|128|256|512|1024|2048|4096)$ ]] || \
       ! [[ $height =~ ^(64|128|256|512|1024|2048|4096)$ ]]; then
        # Only warn for sprite atlases
        if [[ "$png" == *"spriteatlas"* ]]; then
            echo "  NOTE: $png ($width x $height) - consider power-of-2 dimensions"
        fi
    fi

    # Check max size
    if [ "$width" -gt 4096 ] || [ "$height" -gt 4096 ]; then
        echo "  ERROR: $png exceeds 4096px ($width x $height)"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check audio formats
echo ""
echo "Checking audio formats..."
find "$AUDIO_DIR" -type f \( -name "*.caf" -o -name "*.m4a" -o -name "*.wav" \) | while read audio; do
    ext="${audio##*.}"
    filename=$(basename "$audio")

    case "$ext" in
        wav)
            echo "  WARNING: Unprocessed WAV file: $filename"
            ;;
        caf)
            # Verify it's properly encoded
            format=$(afinfo "$audio" 2>/dev/null | grep "Data format" | head -1 || echo "unknown")
            echo "  OK: $filename - $format"
            ;;
        m4a)
            echo "  OK: $filename (AAC)"
            ;;
    esac
done

# Check for large assets
echo ""
echo "Checking for oversized files..."
find "$ASSETS_DIR" "$AUDIO_DIR" -type f -size +5M | while read large; do
    size=$(du -h "$large" | awk '{print $1}')
    echo "  LARGE: $large ($size)"
done

echo ""
echo "=== Validation Complete ==="
if [ $ERRORS -gt 0 ]; then
    echo "Found $ERRORS error(s)"
    exit 1
else
    echo "No critical errors found"
fi
```

### Asset Loading Manager

```swift
import Foundation
import SpriteKit

final class AssetLoader {
    static let shared = AssetLoader()

    private var loadedAtlases: [String: SKTextureAtlas] = [:]
    private var loadQueue = DispatchQueue(label: "com.game.assetloader", qos: .userInitiated)

    private init() {}

    // MARK: - Texture Atlas Loading

    func preloadAtlases(
        named names: [String],
        completion: @escaping () -> Void
    ) {
        SKTextureAtlas.preloadTextureAtlasesNamed(names) { error, atlases in
            if let error = error {
                print("Atlas preload error: \(error)")
            }

            for (index, name) in names.enumerated() where index < atlases.count {
                self.loadedAtlases[name] = atlases[index]
            }

            DispatchQueue.main.async {
                completion()
            }
        }
    }

    func atlas(named name: String) -> SKTextureAtlas? {
        if let cached = loadedAtlases[name] {
            return cached
        }

        let atlas = SKTextureAtlas(named: name)
        loadedAtlases[name] = atlas
        return atlas
    }

    func texture(named name: String, fromAtlas atlasName: String) -> SKTexture {
        guard let atlas = atlas(named: atlasName) else {
            return SKTexture(imageNamed: name)
        }
        return atlas.textureNamed(name)
    }

    func unloadAtlas(named name: String) {
        loadedAtlases.removeValue(forKey: name)
    }

    func unloadAllAtlases() {
        loadedAtlases.removeAll()
    }

    // MARK: - Animation Textures

    func animationTextures(
        baseName: String,
        count: Int,
        fromAtlas atlasName: String
    ) -> [SKTexture] {
        guard let atlas = atlas(named: atlasName) else { return [] }

        return (1...count).map { index in
            atlas.textureNamed("\(baseName)_\(index)")
        }
    }

    // MARK: - Memory Info

    func getLoadedAtlasInfo() -> String {
        let atlasNames = loadedAtlases.keys.sorted()
        var info = "Loaded Atlases:\n"

        for name in atlasNames {
            if let atlas = loadedAtlases[name] {
                let textureCount = atlas.textureNames.count
                info += "  - \(name): \(textureCount) textures\n"
            }
        }

        return info
    }
}
```

## Decision Trees

### Texture Compression Format Selection

```
What is the asset type?
├─ UI elements (buttons, icons)
│   └─ ASTC 4x4 (highest quality)
├─ Character sprites
│   └─ ASTC 4x4 or 5x5
├─ Tiled backgrounds
│   └─ ASTC 6x6
├─ Large backgrounds (parallax)
│   └─ ASTC 8x8
├─ Skyboxes / very large fills
│   └─ ASTC 10x10 or 12x12
└─ Must support A7 devices?
    └─ Use PVRTC 4bpp fallback
```

### Audio Format Selection

```
What is the audio type?
├─ Music (background loop)
│   └─ AAC 256kbps (.m4a)
│       └─ Streaming: YES if > 30 seconds
├─ Sound effect
│   ├─ Critical timing (< 0.5s)?
│   │   └─ Linear PCM (.caf)
│   ├─ Standard SFX (0.5-10s)?
│   │   └─ IMA4 (.caf)
│   └─ Long ambient sound?
│       └─ AAC or IMA4
└─ Voice / dialogue
    └─ AAC 128kbps or IMA4
```

### On-Demand Resources Decision

```
Is the asset needed at launch?
├─ YES → Initial install tag
└─ NO → Is it needed in first 30 minutes?
    ├─ YES → Prefetch tag
    └─ NO → On-demand tag
        └─ Is asset > 100MB?
            ├─ YES → Split into multiple tags
            └─ NO → Single on-demand tag
```

## Quality Checklist

### Image Assets
- [ ] All sprites have @2x and @3x variants
- [ ] Sprite atlases organized by usage (not globally)
- [ ] Maximum texture size 4096x4096
- [ ] Compression type set in Contents.json
- [ ] No unprocessed source files in bundle

### Audio Assets
- [ ] SFX converted to CAF (Linear PCM or IMA4)
- [ ] Music converted to AAC (.m4a)
- [ ] Sample rate 44.1kHz or 48kHz
- [ ] Mono for SFX, stereo for music
- [ ] No uncompressed WAV files in bundle

### Asset Catalog
- [ ] Proper folder structure maintained
- [ ] Contents.json files valid
- [ ] On-demand resource tags assigned
- [ ] Device-specific variants provided where needed

### App Thinning
- [ ] Asset slicing configured for device types
- [ ] On-demand resources enabled
- [ ] Dead code stripping enabled
- [ ] App size verified in App Store Connect

### Naming
- [ ] Consistent naming convention used
- [ ] Animation frames numbered sequentially
- [ ] State variants clearly named (normal, pressed, disabled)
- [ ] No spaces or special characters in filenames

## Anti-Patterns

### DO NOT: Use uncompressed textures

```
# WRONG - 4MB per texture
sprite.png (uncompressed PNG)

# CORRECT - ~500KB with ASTC 4x4
sprite.imageset/
  Contents.json (compression-type: gpu-optimized-best)
```

### DO NOT: Ship WAV files

```bash
# WRONG - Huge file size, no optimization
Sounds/
  music.wav        # 50MB uncompressed
  explosion.wav    # 2MB uncompressed

# CORRECT - Optimized formats
Sounds/
  music.m4a        # 5MB AAC
  explosion.caf    # 200KB IMA4
```

### DO NOT: Create one massive atlas

```
# WRONG - Everything in one atlas
GameAtlas.spriteatlas/
  player_idle_1.imageset/
  player_walk_1.imageset/
  enemy_1.imageset/
  tile_1.imageset/
  button_1.imageset/
  particle_1.imageset/
  ... (500 more sprites)

# CORRECT - Organized by usage
Characters.spriteatlas/
  player_idle_1.imageset/
  player_walk_1.imageset/
UI.spriteatlas/
  button_1.imageset/
Level1.spriteatlas/
  tile_1.imageset/
```

### DO NOT: Include all assets at install

```swift
// WRONG - 2GB initial download
// All levels bundled with app

// CORRECT - On-demand loading
// Level 1-5: Initial install (50MB)
// Level 6-20: On-demand (prefetch after level 3)
// Boss levels: On-demand (load when approaching)
```

### DO NOT: Skip validation before build

```bash
# WRONG - Ship broken assets
xcodebuild archive

# CORRECT - Validate first
./validate_assets.sh && xcodebuild archive
```

## afconvert Quick Reference

```bash
# List available formats
afconvert -hf

# List available data formats
afconvert -hd

# Common conversions

# WAV to Linear PCM CAF (mono, 44.1kHz, 16-bit)
afconvert -f caff -d LEI16@44100 -c 1 input.wav output.caf

# WAV to IMA4 CAF (4:1 compression)
afconvert -f AIFC -d ima4 input.wav output.caf

# WAV to AAC M4A (256kbps)
afconvert -f m4af -d aac -b 256000 input.wav output.m4a

# WAV to AAC CAF (for seamless looping)
afconvert -f caff -d aac -b 256000 input.wav output.caf

# Batch convert all WAV to IMA4
for f in *.wav; do
  afconvert -f AIFC -d ima4 "$f" "${f%.wav}.caf"
done
```

## Adjacent Skills

- **spritekit-patterns**: Using texture atlases and managing textures in code
- **performance-optimizer**: Runtime memory management for loaded assets
- **04-polish/audio-designer**: Audio playback implementation and design
- **analytics-integration**: Tracking asset loading performance
