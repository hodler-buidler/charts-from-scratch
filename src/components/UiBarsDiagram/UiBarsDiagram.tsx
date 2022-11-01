import { FC, useState } from 'react';
import * as CSS from 'csstype';
import CoordinateSystem from '../CoordinateSystem/CoordinateSystem';
import { Bar, OnBarValueChangedEventFunction } from './types';
import { useBarsGenerator, useTwoWayDataChangeSupport } from './hooks'; 
import BarsDisplay from './components/BarsDisplay/BarsDisplay';

export interface UiBarsDiagramProps {
  bars: Bar[] | number;
  defaultBarValue?: number;
  defaultBarColor?: CSS.Property.Color;
  defaultBarBorderColor?: CSS.Property.Color;
  defaultBarBorderThickness?: CSS.Property.StrokeWidth;
  barGapPercentage?: number;
  widthPx?: number;
  heightPx?: number;
  readOnly?: boolean;
  hideDragLevelLine?: boolean;
  dragLevelLineColor?: CSS.Property.Color;
  dragLevelLineFontSizePx?: number;
  dragLevelLineCaptionColor?: CSS.Property.Color;
  dragLevelLineCaptionOffsetPx?: number;
  max?: number;
  step?: number;
  notableStep?: number;
  showNoNotableCaptions?: boolean;
  levelLineColor?: CSS.Property.Color;
  notationOffsetPx?: number;
  notationBarWidthPx?: number;
  captionFontSizePx?: number;
  thickness?: CSS.Property.StrokeWidth;
  axisColor?: CSS.Property.Color;
  captionColor?: CSS.Property.Color;
  markerSizePx?: number;
  markerColor?: CSS.Property.Color;
  markerBorderColor?: CSS.Property.Color;
  markerBorderThickness?: CSS.Property.Color;
  onBarValueChanged?: OnBarValueChangedEventFunction;
};

const UiBarsDiagram: FC<UiBarsDiagramProps> = ({
  bars,
  defaultBarValue = 0,
  defaultBarColor = '#3498DB',
  defaultBarBorderColor = '#000000',
  defaultBarBorderThickness = '1px',
  barGapPercentage = 0.2,
  widthPx = 500,
  heightPx = 500,
  readOnly = false,
  hideDragLevelLine = false,
  dragLevelLineColor = '#000000',
  dragLevelLineFontSizePx = 12,
  dragLevelLineCaptionColor = '#000000',
  dragLevelLineCaptionOffsetPx = 6,
  max = 10,
  step = 1,
  notableStep = 1,
  showNoNotableCaptions = false,
  levelLineColor = '#cccccc',
  notationOffsetPx = 32,
  notationBarWidthPx = 12,
  captionFontSizePx = 12,
  thickness = '2px',
  axisColor = '#000000',
  captionColor = '#000000',
  markerSizePx = 12,
  markerColor = '#ffffff',
  markerBorderColor = '#000000',
  markerBorderThickness = '1px',
  onBarValueChanged = () => {},
}) => {
  const X_AXIS_MAX = 100;

  const generateBars = useBarsGenerator({
    defaultBarValue,
    defaultBarColor,
    defaultBarBorderColor,
    defaultBarBorderThickness,
  });

  const [internalBars, setInternalBars] = useState(generateBars(bars));

  useTwoWayDataChangeSupport({
    barsProp: bars,
    internalBars,
    setInternalBars,
    generateBars,
    onBarValueChanged,
  });

  function changeValue(key: string, value: number): void {
    const internalBarsCopy = [...internalBars];
    const targetBarIdx = internalBarsCopy.findIndex(bar => bar.key === key);

    if (targetBarIdx !== -1) {
      const targetBar = internalBarsCopy[targetBarIdx];

      internalBarsCopy.splice(targetBarIdx, 1, {
        ...targetBar,
        value,
      });

      setInternalBars(internalBarsCopy);
    }
  }

  function handleDragUp(bar: Required<Bar>): void {
    if (bar.value < max) {
      changeValue(bar.key, bar.value + step)
    }
  }

  function handleDragDown(bar: Required<Bar>): void {
    if (bar.value > 0) {
      let finalValue = bar.value - step;
      if (bar.value > max) finalValue = max - step;
      changeValue(bar.key, finalValue);
    }
  }

  return (
    <CoordinateSystem
      widthPx={widthPx}
      heightPx={heightPx}
      x={X_AXIS_MAX}
      y={max}
      stepY={step}
      notableYStepSize={notableStep}
      hideXNotation
      hideNoNotableCaptions={!showNoNotableCaptions}
      levelLineYColor={levelLineColor}
      yNotationOffsetPx={notationOffsetPx}
      yNotationBarWidthPx={notationBarWidthPx}
      captionFontSizePx={captionFontSizePx}
      thickness={thickness}
      axisColor={axisColor}
      captionColor={captionColor}
      render={(diagram) => { return (
        <BarsDisplay
          diagram={diagram}
          allowDrag={!readOnly}
          bars={internalBars}
          xMax={X_AXIS_MAX}
          gapPercentage={barGapPercentage}
          showDragLevelLine={!hideDragLevelLine}
          dragLevelLineColor={dragLevelLineColor}
          dragLevelLineFontSizePx={dragLevelLineFontSizePx}
          dragLevelLineCaptionColor={dragLevelLineCaptionColor}
          dragLevelLineCaptionOffsetPx={dragLevelLineCaptionOffsetPx}
          markerSizePx={markerSizePx}
          markerColor={markerColor}
          markerBorderColor={markerBorderColor}
          markerBorderThickness={markerBorderThickness}
          onDragUp={handleDragUp}
          onDragDown={handleDragDown}
        />
      )}}
    />
  );
}

export default UiBarsDiagram;