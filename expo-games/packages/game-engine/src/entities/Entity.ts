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
