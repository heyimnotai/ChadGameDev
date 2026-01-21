# Sound Sourcer - Code Patterns

## Search Local Cache

```javascript
async function searchLocalCache(queries, soundType) {
  const indexPath = 'chad/sound-library/index.json';
  if (!await fileExists(indexPath)) return null;

  const index = JSON.parse(await read(indexPath));

  for (const query of queries) {
    const terms = query.toLowerCase().split(' ');
    for (const sound of index.sounds) {
      const matchScore = terms.filter(term =>
        sound.tags.some(tag => tag.includes(term)) ||
        sound.path.toLowerCase().includes(term)
      ).length;
      if (matchScore >= 2) return sound;
    }
  }
  return null;
}
```

## Search Kenney Packs

```javascript
async function searchKenney(queries, soundType) {
  const packMap = {
    ui: ['ui-audio', 'interface-sounds'],
    impact: ['impact-sounds'],
    collect: ['interface-sounds', 'casino-audio'],
    music: ['music'],
    ambient: ['digital-audio']
  };

  const packs = packMap[soundType] || ['interface-sounds'];

  for (const pack of packs) {
    const packPath = `chad/sound-library/kenney/${pack}`;
    if (!await dirExists(packPath)) continue;

    const files = await glob(`${packPath}/*.{mp3,ogg,wav}`);
    for (const query of queries) {
      const terms = query.toLowerCase().split(' ');
      for (const file of files) {
        if (terms.some(term => file.toLowerCase().includes(term))) {
          return { path: file, source: 'kenney', license: 'CC0' };
        }
      }
    }
  }
  return null;
}
```

## Freesound API Search

```javascript
async function searchFreesound(queries, soundType) {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) return null;

  for (const query of queries) {
    const url = `https://freesound.org/apiv2/search/text/?` +
      `query=${encodeURIComponent(query)}` +
      `&filter=license:"Creative Commons 0"` +
      `&page_size=5&token=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results?.length > 0) {
      const sorted = data.results.sort((a, b) =>
        soundType === 'music' ? b.duration - a.duration : a.duration - b.duration
      );
      return {
        id: sorted[0].id,
        previewUrl: sorted[0].previews['preview-hq-mp3'],
        source: 'freesound',
        license: 'CC0'
      };
    }
  }
  return null;
}
```

## ElevenLabs SFX Generation

```javascript
async function generateWithElevenLabs(description, soundStyle, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  const stylePrompts = {
    '8-bit chiptune': '8-bit retro game style, chiptune',
    'minimal electronic': 'subtle digital, minimal, soft',
    'organic acoustic': 'natural, acoustic, warm',
    'synthwave': '80s synth, electronic, retro',
    'cute playful': 'playful, bouncy, cheerful, cute'
  };

  const prompt = `${stylePrompts[soundStyle.style] || ''} ${description}`;

  const response = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: prompt, duration_seconds: 2.0, loop: false })
  });

  const buffer = await response.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));
}
```

## Format Conversion

```bash
# Convert OGG to MP3 for iOS compatibility
ffmpeg -i "${inputPath}" -acodec libmp3lame -q:a 2 "${outputPath}" -y
```
