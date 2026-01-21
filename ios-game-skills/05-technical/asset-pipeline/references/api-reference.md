# Asset Pipeline API Reference

## Image Resolution Targets

| Device Class | Scale | Max Texture | Atlas Size |
|--------------|-------|-------------|------------|
| iPhone SE/8 | @2x | 4096x4096 | 2048x2048 |
| iPhone 12-15 | @3x | 4096x4096 | 2048x2048 |
| iPad (non-Pro) | @2x | 4096x4096 | 2048x2048 |
| iPad Pro | @2x | 8192x8192 | 4096x4096 |

## Texture Compression Formats

| Format | Bits/Pixel | Use Case | Devices |
|--------|-----------|----------|---------|
| ASTC 4x4 | 8 bpp | UI, characters | A8+ |
| ASTC 5x5 | 5.12 bpp | Detailed backgrounds | A8+ |
| ASTC 6x6 | 3.56 bpp | Large textures | A8+ |
| ASTC 8x8 | 2 bpp | Distant backgrounds | A8+ |
| ASTC 10x10 | 1.28 bpp | Skyboxes | A8+ |
| ASTC 12x12 | 0.89 bpp | Massive textures | A8+ |
| PVRTC 4bpp | 4 bpp | Legacy (A7) | A7+ |

## Audio Format Specifications

| Format | Ext | Compression | Latency | Simultaneous | Use |
|--------|-----|-------------|---------|--------------|-----|
| Linear PCM | .caf | None | Lowest | Many | Critical SFX |
| IMA4 | .caf | 4:1 | Low | Many | Standard SFX |
| AAC | .m4a | ~10:1 | Higher | 1 (HW) | Music |

## Audio Parameters

| Parameter | Specification |
|-----------|---------------|
| Sample rate | 44.1kHz or 48kHz |
| Bit depth | 16-bit (SFX), 24-bit (music) |
| SFX duration | <10 seconds |
| Simultaneous SFX | 32 limit |
| Latency target | <20ms feedback |

## afconvert Quick Reference

```bash
# Linear PCM (lowest latency)
afconvert -f caff -d LEI16@44100 -c 1 input.wav output.caf

# IMA4 (4:1 compression)
afconvert -f AIFC -d ima4 -c 1 input.wav output.caf

# AAC (music)
afconvert -f m4af -d aac -b 256000 input.wav output.m4a

# AAC in CAF (seamless looping)
afconvert -f caff -d aac -b 256000 input.wav output.caf
```

## On-Demand Resources

| Limit | Value |
|-------|-------|
| Per asset pack | 8GB max |
| Initial install | Downloaded at install |
| Prefetch | Downloaded when space available |
| On-demand | Downloaded when requested |

## Asset Naming Convention

```
# Sprites
player_idle_1.png
player_walk_1.png
enemy_goblin_idle_1.png

# UI
button_play_normal.png
button_play_pressed.png
icon_coin.png

# Backgrounds
background_level_1.png
background_level_1_parallax_far.png

# Audio
sfx_button_tap.caf
sfx_coin_collect.caf
music_menu.m4a
```

## Build Settings

```
ASSETCATALOG_COMPILER_OPTIMIZATION = space
STRIP_INSTALLED_PRODUCT = YES
DEAD_CODE_STRIPPING = YES
```

## Compression Type Options

| Value | Description |
|-------|-------------|
| automatic | Let Xcode decide |
| lossless | No compression |
| basic | Basic compression |
| gpu-optimized-best | ASTC best quality |
| gpu-optimized-smallest | ASTC smallest size |
