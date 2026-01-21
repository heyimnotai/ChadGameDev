# Asset Generator - Code Patterns

## Game Analysis

```javascript
async function analyzeGame(projectName) {
  const gamePath = `expo-games/apps/${projectName}/src/Game.tsx`;
  const gameCode = await read(gamePath);

  return {
    entities: extractEntities(gameCode),
    interactions: extractInteractions(gameCode),
    sounds: extractSoundEvents(gameCode),
    description: projectConfig.description,
    genre: inferGenre(gameCode, projectConfig)
  };
}

function extractEntities(code) {
  const patterns = {
    player: /player|hero|character|avatar/gi,
    enemy: /enemy|obstacle|hazard|threat/gi,
    collectible: /coin|gem|star|collectible|pickup|item/gi,
    powerup: /powerup|power-up|boost|ability/gi,
    projectile: /bullet|projectile|missile|shot/gi
  };

  return Object.entries(patterns)
    .filter(([_, pattern]) => pattern.test(code))
    .map(([type]) => ({ type, needsSprite: true }));
}

function extractSoundEvents(code) {
  const patterns = {
    tap: /onTap|handleTap|touchStart/gi,
    collect: /collect|pickup|caught/gi,
    hit: /hit|damage|hurt|collision/gi,
    win: /win|victory|complete|success/gi,
    lose: /lose|gameover|fail|die/gi
  };

  return Object.entries(patterns)
    .filter(([_, pattern]) => pattern.test(code))
    .map(([event]) => ({ event, type: 'sfx', required: true }));
}
```

## Manifest Building

```javascript
function buildAssetManifest(analysis) {
  const manifest = {
    project: analysis.projectName,
    generatedAt: new Date().toISOString(),
    status: 'pending',
    images: [],
    sounds: []
  };

  // Add sprites for each entity
  for (const entity of analysis.entities) {
    manifest.images.push({
      id: `sprite_${entity.type}`,
      type: 'sprite',
      description: entity.type,
      size: '64x64',
      status: 'pending'
    });
  }

  // Always add background and icon
  manifest.images.push(
    { id: 'background', type: 'background', size: '960x540', status: 'pending' },
    { id: 'icon', type: 'icon', size: '1024x1024', status: 'pending' }
  );

  // Add sounds for each event
  for (const sound of analysis.sounds) {
    manifest.sounds.push({
      id: `sound_${sound.event}`,
      type: sound.type,
      event: sound.event,
      status: 'pending'
    });
  }

  return manifest;
}
```

## Pipeline Execution

```javascript
async function runAssetPipeline(projectName) {
  // Phase 1: Verify quality gates
  const qualityOk = await verifyQualityGates(projectName);
  if (!qualityOk) throw new Error('Quality gates not met');

  // Phase 2: Analyze game
  const analysis = await analyzeGame(projectName);

  // Phase 3: Build manifest
  const manifest = buildAssetManifest(analysis);

  // Phase 4: Art direction
  const style = await invokeSkill('art-director', { projectName, analysis });

  // Phase 5: Generate images (priority order)
  const priorities = ['sprite_player', 'sprite_enemy', 'sprite_collectible', 'background', 'icon'];
  for (const id of priorities) {
    const asset = manifest.images.find(a => a.id === id);
    if (asset) {
      const result = await invokeSkill('gemini-image-generator', { ...asset, projectName });
      asset.status = result.success ? 'complete' : 'failed';
    }
  }

  // Phase 6: Generate sounds
  for (const sound of manifest.sounds) {
    const result = await invokeSkill('sound-sourcer', { ...sound, projectName });
    sound.status = result.success ? 'complete' : 'failed';
  }

  // Phase 7: Validate
  const validation = await invokeSkill('visual-validator', { projectName, manifest });

  return { manifest, style, validation };
}
```

## Retry Strategy

```javascript
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await sleep(2000 * attempt);
    }
  }
}
```
