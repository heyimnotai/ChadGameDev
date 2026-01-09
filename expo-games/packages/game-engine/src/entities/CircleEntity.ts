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
