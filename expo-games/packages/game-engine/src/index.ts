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
