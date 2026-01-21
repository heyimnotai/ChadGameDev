# Asset Pipeline Code Patterns

## Audio Conversion Commands (afconvert)

```bash
# Linear PCM CAF (lowest latency, critical SFX)
afconvert -f caff -d LEI16@44100 -c 1 input.wav output.caf

# IMA4 CAF (4:1 compression, standard SFX)
afconvert -f AIFC -d ima4 -c 1 input.wav output.caf

# AAC M4A (music, 256kbps)
afconvert -f m4af -d aac -b 256000 -c 2 input.wav output.m4a

# AAC CAF (seamless looping music)
afconvert -f caff -d aac -b 256000 input.wav output.caf

# Batch convert all WAV to IMA4
for f in *.wav; do afconvert -f AIFC -d ima4 "$f" "${f%.wav}.caf"; done
```

## Asset Catalog Contents.json Templates

### Sprite Atlas
```json
{
  "info": { "author": "xcode", "version": 1 },
  "properties": {
    "compression-type": "gpu-optimized-best",
    "optimization-mode": "performance"
  }
}
```

### Image Set (Universal)
```json
{
  "images": [
    { "filename": "sprite@1x.png", "idiom": "universal", "scale": "1x" },
    { "filename": "sprite@2x.png", "idiom": "universal", "scale": "2x" },
    { "filename": "sprite@3x.png", "idiom": "universal", "scale": "3x" }
  ],
  "info": { "author": "xcode", "version": 1 },
  "properties": { "compression-type": "gpu-optimized-best" }
}
```

### Device-Specific Image Set
```json
{
  "images": [
    { "filename": "bg_iphone@2x.png", "idiom": "iphone", "scale": "2x" },
    { "filename": "bg_iphone@3x.png", "idiom": "iphone", "scale": "3x" },
    { "filename": "bg_ipad@1x.png", "idiom": "ipad", "scale": "1x" },
    { "filename": "bg_ipad@2x.png", "idiom": "ipad", "scale": "2x" }
  ],
  "info": { "author": "xcode", "version": 1 }
}
```

## On-Demand Resources Manager

```swift
import Foundation

final class OnDemandResourceManager {
    static let shared = OnDemandResourceManager()

    private var activeRequests: [String: NSBundleResourceRequest] = [:]
    private var loadedTags: Set<String> = []

    func loadResources(
        tags: Set<String>,
        progress: ((Double) -> Void)? = nil,
        completion: @escaping (Result<Void, Error>) -> Void
    ) {
        let tagsToLoad = tags.subtracting(loadedTags)
        guard !tagsToLoad.isEmpty else { completion(.success(())); return }

        let request = NSBundleResourceRequest(tags: tagsToLoad)
        request.loadingPriority = NSBundleResourceRequestLoadingPriorityUrgent

        let key = tagsToLoad.sorted().joined(separator: ",")
        activeRequests[key] = request

        var observation: NSKeyValueObservation?
        if let progressHandler = progress {
            observation = request.progress.observe(\.fractionCompleted) { prog, _ in
                DispatchQueue.main.async { progressHandler(prog.fractionCompleted) }
            }
        }

        request.beginAccessingResources { [weak self] error in
            observation?.invalidate()
            DispatchQueue.main.async {
                if let error = error {
                    self?.activeRequests.removeValue(forKey: key)
                    completion(.failure(error))
                } else {
                    self?.loadedTags.formUnion(tagsToLoad)
                    completion(.success(()))
                }
            }
        }
    }

    func releaseResources(tags: Set<String>) {
        let key = tags.sorted().joined(separator: ",")
        activeRequests[key]?.endAccessingResources()
        activeRequests.removeValue(forKey: key)
        loadedTags.subtract(tags)
    }

    func prefetchResources(tags: Set<String>) {
        let request = NSBundleResourceRequest(tags: tags.subtracting(loadedTags))
        request.loadingPriority = NSBundleResourceRequestLoadingPriorityLowPriority
        request.beginAccessingResources { [weak self] error in
            if error == nil { self?.loadedTags.formUnion(tags) }
        }
    }
}
```

## Asset Loader

```swift
import SpriteKit

final class AssetLoader {
    static let shared = AssetLoader()

    private var loadedAtlases: [String: SKTextureAtlas] = [:]

    func preloadAtlases(named names: [String], completion: @escaping () -> Void) {
        SKTextureAtlas.preloadTextureAtlasesNamed(names) { error, atlases in
            for (index, name) in names.enumerated() where index < atlases.count {
                self.loadedAtlases[name] = atlases[index]
            }
            DispatchQueue.main.async { completion() }
        }
    }

    func atlas(named name: String) -> SKTextureAtlas? {
        if let cached = loadedAtlases[name] { return cached }
        let atlas = SKTextureAtlas(named: name)
        loadedAtlases[name] = atlas
        return atlas
    }

    func animationTextures(baseName: String, count: Int, fromAtlas atlasName: String) -> [SKTexture] {
        guard let atlas = atlas(named: atlasName) else { return [] }
        return (1...count).map { atlas.textureNamed("\(baseName)_\($0)") }
    }

    func unloadAllAtlases() { loadedAtlases.removeAll() }
}
```

## Level Resource Loader

```swift
final class LevelResourceLoader {
    private let resourceManager = OnDemandResourceManager.shared

    private let levelTags: [Int: Set<String>] = [
        1: ["level_1_assets", "common_assets"],
        2: ["level_2_assets", "common_assets"],
        3: ["level_3_assets", "common_assets", "boss_assets"],
    ]

    func loadLevel(_ level: Int, progress: @escaping (Double) -> Void, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let tags = levelTags[level] else {
            completion(.failure(NSError(domain: "InvalidLevel", code: 0)))
            return
        }
        resourceManager.loadResources(tags: tags, progress: progress, completion: completion)
    }

    func prefetchNextLevel(_ currentLevel: Int) {
        guard let tags = levelTags[currentLevel + 1] else { return }
        resourceManager.prefetchResources(tags: tags)
    }

    func unloadLevel(_ level: Int) {
        guard let tags = levelTags[level] else { return }
        let specific = tags.filter { !$0.contains("common") }
        resourceManager.releaseResources(tags: specific)
    }
}
```

## Asset Validation Script

```bash
#!/bin/bash
# validate_assets.sh

ASSETS_DIR="Assets.xcassets"
AUDIO_DIR="Sounds"

echo "=== Asset Validation ==="

# Check image scales
find "$ASSETS_DIR" -name "*.imageset" -type d | while read imageset; do
    name=$(basename "$imageset" .imageset)
    has_2x=$(ls "$imageset" | grep -c "@2x" || true)
    has_3x=$(ls "$imageset" | grep -c "@3x" || true)
    [ "$has_2x" -eq 0 ] && echo "WARNING: $name missing @2x"
    [ "$has_3x" -eq 0 ] && echo "WARNING: $name missing @3x"
done

# Check texture sizes
find "$ASSETS_DIR" -name "*.png" -type f | while read png; do
    width=$(sips -g pixelWidth "$png" | tail -1 | awk '{print $2}')
    height=$(sips -g pixelHeight "$png" | tail -1 | awk '{print $2}')
    [ "$width" -gt 4096 ] || [ "$height" -gt 4096 ] && echo "ERROR: $png exceeds 4096px"
done

# Check for unprocessed WAV
find "$AUDIO_DIR" -name "*.wav" -type f | while read wav; do
    echo "WARNING: Unprocessed WAV: $(basename "$wav")"
done

echo "=== Validation Complete ==="
```

## Audio Preparation Script

```bash
#!/bin/bash
# prepare_audio.sh

SFX_INPUT="source_audio/sfx"
MUSIC_INPUT="source_audio/music"
OUTPUT_DIR="Sounds"

mkdir -p "$OUTPUT_DIR/sfx" "$OUTPUT_DIR/music"

for file in "$SFX_INPUT"/*.wav; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .wav)
    duration=$(afinfo "$file" | grep "duration" | awk '{print $3}')

    if (( $(echo "$duration < 0.5" | bc -l) )); then
        # Critical SFX -> Linear PCM
        afconvert -f caff -d LEI16@44100 -c 1 "$file" "$OUTPUT_DIR/sfx/${name}.caf"
    else
        # Standard SFX -> IMA4
        afconvert -f AIFC -d ima4 -c 1 "$file" "$OUTPUT_DIR/sfx/${name}.caf"
    fi
done

for file in "$MUSIC_INPUT"/*.wav; do
    [ -f "$file" ] || continue
    name=$(basename "$file" .wav)
    afconvert -f m4af -d aac -b 256000 -c 2 "$file" "$OUTPUT_DIR/music/${name}.m4a"
done
```
