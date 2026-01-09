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
  const font = useFont(null, entity.fontSize);

  if (entity.hidden || !font) return null;

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

  const hasStroke = entity.strokeColor && entity.strokeWidth && entity.strokeWidth > 0;

  return (
    <>
      <Circle
        cx={entity.position.x}
        cy={entity.position.y}
        r={entity.radius * entity.scale.x}
        color={entity.color.toSkiaColor()}
        opacity={entity.alpha}
      />
      {hasStroke && (
        <Circle
          cx={entity.position.x}
          cy={entity.position.y}
          r={entity.radius * entity.scale.x}
          color={entity.strokeColor!.toSkiaColor()}
          opacity={entity.alpha}
          style="stroke"
          strokeWidth={entity.strokeWidth}
        />
      )}
    </>
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
