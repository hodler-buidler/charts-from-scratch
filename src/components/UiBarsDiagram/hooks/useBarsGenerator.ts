import * as CSS from 'csstype';
import { Bar, GenerateBarsFunction } from '../types';

type BarsGeneratorConfig = {
  defaultBarValue: number;
  defaultBarColor: CSS.Property.Color;
  defaultBarBorderColor: CSS.Property.Color;
  defaultBarBorderThickness: CSS.Property.StrokeWidth;
}

export function useBarsGenerator({
  defaultBarValue,
  defaultBarColor,
  defaultBarBorderColor,
  defaultBarBorderThickness,
}: BarsGeneratorConfig): GenerateBarsFunction {
  const generateBars: GenerateBarsFunction = (baseBarsState: Bar[] | number, maxAmount = Infinity) => {
    const barsIterable = Array.isArray(baseBarsState) ? baseBarsState : Array.from(Array(baseBarsState).keys());
    return barsIterable.map((bar, index) => {
      const barObject = typeof bar === 'object' ? bar : {};

      return {
        key: String(index),
        value: defaultBarValue,
        color: defaultBarColor,
        borderColor: defaultBarBorderColor,
        borderThickness: defaultBarBorderThickness,
        ...barObject,
      } as Required<Bar>;
    })
    .filter((item, index) => index < maxAmount);
  }

  return generateBars;
}
