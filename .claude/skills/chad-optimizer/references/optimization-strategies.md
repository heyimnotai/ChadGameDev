# Optimization Strategies Reference

## Performance Optimization

### Before: Many Objects
```javascript
for (let i = 0; i < 100; i++) {
    scene.addChild(new ShapeNode.circle(5));
}
```

### After: Batch Rendering
```javascript
const batchNode = new SpriteNode(...);
batchNode.renderBatch = true;
```

## Visual Polish

### Before: Hard Edges
```javascript
const button = new SpriteNode(Color.blue, { width: 200, height: 60 });
```

### After: Rounded Corners
```javascript
const button = new SpriteNode(Color.blue, { width: 200, height: 60 });
button.cornerRadius = 12;
```

## Animation Refinement

### Before: Linear Movement
```javascript
Action.moveTo(target, 0.3);
```

### After: Eased Movement
```javascript
const action = Action.moveTo(target, 0.3);
action.timingFunction = Action.easeOut;
```

## Common Fix Patterns

### Safe Area Violation
```javascript
// Move from y: 100 to y: 180
const label = new LabelNode({ y: SAFE_AREA_TOP + 20 });
```

### Touch Target Too Small
```javascript
// Add hit area padding
sprite.hitAreaPadding = 20;  // 40px total added
```

### Missing Feedback
```javascript
// Add visual + haptic feedback
const pulse = Action.sequence([
  Action.scaleTo(1.1, 0.05),
  Action.scaleTo(1.0, 0.05)
]);
sprite.runAction(pulse);
HapticManager.shared.impact(.light);
```

### Particle Not Visible
```javascript
// Always call start() after adding
scene.addChild(emitter);
emitter.start();  // Required!
```

### Score Not Updating
```javascript
// Use reactive binding or manual update
this.scoreLabel.text = `Score: ${this.score}`;
```

## Session State Files

| File | Purpose |
|------|---------|
| `chad/config.json` | Loop configuration |
| `chad/session-state.json` | Current state |
| `chad/current-prompt.md` | Next iteration |
| `chad/analysis-log.md` | Full history |
| `patches.md` | Known solutions |

## Screenshot Organization

```
screenshots/
└── session-abc123/
    ├── iteration-001/
    │   ├── initial.png
    │   ├── gameplay.png
    │   └── analysis.md
    └── summary.md
```

## Metrics to Track

### Per Session
- Iterations used
- Issues found/fixed
- Patches applied/created
- Final gate status

### Across Sessions
- Average iterations to completion
- Most common issues
- Most useful patches
