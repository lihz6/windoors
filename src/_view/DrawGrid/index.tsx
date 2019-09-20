/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/6/2019, 5:31:08 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import React, { ReactNode, ReactEventHandler } from 'react';
// import { Link } from 'react-router-dom';
// import { Icon } from 'antd';
// import chunk from 'lodash/chunk';
import zip from 'lodash/zip';
import { tree, divmod } from '_util';
import DrawGridSub from '../DrawGridSub';
import './style.scss';

export interface DrawGridProps {
  squared: number;
  disabled: boolean;
  onDone(column: number, area: number[]): void;
}

interface DrawGridState {
  ondown: boolean;
  start: number;
  end: number;
  area: number[];
}

export default class DrawGrid extends React.PureComponent<
  DrawGridProps,
  DrawGridState
> {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.state = {
      ondown: false,
      start: -1,
      end: -1,
      area: [],
    };
  }
  onMouseUp = () => {
    if (!this.state.ondown) return;
    this.setState(({ start, end, ondown }) => {
      if (!ondown) return null;
      const { squared } = this.props;
      const erc = divmod(end, squared);
      const src = divmod(start, squared);
      const [row, col] = zip(erc, src).map(([e, s]) => e! - s! + 1);
      return {
        area: Array.from({ length: row * col }).map((_, index) => index),
        ondown: false,
      };
    });
  };
  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  children(): [React.ReactChild | null, number[]] {
    const { squared, disabled, onDone } = this.props;
    const { start, end, ondown, area } = this.state;
    if (disabled || start < 0 || end < 0 || ondown) {
      const indices = Array.from({ length: squared * squared }).map(
        (_, index) => index
      );
      return [null, indices];
    }
    const erc = divmod(end, squared, 1);
    const src = divmod(start, squared);
    const [row, col] = zip(erc, src).map(([e, s]) => e! - s!);
    const elem = (
      <DrawGridSub
        setArea={this.setState}
        startrc={src}
        endrc={erc}
        area={area}>
        <div
          title="移动"
          className="draw-grid-move"
          onMouseDown={() => {
            this.setState({ ondown: true });
          }}
        />
        <div
          title="完成"
          className="draw-grid-okay"
          onMouseDown={() => {
            onDone(col, area);
          }}
        />
      </DrawGridSub>
    );
    const indices = Array.from({ length: squared * squared - row * col }).map(
      (_, index) => {
        if (index < start) return index;
        const floor = Math.floor((index - start) / (squared - col));
        return index + Math.min(floor + 1, row) * col;
      }
    );
    return [elem, indices];
  }
  isSelected(index: number): boolean {
    const { start, end } = this.state;
    const { squared } = this.props;
    const min = start;
    const max = end;
    return (
      index >= min &&
      index <= max &&
      index % squared >= min % squared &&
      index % squared <= max % squared
    );
  }
  onMouseEnter = (index: number) => {
    // Step 2
    const { squared } = this.props;
    const { start, ondown } = this.state;
    if (
      ondown &&
      zip(divmod(index, squared), divmod(start, squared)).every(
        ([e, s]) => e! >= s!
      )
    ) {
      this.setState({ end: index });
    }
  };
  onMouseDown = (index: number) => {
    // Step 1
    if (this.props.disabled) return;
    this.setState({ ondown: true, start: index, end: index });
  };
  render() {
    const { squared, disabled } = this.props;
    const [elem, indices] = this.children();
    return (
      <div
        className={tree({ 'draw-grid-main': { disabled } })}
        style={{
          gridTemplateColumns: `repeat(${squared}, 1fr)`,
          gridTemplateRows: `repeat(${squared}, 1fr)`,
        }}>
        {elem}
        {indices.map(index => (
          <div
            key={index + 1}
            className={tree({
              'draw-grid-item': { selected: this.isSelected(index) },
            })}
            onMouseEnter={() => this.onMouseEnter(index)}
            onMouseDown={() => this.onMouseDown(index)}
          />
        ))}
      </div>
    );
  }
}

export function inSquared(
  idx: number,
  start: number,
  end: number,
  squared: number
) {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  return (
    idx >= min &&
    idx <= max &&
    idx % squared >= min % squared &&
    idx % squared <= max % squared
  );
}
