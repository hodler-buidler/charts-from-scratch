import { FC } from 'react';
import * as CSS from 'csstype';
import { Diagram } from '../../hooks';

export interface NotationProps {
  direction: 'x' | 'y';
  diagram: Diagram;
  barWidthPx: number;
  notableStepSize: number;
  hideLevelLine: boolean;
  captionFontSizePx: number;
  hideNoNotableCaptions: boolean;
  color: CSS.Property.Color;
  levelLineColor: CSS.Property.Color;
  textColor: CSS.Property.Color;
};

const Notation: FC<NotationProps> = ({
  direction,
  diagram,
  barWidthPx,
  notableStepSize,
  hideLevelLine,
  captionFontSizePx,
  hideNoNotableCaptions,
  color,
  levelLineColor,
  textColor,
}) => {
  const xNotation = (index: number) => {
    const coordNumber = (index + 1) * diagram.stepX;
    const baseXCoord = diagram.getX(coordNumber);

    return {
      bar: {
        x1: baseXCoord,
        x2: baseXCoord,
        y1: diagram.getY(0),
        y2: diagram.getY(0) + barWidthPx,
      },
      levelLine: {
        x1: baseXCoord,
        x2: baseXCoord,
        y1: diagram.getY(diagram.y),
        y2: diagram.getY(0),
      },
      text: {
        x: baseXCoord,
        y: diagram.getY(0) + barWidthPx + captionFontSizePx,
        anchor: 'middle',
      },
    }
  }

  const yNotation = (index: number) => {
    const textOffsetFromBarPx = 4;
    const coordNumber = (index + 1) * diagram.stepY;
    const baseYCoord = diagram.getY(coordNumber);

    return {
      bar: {
        x1: diagram.getX(0) - barWidthPx,
        x2: diagram.getX(0),
        y1: baseYCoord,
        y2: baseYCoord,
      },
      levelLine: {
        x1: diagram.getX(0),
        x2: diagram.getX(diagram.x),
        y1: baseYCoord,
        y2: baseYCoord,
      },
      text: {
        x: diagram.getX(0) - barWidthPx - textOffsetFromBarPx,
        y: diagram.getY(coordNumber, captionFontSizePx / 3),
        anchor: 'end',
      },
    }
  }

  const max = direction === 'x' ? diagram.x : diagram.y;
  const totalSteps = direction === 'x' ? diagram.totalStepsX : diagram.totalStepsY;
  const stepsArray = Array.from(Array(totalSteps).keys());
  const step = direction === 'x' ? diagram.stepX : diagram.stepY;
  const getNotation = direction === 'x' ? xNotation : yNotation;

  const stepsElements = stepsArray.map((_, index) => {
    const notation = getNotation(index);
    const coordNumber = step * (index + 1) * (max / Math.abs(max));
    const isNotable = coordNumber % notableStepSize === 0;

    return (
      <g key={`${direction}-step-element__${index}`}>
        <line
          x1={notation.bar.x1}
          x2={notation.bar.x2}
          y1={notation.bar.y1}
          y2={notation.bar.y2}
          stroke={color}
        />

        { isNotable && !hideLevelLine &&
          <line
            x1={notation.levelLine.x1} 
            x2={notation.levelLine.x2}
            y1={notation.levelLine.y1}
            y2={notation.levelLine.y2}
            stroke={levelLineColor}
          />
        }

        { (isNotable || !hideNoNotableCaptions) &&
          <text
            x={notation.text.x}
            y={notation.text.y}
            textAnchor={notation.text.anchor}
            fill={textColor}
            style={{fontSize: `${captionFontSizePx}px`}}
          >
            { coordNumber }
          </text>
        }
      </g>
    );
  });

  return <>{stepsElements}</>;
}

export default Notation;