type DiagramConfig = {
  widthPx: number;
  heightPx: number;
  x: number;
  y: number;
  stepX: number;
  stepY: number;
  xOffset: number;
  yOffset: number;
}

type GetSingleDimensionalCoordFunction = (coord: number, captionAdjustmentPx?: number) => number;
type GetTwoDimensionalCoordFunction = (coord: [number, number], captionAdjustmentPx?: number) => [number, number];

export type Diagram = {
  getX: GetSingleDimensionalCoordFunction;
  getY: GetSingleDimensionalCoordFunction;
  getXY: GetTwoDimensionalCoordFunction;
  widthPx: number;
  heightPx: number;
  xOffset: number;
  yOffset: number;
  stepX: number;
  stepY: number;
  totalStepsX: number;
  totalStepsY: number;
  x: number;
  y: number;
}

export function useDiagram({ 
  widthPx,
  heightPx,
  x,
  y,
  stepX,
  stepY,
  xOffset,
  yOffset,
}: DiagramConfig): Diagram {
  const totalStepsX = stepX ? Math.abs(Math.floor(x / stepX)) : 1;
  const totalStepsY = stepY ? Math.abs(Math.floor(y / stepY)) : 1;

  const getX: GetSingleDimensionalCoordFunction = (desiredX, captionAdjustmentPx = 0) => {
    desiredX = desiredX / stepX;

    if (Math.abs(desiredX) > x) return getX(x, captionAdjustmentPx);
    return (widthPx - yOffset * 2) / totalStepsX * Math.abs(desiredX) + yOffset - captionAdjustmentPx;
  }

  const getY: GetSingleDimensionalCoordFunction = (desiredY, captionAdjustmentPx = 0) => {
    desiredY = desiredY / stepY;

    const begin = heightPx - xOffset;
    const end = xOffset;
    const stepSize = (begin - end) / totalStepsY;
  
    if (Math.abs(desiredY) > y) return end;

    return begin - (stepSize * Math.abs(desiredY)) + captionAdjustmentPx;
  }

  const getXY: GetTwoDimensionalCoordFunction = ([desiredX, desiredY], captionAdjustmentPx = 0) => {
    return [getX(desiredX, captionAdjustmentPx), getY(desiredY, captionAdjustmentPx)];
  }

  return {
    getX,
    getY,
    getXY,
    widthPx,
    heightPx,
    xOffset,
    yOffset,
    stepX,
    stepY,
    totalStepsX,
    totalStepsY,
    x,
    y,
  };
}