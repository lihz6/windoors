import { CSSProperties } from 'react';
import chunk from 'lodash/chunk';

export function gridTemplateAreas(area: number[], column: number) {
  return chunk(area, column)
    .map(row => `"${row.map(a => `a${a}`).join(' ')}"`)
    .join(' ');
}

export function gridTemplateStyle(
  template: number[],
  column: number
): CSSProperties {
  return {
    gridTemplateRows: template
      .slice(0, column)
      .map((value, index) => (index % 2 ? `${value}px` : `${value}fr`))
      .join(' '),
    gridTemplateColumns: template
      .slice(column)
      .map((value, index) => (index % 2 ? `${value}px` : `${value}fr`))
      .join(' '),
  };
}
