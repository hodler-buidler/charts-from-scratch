import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import * as CSS from 'csstype';
import Notation from './components/Notation/Notation';
import { useDiagram, Diagram } from './hooks';

export type RenderFunction = (diagram: Diagram) => ReactNode;

export interface CoordinateSystemProps {
  widthPx: number;
  heightPx:  number;
  render?: (diagram: Diagram) => ReactNode;
  x?: number;
  y?: number;
  hideXNotation?: boolean;
  hideYNotation?: boolean;
  stepX?: number;
  stepY?: number;
  notableXStepSize?: number;
  notableYStepSize?: number;
  levelLineXColor?: CSS.Property.Color;
  levelLineYColor?: CSS.Property.Color;
  hideXLevelLine?: boolean;
  hideYLevelLine?: boolean;
  xNotationOffsetPx?: number;
  yNotationOffsetPx?: number;
  xNotationBarWidthPx?: number;
  yNotationBarWidthPx?: number;
  hideNoNotableCaptions?: boolean;
  captionFontSizePx?: number;
  thickness?: CSS.Property.StrokeWidth;
  axisColor?: CSS.Property.Color;
  captionColor?: CSS.Property.Color;
};

const CoordinateSystem: FC<CoordinateSystemProps> = ({
  widthPx,
  heightPx,
  render,
  x = 10,
  y = 10,
  hideXNotation = false,
  hideYNotation = false,
  stepX = 1,
  stepY = 1,
  notableXStepSize = 1,
  notableYStepSize = 1,
  levelLineXColor = '#cccccc',
  levelLineYColor = '#cccccc',
  hideXLevelLine = false,
  hideYLevelLine = false,
  xNotationOffsetPx = 36,
  yNotationOffsetPx = 36,
  xNotationBarWidthPx = 12,
  yNotationBarWidthPx = 12,
  captionFontSizePx = 12,
  hideNoNotableCaptions = false,
  thickness = '2px',
  axisColor = '#000000',
  captionColor = '#000000',
}) => {
  const MIN_OFFSET_PX = 8;
  const xOffset = xNotationOffsetPx < MIN_OFFSET_PX || hideXNotation ? MIN_OFFSET_PX : xNotationOffsetPx;
  const yOffset = yNotationOffsetPx < MIN_OFFSET_PX || hideYNotation ? MIN_OFFSET_PX : yNotationOffsetPx;

  const diagram = useDiagram({
    widthPx,
    heightPx,
    x,
    y,
    stepX,
    stepY,
    xOffset,
    yOffset,
  });

  return (
    <WrapperStyled
      widthPx={widthPx}
      heightPx={heightPx}
    >
      <Axis color={axisColor} thickness={thickness}>
        <line
          x1={yOffset} 
          x2={widthPx - yOffset}
          y1={heightPx - xOffset}
          y2={heightPx - xOffset}
        />
      </Axis>
      <Axis color={axisColor} thickness={thickness}>
        <line
          x1={yOffset}
          x2={yOffset}
          y1={xOffset}
          y2={heightPx - xOffset + 1}
        />
      </Axis>

      {!hideXNotation &&
        <Notation
          direction="x"
          diagram={diagram}
          barWidthPx={xNotationBarWidthPx}
          notableStepSize={notableXStepSize}
          hideLevelLine={hideXLevelLine}
          captionFontSizePx={captionFontSizePx}
          hideNoNotableCaptions={hideNoNotableCaptions}
          color={axisColor}
          levelLineColor={levelLineXColor}
          textColor={captionColor}
        />
      }

      {!hideYNotation &&
        <Notation
          direction="y"
          diagram={diagram}
          barWidthPx={yNotationBarWidthPx}
          notableStepSize={notableYStepSize}
          hideLevelLine={hideYLevelLine}
          captionFontSizePx={captionFontSizePx}
          hideNoNotableCaptions={hideNoNotableCaptions}
          color={axisColor}
          levelLineColor={levelLineYColor}
          textColor={captionColor}
        />
      }

      { render && render(diagram) }
    </WrapperStyled>
  );
}

const WrapperStyled = styled.svg<{ 
  widthPx: number;
  heightPx: number;
}>`
  user-select: none;
  ${({ widthPx, heightPx }) => `
    width: ${widthPx}px;
    height: ${heightPx}px;
  `}
`;

const Axis = styled.g<{
  color: CSS.Property.Color,
  thickness: CSS.Property.StrokeWidth,
}>`
  stroke-dasharray: 0;

  ${({ color, thickness }) => `
    stroke: ${color};
    stroke-width: ${thickness};
  `}
`;

export default CoordinateSystem;