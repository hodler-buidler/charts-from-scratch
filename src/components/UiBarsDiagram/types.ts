import * as CSS from 'csstype';

export type Bar = {
  key?: string;
  value?: number;
  color?: CSS.Property.Color;
  borderColor?: CSS.Property.Color;
  borderThickness?: CSS.Property.StrokeWidth;
}

export type OnBarValueChangedEventFunction = (key: string, value: number) => void;

export type GenerateBarsFunction = (baseBarsState: Bar[] | number, maxAmount?: number) => Required<Bar>[];