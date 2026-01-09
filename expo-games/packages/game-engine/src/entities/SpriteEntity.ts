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
