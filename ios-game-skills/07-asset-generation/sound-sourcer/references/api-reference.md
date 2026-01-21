# Sound Sourcer - API Reference

## Source Priority

| Priority | Source | License | Best For |
|----------|--------|---------|----------|
| 1 | Kenney.nl | CC0 | UI, impacts, game SFX |
| 2 | Local cache | Various | Previously downloaded |
| 3 | Freesound.org | CC0/CC-BY | Specific sounds |
| 4 | OpenGameArt | Various | Music, themed packs |
| 5 | ElevenLabs SFX | Royalty-free | Unique SFX |
| 6 | Suno | Commercial (Pro) | Music/BGM |

## Style-Sound Mapping

| Art Style | Sound Style | Search Modifiers |
|-----------|-------------|------------------|
| Retro Pixel | 8-bit chiptune | 8bit, retro, NES, arcade |
| Modern Minimal | Minimal electronic | subtle, soft, clean, digital |
| Hand-Drawn | Organic acoustic | organic, acoustic, natural |
| Neon Cyber | Synthwave | synth, 80s, electronic, retro |
| Cute Kawaii | Cute playful | cute, bubbly, cheerful, playful |

## UI Sound Mappings

| Event | Search Terms | Fallback Prompt |
|-------|--------------|-----------------|
| Button tap | ui click, button tap | "soft UI button click, digital" |
| Confirm | confirm, success, accept | "confirmation tone, positive" |
| Cancel | cancel, back, close | "cancel sound, back button" |
| Error | error, wrong, denied | "error notification, failure" |

## Game Event Mappings

| Event | Search Terms | Fallback Prompt |
|-------|--------------|-----------------|
| Coin collect | coin, collect, pickup | "coin pickup sparkle, game" |
| Jump | jump, hop, bounce | "character jump, bouncy" |
| Hit/damage | hit, damage, hurt | "impact hit, damage" |
| Explosion | explosion, boom, blast | "explosion, boom, short" |
| Power-up | powerup, upgrade, boost | "power-up activation, shimmer" |
| Win | victory, win, fanfare | "victory fanfare, triumphant" |
| Lose | lose, gameover, fail | "game over, sad tone" |

## Music Mappings

| Type | Search Terms | Fallback Prompt |
|------|--------------|-----------------|
| Background | bgm, background, loop | "background music, {style}, loopable" |
| Menu | menu, title, theme | "menu theme, relaxed, game" |
| Action | action, intense, fast | "action music, intense, driving" |
| Victory | victory, win, celebration | "short victory theme, triumphant" |

## Sound Log Schema

```json
{
  "sounds": [{
    "id": "snd_001",
    "timestamp": "2026-01-09T11:00:00Z",
    "type": "sfx",
    "description": "coin collect",
    "source": "kenney",
    "sourcePath": "kenney/interface-sounds/coin_001.ogg",
    "outputPath": "assets/sounds/coin.mp3",
    "license": "CC0",
    "attribution": null
  }]
}
```

## Error Recovery

| Error | Recovery |
|-------|----------|
| No matches found | Try broader terms, then AI |
| API rate limit | Wait and retry |
| License conflict | Skip, try next source |
| Format unsupported | Convert with FFmpeg |
