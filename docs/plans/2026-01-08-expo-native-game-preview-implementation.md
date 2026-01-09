# Expo Native Game Preview System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace browser-based game preview with Expo Go native development, enabling App Store-ready games with full audio, haptics, and native feel.

**Architecture:** Expo monorepo with shared game-engine package (React Native Game Engine + Skia) and per-game apps. AI tests via iOS Simulator, humans test via Expo Go on physical device. EAS handles App Store builds.

**Tech Stack:** Expo SDK 50+, React Native Game Engine, React Native Skia, expo-av, expo-haptics, TypeScript

---

## Phase 1: Project Scaffolding

### Task 1.1: Create Expo Monorepo Structure

**Files:**
- Create: `expo-games/package.json`
- Create: `expo-games/packages/.gitkeep`
- Create: `expo-games/apps/.gitkeep`

**Step 1: Create monorepo root**

```bash
mkdir -p expo-games/packages expo-games/apps
```

**Step 2: Create root package.json**

Create `expo-games/package.json`:
```json
{
  "name": "expo-games",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "game-engine": "yarn workspace @expo-games/game-engine",
    "app": "yarn workspace"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**Step 3: Initialize yarn workspaces**

```bash
cd expo-games && yarn install
```

**Step 4: Commit**

```bash
git add expo-games/
git commit -m "feat: initialize expo-games monorepo structure"
```

---

### Task 1.2: Create Game Engine Package

**Files:**
- Create: `expo-games/packages/game-engine/package.json`
- Create: `expo-games/packages/game-engine/tsconfig.json`
- Create: `expo-games/packages/game-engine/src/index.ts`

**Step 1: Create package.json**

Create `expo-games/packages/game-engine/package.json`:
```json
{
  "name": "@expo-games/game-engine",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "@shopify/react-native-skia": ">=0.1.0",
    "react-native-game-engine": ">=1.2.0",
    "expo-av": ">=13.0.0",
    "expo-haptics": ">=12.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create tsconfig.json**

Create `expo-games/packages/game-engine/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**Step 3: Create index.ts stub**

Create `expo-games/packages/game-engine/src/index.ts`:
```typescript
// Game Engine - React Native Game Engine + Skia
// Exports will be added as we build each system

export const VERSION = '1.0.0';
```

**Step 4: Commit**

```bash
git add expo-games/packages/game-engine/
git commit -m "feat: add game-engine package skeleton"
```

---

## Phase 2: Core Engine Systems

### Task 2.1: Create Vector2 and Color Types

**Files:**
- Create: `expo-games/packages/game-engine/src/types/Vector2.ts`
- Create: `expo-games/packages/game-engine/src/types/Color.ts`
- Create: `expo-games/packages/game-engine/src/types/index.ts`

**Step 1: Create Vector2**

Create `expo-games/packages/game-engine/src/types/Vector2.ts`:
```typescript
export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2(0, 0);
    return new Vector2(this.x / mag, this.y / mag);
  }

  distance(v: Vector2): number {
    return this.subtract(v).magnitude();
  }

  static lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return new Vector2(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t
    );
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }
}
```

**Step 2: Create Color**

Create `expo-games/packages/game-engine/src/types/Color.ts`:
```typescript
export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {}

  toString(): string {
    return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
  }

  toSkiaColor(): string {
    const hex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex(this.a)}`;
  }

  withOpacity(opacity: number): Color {
    return new Color(this.r, this.g, this.b, opacity);
  }

  static lerp(a: Color, b: Color, t: number): Color {
    return new Color(
      a.r + (b.r - a.r) * t,
      a.g + (b.g - a.g) * t,
      a.b + (b.b - a.b) * t,
      a.a + (b.a - a.a) * t
    );
  }

  // iOS System Colors
  static get white() { return new Color(1, 1, 1); }
  static get black() { return new Color(0, 0, 0); }
  static get clear() { return new Color(0, 0, 0, 0); }
  static get red() { return new Color(1, 0.231, 0.188); }
  static get orange() { return new Color(1, 0.584, 0); }
  static get yellow() { return new Color(1, 0.8, 0); }
  static get green() { return new Color(0.204, 0.78, 0.349); }
  static get mint() { return new Color(0, 0.78, 0.745); }
  static get teal() { return new Color(0.188, 0.69, 0.78); }
  static get cyan() { return new Color(0.196, 0.678, 0.902); }
  static get blue() { return new Color(0, 0.478, 1); }
  static get indigo() { return new Color(0.345, 0.337, 0.839); }
  static get purple() { return new Color(0.686, 0.322, 0.871); }
  static get pink() { return new Color(1, 0.176, 0.333); }
  static get gray() { return new Color(0.557, 0.557, 0.576); }

  static fromHex(hex: string): Color {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return new Color(
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
      );
    }
    return Color.white;
  }
}
```

**Step 3: Create types index**

Create `expo-games/packages/game-engine/src/types/index.ts`:
```typescript
export { Vector2 } from './Vector2';
export { Color } from './Color';
```

**Step 4: Commit**

```bash
git add expo-games/packages/game-engine/src/types/
git commit -m "feat: add Vector2 and Color types to game engine"
```

---

### Task 2.2: Create Entity Types

**Files:**
- Create: `expo-games/packages/game-engine/src/entities/Entity.ts`
- Create: `expo-games/packages/game-engine/src/entities/SpriteEntity.ts`
- Create: `expo-games/packages/game-engine/src/entities/TextEntity.ts`
- Create: `expo-games/packages/game-engine/src/entities/CircleEntity.ts`
- Create: `expo-games/packages/game-engine/src/entities/index.ts`

**Step 1: Create base Entity type**

Create `expo-games/packages/game-engine/src/entities/Entity.ts`:
```typescript
import { Vector2 } from '../types';

export interface BaseEntity {
  id: string;
  type: string;
  position: Vector2;
  scale: Vector2;
  rotation: number;
  alpha: number;
  zIndex: number;
  hidden: boolean;
}

export function createBaseEntity(id: string, type: string): BaseEntity {
  return {
    id,
    type,
    position: new Vector2(0, 0),
    scale: new Vector2(1, 1),
    rotation: 0,
    alpha: 1,
    zIndex: 0,
    hidden: false,
  };
}
```

**Step 2: Create SpriteEntity**

Create `expo-games/packages/game-engine/src/entities/SpriteEntity.ts`:
```typescript
import { BaseEntity, createBaseEntity } from './Entity';
import { Color, Vector2 } from '../types';

export interface SpriteEntity extends BaseEntity {
  type: 'sprite';
  width: number;
  height: number;
  color: Color;
  cornerRadius: number;
}

export function createSprite(
  id: string,
  options: {
    position?: Vector2;
    width?: number;
    height?: number;
    color?: Color;
    cornerRadius?: number;
  } = {}
): SpriteEntity {
  return {
    ...createBaseEntity(id, 'sprite'),
    type: 'sprite',
    position: options.position ?? new Vector2(0, 0),
    width: options.width ?? 100,
    height: options.height ?? 100,
    color: options.color ?? Color.white,
    cornerRadius: options.cornerRadius ?? 0,
  };
}
```

**Step 3: Create TextEntity**

Create `expo-games/packages/game-engine/src/entities/TextEntity.ts`:
```typescript
import { BaseEntity, createBaseEntity } from './Entity';
import { Color, Vector2 } from '../types';

export interface TextEntity extends BaseEntity {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: Color;
  align: 'left' | 'center' | 'right';
}

export function createText(
  id: string,
  text: string,
  options: {
    position?: Vector2;
    fontSize?: number;
    fontFamily?: string;
    color?: Color;
    align?: 'left' | 'center' | 'right';
  } = {}
): TextEntity {
  return {
    ...createBaseEntity(id, 'text'),
    type: 'text',
    position: options.position ?? new Vector2(0, 0),
    text,
    fontSize: options.fontSize ?? 24,
    fontFamily: options.fontFamily ?? 'System',
    color: options.color ?? Color.white,
    align: options.align ?? 'left',
  };
}
```

**Step 4: Create CircleEntity**

Create `expo-games/packages/game-engine/src/entities/CircleEntity.ts`:
```typescript
import { BaseEntity, createBaseEntity } from './Entity';
import { Color, Vector2 } from '../types';

export interface CircleEntity extends BaseEntity {
  type: 'circle';
  radius: number;
  color: Color;
  strokeColor?: Color;
  strokeWidth?: number;
}

export function createCircle(
  id: string,
  options: {
    position?: Vector2;
    radius?: number;
    color?: Color;
    strokeColor?: Color;
    strokeWidth?: number;
  } = {}
): CircleEntity {
  return {
    ...createBaseEntity(id, 'circle'),
    type: 'circle',
    position: options.position ?? new Vector2(0, 0),
    radius: options.radius ?? 50,
    color: options.color ?? Color.white,
    strokeColor: options.strokeColor,
    strokeWidth: options.strokeWidth,
  };
}
```

**Step 5: Create entities index**

Create `expo-games/packages/game-engine/src/entities/index.ts`:
```typescript
export { BaseEntity, createBaseEntity } from './Entity';
export { SpriteEntity, createSprite } from './SpriteEntity';
export { TextEntity, createText } from './TextEntity';
export { CircleEntity, createCircle } from './CircleEntity';

export type GameEntity = SpriteEntity | TextEntity | CircleEntity;
```

**Step 6: Commit**

```bash
git add expo-games/packages/game-engine/src/entities/
git commit -m "feat: add entity types (Sprite, Text, Circle)"
```

---

### Task 2.3: Create Skia Renderer

**Files:**
- Create: `expo-games/packages/game-engine/src/renderer/SkiaRenderer.tsx`
- Create: `expo-games/packages/game-engine/src/renderer/index.ts`

**Step 1: Create SkiaRenderer**

Create `expo-games/packages/game-engine/src/renderer/SkiaRenderer.tsx`:
```typescript
import React from 'react';
import {
  Canvas,
  RoundedRect,
  Text as SkiaText,
  Circle,
  useFont,
  Fill,
} from '@shopify/react-native-skia';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { GameEntity, SpriteEntity, TextEntity, CircleEntity } from '../entities';

interface SkiaRendererProps {
  entities: Record<string, GameEntity>;
  backgroundColor?: string;
}

function RenderSprite({ entity }: { entity: SpriteEntity }) {
  if (entity.hidden) return null;

  return (
    <RoundedRect
      x={entity.position.x - entity.width / 2}
      y={entity.position.y - entity.height / 2}
      width={entity.width * entity.scale.x}
      height={entity.height * entity.scale.y}
      r={entity.cornerRadius}
      color={entity.color.toSkiaColor()}
      opacity={entity.alpha}
    />
  );
}

function RenderText({ entity }: { entity: TextEntity }) {
  if (entity.hidden) return null;

  const font = useFont(null, entity.fontSize);
  if (!font) return null;

  let x = entity.position.x;
  if (entity.align === 'center') {
    const width = font.measureText(entity.text).width;
    x -= width / 2;
  } else if (entity.align === 'right') {
    const width = font.measureText(entity.text).width;
    x -= width;
  }

  return (
    <SkiaText
      x={x}
      y={entity.position.y}
      text={entity.text}
      font={font}
      color={entity.color.toSkiaColor()}
      opacity={entity.alpha}
    />
  );
}

function RenderCircle({ entity }: { entity: CircleEntity }) {
  if (entity.hidden) return null;

  return (
    <Circle
      cx={entity.position.x}
      cy={entity.position.y}
      r={entity.radius * entity.scale.x}
      color={entity.color.toSkiaColor()}
      opacity={entity.alpha}
    />
  );
}

export function SkiaRenderer({ entities, backgroundColor = '#000000' }: SkiaRendererProps) {
  const { width, height } = useWindowDimensions();

  const sortedEntities = Object.values(entities)
    .filter(e => !e.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <Canvas style={[styles.canvas, { width, height }]}>
      <Fill color={backgroundColor} />
      {sortedEntities.map(entity => {
        switch (entity.type) {
          case 'sprite':
            return <RenderSprite key={entity.id} entity={entity} />;
          case 'text':
            return <RenderText key={entity.id} entity={entity} />;
          case 'circle':
            return <RenderCircle key={entity.id} entity={entity} />;
          default:
            return null;
        }
      })}
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
```

**Step 2: Create renderer index**

Create `expo-games/packages/game-engine/src/renderer/index.ts`:
```typescript
export { SkiaRenderer } from './SkiaRenderer';
```

**Step 3: Commit**

```bash
git add expo-games/packages/game-engine/src/renderer/
git commit -m "feat: add Skia renderer for entities"
```

---

### Task 2.4: Create Audio System

**Files:**
- Create: `expo-games/packages/game-engine/src/systems/AudioSystem.ts`

**Step 1: Create AudioSystem**

Create `expo-games/packages/game-engine/src/systems/AudioSystem.ts`:
```typescript
import { Audio, AVPlaybackSource } from 'expo-av';

interface SoundOptions {
  volume?: number;
  rate?: number;
}

class AudioManagerClass {
  private sounds: Map<string, Audio.Sound> = new Map();
  private music: Audio.Sound | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 1.0;
  private isMuted: boolean = false;

  async initialize(): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }

  async preload(manifest: Record<string, AVPlaybackSource>): Promise<void> {
    for (const [name, source] of Object.entries(manifest)) {
      try {
        const { sound } = await Audio.Sound.createAsync(source);
        this.sounds.set(name, sound);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    }
  }

  async playSFX(name: string, options: SoundOptions = {}): Promise<void> {
    if (this.isMuted) return;

    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      await sound.setVolumeAsync((options.volume ?? 1.0) * this.sfxVolume);
      if (options.rate) {
        await sound.setRateAsync(options.rate, true);
      }
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error);
    }
  }

  async playMusic(source: AVPlaybackSource, volume: number = 0.5): Promise<void> {
    await this.stopMusic();

    if (this.isMuted) return;

    try {
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: true,
        volume: volume * this.musicVolume,
      });
      this.music = sound;
      await this.music.playAsync();
    } catch (error) {
      console.warn('Failed to play music', error);
    }
  }

  async stopMusic(): Promise<void> {
    if (this.music) {
      try {
        await this.music.stopAsync();
        await this.music.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
      this.music = null;
    }
  }

  async duckMusic(duration: number = 200): Promise<void> {
    if (!this.music) return;

    const originalVolume = this.musicVolume;
    await this.music.setVolumeAsync(0.2);
    setTimeout(async () => {
      await this.music?.setVolumeAsync(originalVolume);
    }, duration);
  }

  async setMusicVolume(volume: number): Promise<void> {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      await this.music.setVolumeAsync(this.musicVolume);
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    }
  }

  async cleanup(): Promise<void> {
    await this.stopMusic();
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.sounds.clear();
  }
}

export const AudioManager = new AudioManagerClass();
export type { SoundOptions };
```

**Step 2: Commit**

```bash
git add expo-games/packages/game-engine/src/systems/AudioSystem.ts
git commit -m "feat: add AudioSystem with preload, SFX, and music support"
```

---

### Task 2.5: Create Haptic System

**Files:**
- Create: `expo-games/packages/game-engine/src/systems/HapticSystem.ts`

**Step 1: Create HapticSystem**

Create `expo-games/packages/game-engine/src/systems/HapticSystem.ts`:
```typescript
import * as Haptics from 'expo-haptics';

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'success' | 'warning' | 'error';

class HapticManagerClass {
  private enabled: boolean = true;

  async impact(style: ImpactStyle = 'medium'): Promise<void> {
    if (!this.enabled) return;

    const styleMap: Record<ImpactStyle, Haptics.ImpactFeedbackStyle> = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
      rigid: Haptics.ImpactFeedbackStyle.Rigid,
      soft: Haptics.ImpactFeedbackStyle.Soft,
    };

    try {
      await Haptics.impactAsync(styleMap[style]);
    } catch (error) {
      // Haptics not available on this device
    }
  }

  async notification(type: NotificationType = 'success'): Promise<void> {
    if (!this.enabled) return;

    const typeMap: Record<NotificationType, Haptics.NotificationFeedbackType> = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    };

    try {
      await Haptics.notificationAsync(typeMap[type]);
    } catch (error) {
      // Haptics not available on this device
    }
  }

  async selection(): Promise<void> {
    if (!this.enabled) return;

    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Haptics not available on this device
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const HapticManager = new HapticManagerClass();
export type { ImpactStyle, NotificationType };
```

**Step 2: Commit**

```bash
git add expo-games/packages/game-engine/src/systems/HapticSystem.ts
git commit -m "feat: add HapticSystem with impact, notification, selection"
```

---

### Task 2.6: Create Touch System

**Files:**
- Create: `expo-games/packages/game-engine/src/systems/TouchSystem.ts`

**Step 1: Create TouchSystem**

Create `expo-games/packages/game-engine/src/systems/TouchSystem.ts`:
```typescript
import { Vector2 } from '../types';

export type TouchEventType = 'began' | 'moved' | 'ended' | 'cancelled';

export interface TouchEvent {
  type: TouchEventType;
  position: Vector2;
  startPosition: Vector2;
  delta: Vector2;
  timestamp: number;
  duration: number;
}

export interface GestureEvent {
  type: 'tap' | 'doubleTap' | 'swipe' | 'drag' | 'hold';
  position: Vector2;
  direction?: 'up' | 'down' | 'left' | 'right';
  velocity?: Vector2;
}

interface TouchState {
  startPosition: Vector2;
  startTime: number;
  lastPosition: Vector2;
  lastTapTime: number;
}

type TouchHandler = (event: TouchEvent) => void;
type GestureHandler = (event: GestureEvent) => void;

class TouchSystemClass {
  private state: TouchState = {
    startPosition: new Vector2(),
    startTime: 0,
    lastPosition: new Vector2(),
    lastTapTime: 0,
  };

  private touchHandlers: TouchHandler[] = [];
  private gestureHandlers: GestureHandler[] = [];

  // Configuration
  private doubleTapThreshold = 300; // ms
  private tapDistanceThreshold = 30; // pixels
  private swipeDistanceThreshold = 50; // pixels
  private swipeVelocityThreshold = 0.3; // pixels/ms

  onTouch(handler: TouchHandler): () => void {
    this.touchHandlers.push(handler);
    return () => {
      this.touchHandlers = this.touchHandlers.filter(h => h !== handler);
    };
  }

  onGesture(handler: GestureHandler): () => void {
    this.gestureHandlers.push(handler);
    return () => {
      this.gestureHandlers = this.gestureHandlers.filter(h => h !== handler);
    };
  }

  handleTouchStart(x: number, y: number): void {
    const now = Date.now();
    this.state.startPosition = new Vector2(x, y);
    this.state.startTime = now;
    this.state.lastPosition = new Vector2(x, y);

    const event: TouchEvent = {
      type: 'began',
      position: new Vector2(x, y),
      startPosition: this.state.startPosition,
      delta: new Vector2(0, 0),
      timestamp: now,
      duration: 0,
    };

    this.touchHandlers.forEach(h => h(event));
  }

  handleTouchMove(x: number, y: number): void {
    const now = Date.now();
    const position = new Vector2(x, y);
    const delta = position.subtract(this.state.lastPosition);
    this.state.lastPosition = position;

    const event: TouchEvent = {
      type: 'moved',
      position,
      startPosition: this.state.startPosition,
      delta,
      timestamp: now,
      duration: now - this.state.startTime,
    };

    this.touchHandlers.forEach(h => h(event));
  }

  handleTouchEnd(x: number, y: number): void {
    const now = Date.now();
    const position = new Vector2(x, y);
    const duration = now - this.state.startTime;
    const distance = position.distance(this.state.startPosition);

    const event: TouchEvent = {
      type: 'ended',
      position,
      startPosition: this.state.startPosition,
      delta: position.subtract(this.state.lastPosition),
      timestamp: now,
      duration,
    };

    this.touchHandlers.forEach(h => h(event));

    // Detect gestures
    this.detectGestures(position, duration, distance, now);
  }

  private detectGestures(
    position: Vector2,
    duration: number,
    distance: number,
    now: number
  ): void {
    const delta = position.subtract(this.state.startPosition);
    const velocity = distance / duration;

    // Tap detection
    if (distance < this.tapDistanceThreshold && duration < 300) {
      if (now - this.state.lastTapTime < this.doubleTapThreshold) {
        this.gestureHandlers.forEach(h => h({
          type: 'doubleTap',
          position,
        }));
        this.state.lastTapTime = 0; // Reset
      } else {
        this.gestureHandlers.forEach(h => h({
          type: 'tap',
          position,
        }));
        this.state.lastTapTime = now;
      }
      return;
    }

    // Swipe detection
    if (distance > this.swipeDistanceThreshold && velocity > this.swipeVelocityThreshold) {
      const direction = this.getSwipeDirection(delta);
      this.gestureHandlers.forEach(h => h({
        type: 'swipe',
        position,
        direction,
        velocity: delta.multiply(1 / duration),
      }));
      return;
    }

    // Drag detection (moved but not fast enough for swipe)
    if (distance > this.tapDistanceThreshold) {
      this.gestureHandlers.forEach(h => h({
        type: 'drag',
        position,
        velocity: delta.multiply(1 / duration),
      }));
    }
  }

  private getSwipeDirection(delta: Vector2): 'up' | 'down' | 'left' | 'right' {
    if (Math.abs(delta.x) > Math.abs(delta.y)) {
      return delta.x > 0 ? 'right' : 'left';
    }
    return delta.y > 0 ? 'down' : 'up';
  }
}

export const TouchSystem = new TouchSystemClass();
```

**Step 2: Commit**

```bash
git add expo-games/packages/game-engine/src/systems/TouchSystem.ts
git commit -m "feat: add TouchSystem with tap, swipe, drag detection"
```

---

### Task 2.7: Create Animation System

**Files:**
- Create: `expo-games/packages/game-engine/src/systems/AnimationSystem.ts`

**Step 1: Create AnimationSystem**

Create `expo-games/packages/game-engine/src/systems/AnimationSystem.ts`:
```typescript
import { Vector2 } from '../types';
import { BaseEntity } from '../entities';

type EasingFunction = (t: number) => number;

export const Easing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  },
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

interface Animation {
  id: string;
  entityId: string;
  property: string;
  startValue: any;
  endValue: any;
  duration: number;
  elapsed: number;
  easing: EasingFunction;
  onComplete?: () => void;
  loop?: boolean;
}

class AnimationSystemClass {
  private animations: Map<string, Animation> = new Map();
  private animationId = 0;

  moveTo(
    entity: BaseEntity,
    target: Vector2,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'position',
      startValue: new Vector2(entity.position.x, entity.position.y),
      endValue: target,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  scaleTo(
    entity: BaseEntity,
    target: number | Vector2,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    const endValue = typeof target === 'number' ? new Vector2(target, target) : target;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'scale',
      startValue: new Vector2(entity.scale.x, entity.scale.y),
      endValue,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  fadeTo(
    entity: BaseEntity,
    targetAlpha: number,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'alpha',
      startValue: entity.alpha,
      endValue: targetAlpha,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  rotateTo(
    entity: BaseEntity,
    targetRotation: number,
    duration: number,
    options: { easing?: EasingFunction; onComplete?: () => void } = {}
  ): string {
    const id = `anim_${++this.animationId}`;
    this.animations.set(id, {
      id,
      entityId: entity.id,
      property: 'rotation',
      startValue: entity.rotation,
      endValue: targetRotation,
      duration,
      elapsed: 0,
      easing: options.easing ?? Easing.easeOut,
      onComplete: options.onComplete,
    });
    return id;
  }

  cancel(animationId: string): void {
    this.animations.delete(animationId);
  }

  cancelAll(entityId: string): void {
    for (const [id, anim] of this.animations) {
      if (anim.entityId === entityId) {
        this.animations.delete(id);
      }
    }
  }

  update(entities: Record<string, BaseEntity>, deltaTime: number): void {
    const completed: string[] = [];

    for (const [id, anim] of this.animations) {
      anim.elapsed += deltaTime;
      const t = Math.min(anim.elapsed / anim.duration, 1);
      const easedT = anim.easing(t);

      const entity = entities[anim.entityId];
      if (!entity) {
        completed.push(id);
        continue;
      }

      // Apply animation based on property type
      if (anim.property === 'position' || anim.property === 'scale') {
        const start = anim.startValue as Vector2;
        const end = anim.endValue as Vector2;
        (entity as any)[anim.property] = Vector2.lerp(start, end, easedT);
      } else {
        const start = anim.startValue as number;
        const end = anim.endValue as number;
        (entity as any)[anim.property] = start + (end - start) * easedT;
      }

      if (t >= 1) {
        completed.push(id);
        anim.onComplete?.();
      }
    }

    completed.forEach(id => this.animations.delete(id));
  }
}

export const AnimationSystem = new AnimationSystemClass();
```

**Step 2: Commit**

```bash
git add expo-games/packages/game-engine/src/systems/AnimationSystem.ts
git commit -m "feat: add AnimationSystem with easing and property animations"
```

---

### Task 2.8: Create Systems Index and Update Package Export

**Files:**
- Create: `expo-games/packages/game-engine/src/systems/index.ts`
- Modify: `expo-games/packages/game-engine/src/index.ts`

**Step 1: Create systems index**

Create `expo-games/packages/game-engine/src/systems/index.ts`:
```typescript
export { AudioManager, SoundOptions } from './AudioSystem';
export { HapticManager, ImpactStyle, NotificationType } from './HapticSystem';
export { TouchSystem, TouchEvent, TouchEventType, GestureEvent } from './TouchSystem';
export { AnimationSystem, Easing } from './AnimationSystem';
```

**Step 2: Update main index**

Replace `expo-games/packages/game-engine/src/index.ts`:
```typescript
// Game Engine - React Native Game Engine + Skia
export const VERSION = '1.0.0';

// Types
export { Vector2 } from './types/Vector2';
export { Color } from './types/Color';

// Entities
export {
  BaseEntity,
  createBaseEntity,
  SpriteEntity,
  createSprite,
  TextEntity,
  createText,
  CircleEntity,
  createCircle,
  GameEntity,
} from './entities';

// Renderer
export { SkiaRenderer } from './renderer';

// Systems
export {
  AudioManager,
  HapticManager,
  TouchSystem,
  AnimationSystem,
  Easing,
} from './systems';
export type {
  SoundOptions,
  ImpactStyle,
  NotificationType,
  TouchEvent,
  TouchEventType,
  GestureEvent,
} from './systems';
```

**Step 3: Commit**

```bash
git add expo-games/packages/game-engine/src/
git commit -m "feat: export all systems and types from game-engine"
```

---

## Phase 3: Game Engine Component

### Task 3.1: Create Main Engine Component

**Files:**
- Create: `expo-games/packages/game-engine/src/Engine.tsx`
- Modify: `expo-games/packages/game-engine/src/index.ts`

**Step 1: Create Engine component**

Create `expo-games/packages/game-engine/src/Engine.tsx`:
```typescript
import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, PanResponder, useWindowDimensions } from 'react-native';
import { GameEngine as RNGameEngine } from 'react-native-game-engine';
import { SkiaRenderer } from './renderer';
import { TouchSystem } from './systems';
import { AnimationSystem } from './systems/AnimationSystem';
import { AudioManager } from './systems/AudioSystem';
import { GameEntity } from './entities';

export interface GameState {
  entities: Record<string, GameEntity>;
}

export type UpdateFunction = (
  state: GameState,
  deltaTime: number
) => GameState;

interface EngineProps {
  initialEntities: Record<string, GameEntity>;
  update: UpdateFunction;
  backgroundColor?: string;
  onReady?: () => void;
}

export function Engine({
  initialEntities,
  update,
  backgroundColor = '#000000',
  onReady,
}: EngineProps) {
  const { width, height } = useWindowDimensions();
  const entitiesRef = useRef(initialEntities);
  const lastTimeRef = useRef(Date.now());

  // Initialize audio on mount
  useEffect(() => {
    AudioManager.initialize();
    onReady?.();
    return () => {
      AudioManager.cleanup();
    };
  }, []);

  // Create pan responder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchStart(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchMove(locationX, locationY);
      },
      onPanResponderRelease: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        TouchSystem.handleTouchEnd(locationX, locationY);
      },
    })
  ).current;

  // Game loop system for RNGE
  const gameLoopSystem = useCallback((
    entities: Record<string, GameEntity>,
    { time }: { time: { delta: number } }
  ) => {
    const deltaTime = time.delta;

    // Update animations
    AnimationSystem.update(entities, deltaTime);

    // Call user update function
    const newState = update({ entities }, deltaTime);

    return newState.entities;
  }, [update]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <RNGameEngine
        style={[styles.engine, { width, height }]}
        systems={[gameLoopSystem]}
        entities={entitiesRef.current}
        running={true}
        renderer={(entities: Record<string, GameEntity>) => (
          <SkiaRenderer
            entities={entities}
            backgroundColor={backgroundColor}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  engine: {
    flex: 1,
  },
});
```

**Step 2: Update main index**

Add to `expo-games/packages/game-engine/src/index.ts`:
```typescript
// Engine
export { Engine, GameState, UpdateFunction } from './Engine';
```

**Step 3: Commit**

```bash
git add expo-games/packages/game-engine/src/
git commit -m "feat: add main Engine component with game loop"
```

---

## Phase 4: Template App

### Task 4.1: Create Template Expo App

**Files:**
- Create: `expo-games/apps/template/package.json`
- Create: `expo-games/apps/template/app.json`
- Create: `expo-games/apps/template/tsconfig.json`
- Create: `expo-games/apps/template/App.tsx`

**Step 1: Create package.json**

Create `expo-games/apps/template/package.json`:
```json
{
  "name": "game-template",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "ios": "expo run:ios",
    "android": "expo run:android"
  },
  "dependencies": {
    "@expo-games/game-engine": "*",
    "@shopify/react-native-skia": "^0.1.0",
    "expo": "~50.0.0",
    "expo-av": "~13.0.0",
    "expo-haptics": "~12.0.0",
    "expo-router": "~3.4.0",
    "expo-status-bar": "~1.11.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-game-engine": "^1.2.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-safe-area-context": "4.8.2"
  },
  "devDependencies": {
    "@types/react": "~18.2.0",
    "typescript": "^5.3.0"
  }
}
```

**Step 2: Create app.json**

Create `expo-games/apps/template/app.json`:
```json
{
  "expo": {
    "name": "Game Template",
    "slug": "game-template",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.gametemplate",
      "requireFullScreen": true,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "plugins": [
      "expo-router",
      "expo-av",
      "expo-haptics"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "scheme": "gametemplate"
  }
}
```

**Step 3: Create tsconfig.json**

Create `expo-games/apps/template/tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

**Step 4: Create App.tsx**

Create `expo-games/apps/template/App.tsx`:
```typescript
import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Engine,
  GameState,
  createSprite,
  createText,
  Vector2,
  Color,
  TouchSystem,
  HapticManager,
} from '@expo-games/game-engine';

// Create initial game entities
function createInitialEntities() {
  return {
    background: createSprite('background', {
      position: new Vector2(200, 400),
      width: 400,
      height: 800,
      color: new Color(0.1, 0.1, 0.15),
    }),
    player: createSprite('player', {
      position: new Vector2(200, 600),
      width: 80,
      height: 80,
      color: Color.cyan,
      cornerRadius: 16,
    }),
    title: createText('title', 'Game Template', {
      position: new Vector2(200, 100),
      fontSize: 48,
      color: Color.white,
      align: 'center',
    }),
    instructions: createText('instructions', 'Tap anywhere to move', {
      position: new Vector2(200, 160),
      fontSize: 24,
      color: Color.gray,
      align: 'center',
    }),
  };
}

export default function App() {
  const [entities] = useState(createInitialEntities);

  // Set up touch handling
  React.useEffect(() => {
    const unsubscribe = TouchSystem.onGesture((event) => {
      if (event.type === 'tap') {
        const player = entities.player;
        player.position = event.position;
        HapticManager.impact('light');
      }
    });
    return unsubscribe;
  }, [entities]);

  // Game update function
  const update = useCallback((state: GameState, deltaTime: number): GameState => {
    // Add game logic here
    return state;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Engine
        initialEntities={entities}
        update={update}
        backgroundColor="#000000"
      />
    </SafeAreaProvider>
  );
}
```

**Step 5: Create placeholder assets**

```bash
mkdir -p expo-games/apps/template/assets
# Create placeholder icon (1024x1024 would be proper, but we'll note it)
echo "Placeholder - replace with 1024x1024 PNG" > expo-games/apps/template/assets/icon.txt
echo "Placeholder - replace with splash PNG" > expo-games/apps/template/assets/splash.txt
```

**Step 6: Commit**

```bash
git add expo-games/apps/template/
git commit -m "feat: add template Expo game app"
```

---

## Phase 5: Update Chad Command

### Task 5.1: Update /chad Command for Expo

**Files:**
- Modify: `.claude/commands/chad.md`

**Step 1: Update chad.md**

This is a large file modification. Replace the NEW GAME FLOW section (around lines 314-351) with Expo-based flow. Key changes:

1. New game creates `expo-games/apps/[game-name]/` instead of `preview/game.js`
2. Starts Expo dev server instead of browser preview
3. Uses iOS Simulator for screenshots instead of Puppeteer
4. Shows QR code for Expo Go

**The full updated chad.md is too long to include here. The key sections to modify are:**

- Line ~320: Change `preview/game.js` references to `expo-games/apps/[game-name]/src/Game.tsx`
- Line ~350: Change screenshot capture to use `mcp__XcodeBuildMCP__screenshot`
- Line ~470: Change CONTINUE PROJECT FLOW similarly
- Add new section for QR code display after dev server starts

**Step 2: Commit**

```bash
git add .claude/commands/chad.md
git commit -m "feat: update /chad command for Expo workflow"
```

---

## Phase 6: Build & Submit Commands

### Task 6.1: Create /build Command

**Files:**
- Create: `.claude/commands/build.md`

**Step 1: Create build.md**

Create `.claude/commands/build.md`:
```markdown
# Build for App Store

Build the current game for App Store submission using EAS Build.

## Usage

```
/build
```

## What This Does

1. Identifies the current game project from `expo-games/apps/`
2. Verifies all required assets exist (icon, splash, app.json metadata)
3. Runs `eas build --platform ios --profile production`
4. Waits for build completion (~10-15 minutes)
5. Provides download link for .ipa file

## Prerequisites

- EAS CLI installed: `npm install -g eas-cli`
- Logged into EAS: `eas login`
- Apple Developer credentials configured: `eas credentials`

## Build Profiles

The default `eas.json` includes:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## Steps

### Step 1: Identify Project

```bash
# Find current game
ls expo-games/apps/
```

Ask user which game to build if multiple exist.

### Step 2: Verify Assets

Check these files exist:
- `expo-games/apps/[game]/assets/icon.png` (1024x1024)
- `expo-games/apps/[game]/assets/splash.png`
- `expo-games/apps/[game]/app.json` with valid bundleIdentifier

### Step 3: Run Build

```bash
cd expo-games/apps/[game]
eas build --platform ios --profile production --non-interactive
```

### Step 4: Report Status

```
═══════════════════════════════════════════════════════════════
█ BUILD STARTED
═══════════════════════════════════════════════════════════════

Game: [game-name]
Platform: iOS
Profile: production

Build URL: https://expo.dev/accounts/[account]/builds/[id]

The build typically takes 10-15 minutes.
You'll receive a notification when complete.

When ready, run /submit to publish to App Store Connect.
═══════════════════════════════════════════════════════════════
```
```

**Step 2: Commit**

```bash
git add .claude/commands/build.md
git commit -m "feat: add /build command for EAS builds"
```

---

### Task 6.2: Create /submit Command

**Files:**
- Create: `.claude/commands/submit.md`

**Step 1: Create submit.md**

Create `.claude/commands/submit.md`:
```markdown
# Submit to App Store

Submit the latest build to App Store Connect for review.

## Usage

```
/submit
```

## What This Does

1. Finds the latest successful production build
2. Submits it to App Store Connect
3. Provides link to review in App Store Connect

## Prerequisites

- Completed production build (run `/build` first)
- Apple Developer credentials configured in EAS

## Steps

### Step 1: Identify Latest Build

```bash
cd expo-games/apps/[game]
eas build:list --platform ios --status finished --limit 1
```

### Step 2: Submit to App Store

```bash
eas submit --platform ios --latest
```

### Step 3: Report Status

```
═══════════════════════════════════════════════════════════════
█ SUBMITTED TO APP STORE CONNECT
═══════════════════════════════════════════════════════════════

Game: [game-name]
Version: [version]

Next Steps:
1. Open App Store Connect: https://appstoreconnect.apple.com
2. Navigate to your app
3. Complete App Information (description, keywords, screenshots)
4. Submit for Review

Apple review typically takes 1-2 days.
═══════════════════════════════════════════════════════════════
```

## App Store Checklist

Before submitting for review, ensure you have:

- [ ] App description (store/description.txt)
- [ ] Keywords (store/keywords.txt)
- [ ] Screenshots for required device sizes
- [ ] Privacy policy URL
- [ ] App category selected
- [ ] Age rating completed
```

**Step 2: Commit**

```bash
git add .claude/commands/submit.md
git commit -m "feat: add /submit command for App Store submission"
```

---

## Phase 7: Cleanup Old Preview System

### Task 7.1: Archive Old Preview Files

**Files:**
- Move: `preview/` → `archive/browser-preview/`

**Step 1: Archive old preview**

```bash
mkdir -p archive
mv preview archive/browser-preview
git add -A
git commit -m "chore: archive old browser preview system"
```

---

## Phase 8: Documentation

### Task 8.1: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md**

Update the Quick Start, Available Commands, and Directory Structure sections to reflect the new Expo-based workflow.

Key changes:
- Remove references to `preview/`
- Add `expo-games/` structure
- Update commands table
- Update MCP tools section for simulator usage

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for Expo workflow"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `yarn install` works in `expo-games/`
- [ ] `expo start` works in `expo-games/apps/template/`
- [ ] Game renders in Expo Go on physical device
- [ ] Touch events work
- [ ] Haptics trigger on device
- [ ] `/chad` creates new Expo games
- [ ] `/build` starts EAS build
- [ ] `/submit` submits to App Store Connect
