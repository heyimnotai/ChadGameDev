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
