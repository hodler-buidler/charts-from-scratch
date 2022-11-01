import { FC, useState, useEffect } from 'react';
import * as CSS from 'csstype';
import styled from 'styled-components';
import { useIsMousePressed } from '../../../../hooks';
import { Diagram } from '../../../CoordinateSystem/hooks'
import { Bar } from '../../types';

interface BarsDisplayProps {
  diagram: Diagram;
  bars: Required<Bar>[];
  xMax: number;
  gapPercentage: number;
  markerSizePx: number;
  markerColor: CSS.Property.Color;
  markerBorderColor: CSS.Property.Color;
  markerBorderThickness: CSS.Property.Color;
  allowDrag?: boolean;
  showDragLevelLine?: boolean;
  dragLevelLineColor?: CSS.Property.Color;
  dragLevelLineFontSizePx?: number;
  dragLevelLineCaptionColor?: CSS.Property.Color;
  dragLevelLineCaptionOffsetPx?: number;
  dragDistanceStepPercentage?: number;
  onDragDown?: (bar: Required<Bar>) => void;
  onDragUp?: (bar: Required<Bar>) => void;
};

const BarsDisplay: FC<BarsDisplayProps> = ({
  diagram,
  bars,
  xMax,
  gapPercentage,
  markerSizePx,
  markerColor,
  markerBorderColor,
  markerBorderThickness,
  allowDrag = true,
  showDragLevelLine = true,
  dragLevelLineColor = '#000000',
  dragLevelLineFontSizePx = 12,
  dragLevelLineCaptionColor = '#000000',
  dragLevelLineCaptionOffsetPx = 6,
  dragDistanceStepPercentage = 0.85,
  onDragDown = () => {},
  onDragUp = () => {},
}) => {
  const barWidthWithoutGaps = xMax / bars.length;
  const gapSize = barWidthWithoutGaps * gapPercentage;
  const barWidth = barWidthWithoutGaps - gapSize - (gapSize / bars.length);

  const getBarXCoord = (bar: Required<Bar>, barIdx: number) => {
    const barNumber = barIdx + 1;
    const gapsSizeBehind = barNumber * gapSize;
    const barsSizeBehind = barIdx * barWidth;

    return gapsSizeBehind + barsSizeBehind;
  }

  const [selectedDragBar, setSelectedDragBar] = useState<Required<Bar> | null>(null);
  const [lastDragMoveCoords, setLastDragMoveCoords] = useState<[number, number]>([0, 0]);
  const isMousePressed = useIsMousePressed();

  useEffect(() => {
    if (!isMousePressed) endDrag();
  }, [isMousePressed]);

  function startDrag(event: any, bar: Required<Bar>): void {
    setSelectedDragBar(bar);
    setLastDragMoveCoords([event.clientX, event.clientY]);
  }

  function endDrag(): void {
    setSelectedDragBar(null);
    setLastDragMoveCoords([0, 0]);
  }

  function drag(event: any, bar: Required<Bar>): void {
    if (selectedDragBar && selectedDragBar.key === bar.key && isMousePressed) {
      const [, prevClientY] = lastDragMoveCoords;
      const currentClientY = event.clientY;

      const minDistanceToDrag = (diagram.getY(0) - diagram.getY(diagram.stepY)) * dragDistanceStepPercentage;
      const isUp = (prevClientY - currentClientY) >= minDistanceToDrag;
      const isDown = (currentClientY - prevClientY) >= minDistanceToDrag;

      if (isUp || isDown) setLastDragMoveCoords([event.clientX, event.clientY]);

      if (isUp && allowDrag) {
        onDragUp(bar);
      }

      if (isDown && allowDrag) {
        onDragDown(bar);
      }
    }
  }

  const barsElements = bars.map((bar, barIdx) => {
    const barXCoord = diagram.getX(getBarXCoord(bar, barIdx));
    const barYCoord = diagram.getY(bar.value);
    const finalBarWidth = diagram.getX(barWidth) - diagram.getX(0);
    const finalBarHeight = diagram.getY(0) - diagram.getY(bar.value);

    const markerXCoord = barXCoord + (finalBarWidth / 2) - (markerSizePx / 2);
    const markerYCoord = barYCoord - (markerSizePx / 2);

    return (
      <g key={`bar__${bar.key}`}>
        <rect
          x={barXCoord}
          y={barYCoord}
          width={finalBarWidth}
          height={finalBarHeight}
          fill={bar.color}
          stroke={bar.borderColor}
          strokeWidth={bar.borderThickness}
        />

        <rect
          x={barXCoord}
          y={0}
          width={finalBarWidth}
          height={diagram.heightPx}
          fill="transparent"
          onMouseMove={(e) => drag(e, bar)}
        />

        { allowDrag &&
          <MarkerStyled
            x={markerXCoord}
            y={markerYCoord}
            width={markerSizePx}
            height={markerSizePx}
            fill={markerColor}
            stroke={markerBorderColor}
            strokeWidth={markerBorderThickness}
            onMouseDown={(e) => startDrag(e, bar)}
          />
        }
      </g>
    );  
  })

  const activeBar = bars.find((bar) => bar.key === selectedDragBar?.key);

  return (
    <g>
      { barsElements }

      { showDragLevelLine && activeBar && selectedDragBar &&
        <g>
          <line
            x1={diagram.getX(0)} 
            x2={diagram.getX(diagram.x)}
            y1={diagram.getY(activeBar.value)}
            y2={diagram.getY(activeBar.value)}
            stroke={dragLevelLineColor}
            strokeDasharray="4"
          />

          <text
            x={diagram.getX(diagram.x) + dragLevelLineCaptionOffsetPx}
            y={diagram.getY(activeBar.value) + dragLevelLineFontSizePx / 3}
            fill={dragLevelLineCaptionColor}
            style={{fontSize: `${dragLevelLineFontSizePx}px`}}
          >
            { activeBar.value }
          </text>
        </g>
      }
    </g>
  );
}

const MarkerStyled = styled.rect`
  cursor: pointer;
`;

export default BarsDisplay;
