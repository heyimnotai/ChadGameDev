import type { SpriteEntity } from './SpriteEntity';
import type { TextEntity } from './TextEntity';
import type { CircleEntity } from './CircleEntity';

export type { BaseEntity } from './Entity';
export { createBaseEntity } from './Entity';
export type { SpriteEntity } from './SpriteEntity';
export { createSprite } from './SpriteEntity';
export type { TextEntity } from './TextEntity';
export { createText } from './TextEntity';
export type { CircleEntity } from './CircleEntity';
export { createCircle } from './CircleEntity';

export type GameEntity = SpriteEntity | TextEntity | CircleEntity;
