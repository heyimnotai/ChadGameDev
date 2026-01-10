# Sound Libraries Catalog

**Date:** 2026-01-09
**Status:** Complete

---

## Executive Summary

Open-source sound libraries cover 80-90% of game audio needs. This catalog ranks sources by quality, license friendliness, and game-appropriateness. **Kenney.nl** is the top choice for game SFX due to CC0 license and game-focused design.

---

## Library Rankings

| Rank | Source | License | Best For | API |
|------|--------|---------|----------|-----|
| 1 | **Kenney.nl** | CC0 | UI, impacts, game SFX | No |
| 2 | **SONNISS GDC** | Royalty-free | Professional SFX | No |
| 3 | **OpenGameArt** | Various (CC0/CC-BY) | Music, themed packs | No |
| 4 | **Freesound.org** | CC0/CC-BY | Specific sounds | Yes |
| 5 | **Mixkit** | Royalty-free | Quick downloads | No |
| 6 | **Pixabay Audio** | Royalty-free | Music, ambient | No |

---

## 1. Kenney.nl (Top Recommendation)

**License:** CC0 (Public Domain) - No attribution required, commercial use allowed

**URL:** https://kenney.nl/assets/category:Audio

### Available Packs

| Pack | Count | Description |
|------|-------|-------------|
| **Interface Sounds** | 100 | Clicks, confirms, cancels |
| **Impact Sounds** | 130 | Hits, collisions, explosions |
| **Digital Audio** | 60 | Sci-fi, electronic, beeps |
| **RPG Audio** | 50 | Fantasy, magic, medieval |
| **UI Audio** | 50 | Buttons, switches, menus |
| **Casino Audio** | 50 | Coins, slots, cards |

### Best For
- Mobile game UI
- Casual game SFX
- Quick prototyping
- Any project needing attribution-free sounds

### Download Strategy
1. Download entire category packs
2. Store locally in `chad/sound-library/kenney/`
3. Search by filename/category when needed

### Sound Mapping Examples

| Game Event | Kenney Sound | Pack |
|------------|--------------|------|
| Button tap | click_001.ogg | UI Audio |
| Coin collect | coin_001.ogg | Interface Sounds |
| Hit/damage | impact_001.ogg | Impact Sounds |
| Level complete | jingle_001.ogg | Interface Sounds |
| Error/fail | error_001.ogg | Digital Audio |

---

## 2. SONNISS GDC Bundle

**License:** Royalty-free, no attribution required

**URL:** https://sonniss.com/gameaudiogdc/

### Overview
> "SONNISS gives away thousands of dollars worth of sounds for free each year in celebration of GDC. All sound effects are royalty free, commercially usable, and require no attribution."

### Best For
- High-quality professional SFX
- Cinematic sounds
- Large variety

### Download Strategy
- Download annual bundles (multi-GB)
- Organize by category locally
- Index with metadata for search

---

## 3. OpenGameArt

**License:** Various (check each asset) - CC0, CC-BY, CC-BY-SA, GPL

**URL:** https://opengameart.org/

### Notable Collections

| Collection | Description | License |
|------------|-------------|---------|
| Eric Matyas Collection | 2500+ tracks | CC-BY |
| Free Music Pack | 7 orchestral tracks | CC-BY |
| UI Sounds Pack | Retro game UI | CC0 |
| Sound Effects Pack | Ambient, impacts, UI | Various |

### Best For
- Music loops
- Themed audio packs
- Community contributions

### Caution
- **Always verify license** before use
- CC-BY requires attribution
- Some assets are GPL (may have restrictions)

### Search Tips
- Filter by license type
- Sort by popularity/downloads
- Check comments for quality feedback

---

## 4. Freesound.org

**License:** Various (CC0, CC-BY, CC-BY-NC)

**URL:** https://freesound.org/

### API Access

**Endpoint:** https://freesound.org/docs/api/

> "With the Freesound API you can browse, search, and retrieve information about Freesound users, packs, and the sounds themselves."

### API Setup

1. Register at freesound.org
2. Create API application
3. Get API key
4. Use APIv2 (v1 deprecated)

### API Example

```python
import requests

API_KEY = "your_api_key"
query = "coin pickup game"

response = requests.get(
    "https://freesound.org/apiv2/search/text/",
    params={
        "query": query,
        "filter": "license:Creative Commons 0",
        "fields": "id,name,previews,download",
        "token": API_KEY
    }
)

results = response.json()
```

### Best For
- Specific/unique sounds
- When libraries don't have match
- Content-based search (find similar sounds)

### Caution
- **CC-BY-NC** = Cannot use commercially
- Always filter by license
- Quality varies widely

---

## 5. Mixkit

**License:** Royalty-free, no attribution

**URL:** https://mixkit.co/free-sound-effects/game/

### Overview
> "A library of free Game sound effects with 36 game sounds that are royalty free and ready to use."

### Best For
- Quick downloads
- Common game sounds
- No signup required

### Limitations
- Smaller library
- Less variety than others

---

## 6. Pixabay Audio

**License:** Royalty-free, no attribution

**URL:** https://pixabay.com/sound-effects/search/game/

### Best For
- Music tracks
- Ambient sounds
- Longer audio pieces

---

## Audio Format Compatibility (Expo/React Native)

### Supported Formats

| Format | iOS | Android | Notes |
|--------|-----|---------|-------|
| **MP3** | Yes | Yes | Best compatibility |
| **WAV** | Yes | Yes | Larger files |
| **OGG** | No | Yes | Avoid for cross-platform |
| **AAC** | Yes | Yes | Good compression |
| **M4A** | Yes | Yes | Apple format |

### Recommendation
- **Use MP3** for all game sounds (universal support)
- **44.1kHz sample rate** standard
- **Stereo or Mono** both work

### Expo Audio Libraries

```javascript
// expo-audio (new)
import { useAudioPlayer } from 'expo-audio';
const player = useAudioPlayer(require('./sounds/tap.mp3'));

// expo-av (legacy)
import { Audio } from 'expo-av';
const { sound } = await Audio.Sound.createAsync(
  require('./sounds/tap.mp3')
);
```

---

## Conversion Tools

### FFmpeg (Command Line)

```bash
# Convert OGG to MP3
ffmpeg -i sound.ogg -acodec libmp3lame -q:a 2 sound.mp3

# Convert WAV to MP3
ffmpeg -i sound.wav -acodec libmp3lame -b:a 192k sound.mp3

# Normalize volume
ffmpeg -i input.mp3 -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.mp3
```

### Node.js (fluent-ffmpeg)

```javascript
const ffmpeg = require('fluent-ffmpeg');

ffmpeg('input.ogg')
  .toFormat('mp3')
  .on('end', () => console.log('Conversion complete'))
  .save('output.mp3');
```

---

## Sound Type Mapping by Game Style

### Retro Pixel Art Game

| Event | Sound Type | Search Terms |
|-------|------------|--------------|
| Jump | 8-bit bleep | "8bit jump", "retro jump" |
| Collect | Chiptune coin | "8bit coin", "retro pickup" |
| Hit | Noise burst | "8bit hit", "retro damage" |
| Win | Chiptune fanfare | "8bit victory", "retro win" |
| Music | Chiptune loop | "chiptune", "8bit bgm" |

### Modern Minimal Game

| Event | Sound Type | Search Terms |
|-------|------------|--------------|
| Tap | Soft click | "ui click soft", "subtle tap" |
| Collect | Gentle tone | "notification positive", "soft collect" |
| Hit | Muted thud | "soft impact", "gentle hit" |
| Win | Warm chime | "success chime", "achievement" |
| Music | Ambient electronic | "minimal ambient", "chill electronic" |

### Cute/Kawaii Game

| Event | Sound Type | Search Terms |
|-------|------------|--------------|
| Tap | Playful pop | "pop cute", "bubble tap" |
| Collect | Sparkle | "sparkle", "magic collect" |
| Hit | Bouncy | "boing", "cartoon hit" |
| Win | Happy jingle | "happy fanfare", "cute victory" |
| Music | Upbeat playful | "cute bgm", "playful loop" |

---

## Local Library Structure

```
chad/sound-library/
├── kenney/
│   ├── ui-audio/
│   ├── impact-sounds/
│   ├── interface-sounds/
│   └── digital-audio/
├── sonniss/
│   └── gdc-2025/
├── custom/
│   └── ai-generated/
└── index.json  # Searchable metadata
```

### Index Format

```json
{
  "sounds": [
    {
      "id": "kenney-ui-click-001",
      "path": "kenney/ui-audio/click_001.mp3",
      "tags": ["ui", "click", "button", "tap"],
      "style": ["all", "retro", "minimal"],
      "duration": 0.2,
      "license": "CC0"
    }
  ]
}
```

---

## Sources

- [Kenney.nl Audio Assets](https://kenney.nl/assets/category:Audio)
- [Freesound API Documentation](https://freesound.org/docs/api/)
- [SONNISS GDC Bundle](https://sonniss.com/gameaudiogdc/)
- [OpenGameArt Audio Forum](https://opengameart.org/forums/audio)
- [Mixkit Game Sounds](https://mixkit.co/free-sound-effects/game/)
- [Expo Audio Documentation](https://docs.expo.dev/versions/latest/sdk/audio/)
