import React, { useEffect } from 'react';
import { Bar, OnBarValueChangedEventFunction, GenerateBarsFunction } from '../types';
import { usePrevious } from '../../../hooks';

type SupportConfig = {
  barsProp: Bar[] | number;
  internalBars: Required<Bar>[];
  setInternalBars: React.Dispatch<React.SetStateAction<Required<Bar>[]>>;
  generateBars: GenerateBarsFunction;
  onBarValueChanged: OnBarValueChangedEventFunction;
}

export function useTwoWayDataChangeSupport({
  barsProp,
  internalBars,
  setInternalBars,
  generateBars,
  onBarValueChanged,
}: SupportConfig): void {
  const prevBarsPropValue = usePrevious(barsProp);
  const prevInternalBarsValue = usePrevious(internalBars);

  useEffect(() => {
    if (typeof prevBarsPropValue === 'number' && typeof barsProp === 'number') {
      preserveStateOnNumberToNumberBarsPropChange();
    } else {
      setInternalBars(generateBars(barsProp));
    }
  }, [barsProp, prevBarsPropValue]);

  useEffect(() => {
    notifyInternalBarsUpdates();
  }, [internalBars, prevInternalBarsValue]);

  function preserveStateOnNumberToNumberBarsPropChange(): void {
    const existingBars = generateBars(internalBars, barsProp as number);
    const numNeededAdditionalBars = (barsProp as number) - (prevBarsPropValue as number);
    let additionalBars: Required<Bar>[] = [];
      
    if (numNeededAdditionalBars > 0) {
      additionalBars = generateBars(numNeededAdditionalBars).map((bar, index) => ({
        ...bar,
        key: String(existingBars.length + index),
      }));
    }

    setInternalBars([
      ...existingBars,
      ...additionalBars,
    ]);
  }

  function notifyInternalBarsUpdates(): void {
    const prevValuesMap: Record<string, number> = {};
    prevInternalBarsValue.forEach(bar => {
      prevValuesMap[bar.key] = bar.value;
    })

    internalBars.forEach(bar => {
      const prevValue = prevValuesMap[bar.key];
      const currentValue = bar.value;

      if (prevValue !== currentValue) {
        onBarValueChanged(bar.key, currentValue);
      }
    });
  }
}