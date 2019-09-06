import { useState, useEffect, RefObject } from 'react';
import { NodeMain } from './struct';

export default function(main: NodeMain, canvas: RefObject<HTMLDivElement>) {
  const [scale, setScale] = useState(0.618);
  const [minScale, _setMinScale] = useState(0);
  const [maxScale, _setMaxScale] = useState(1);
  const [offset, setOffset] = useState<[number, number]>([0, 0]);
  const scaleOffset = ({ offsetHeight, offsetWidth }: HTMLDivElement) => {
    const hmin = (offsetHeight / main.height) * 96;
    const wmin = (offsetWidth / main.width) * 96;
    const minScale = Math.ceil(Math.min(hmin, wmin));
    const maxScale = Math.floor(Math.max(hmin, wmin));
    _setMinScale(minScale);
    _setMaxScale(maxScale);
    setScale(minScale);
    setOffset([
      (offsetWidth - main.width) / 2,
      // (offsetHeight - main.height) / 2,
      0,
    ]);
    return [minScale, maxScale];
  };
  const _setScale = (minaxScale: number) => {
    if (canvas.current) {
      setScale(minaxScale);
      canvas.current.scrollTo({
        top: (main.height - canvas.current.offsetHeight) / 2,
      });
    }
  };
  useEffect(() => {
    if (!canvas.current) return;
    const elem = canvas.current;
    const [minScale] = scaleOffset(elem);
    _setScale(minScale);
    const onResize = () => {
      const [minScale, maxScale] = scaleOffset(elem);
      _setMinScale(minScale);
      _setMaxScale(maxScale);
      setScale(scale => {
        if (scale < minScale) {
          elem.scrollTo({
            top: (main.height - elem.offsetHeight) / 2,
          });
          return minScale;
        } else if (scale > maxScale) {
          elem.scrollTo({
            top: 0,
          });
          return maxScale;
        } else {
          return scale;
        }
      });
    };
    // @ts-ignore
    if (ResizeObserver) {
      // @ts-ignore
      const observer = new ResizeObserver(onResize);
      observer.observe(elem);
      return () => observer.unobserve(elem);
    } else {
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [canvas.current]);
  return {
    offset,
    minScale,
    maxScale,
    scale,
    setScale,
    setMinScale() {
      _setScale(minScale);
    },
    setMaxScale() {
      _setScale(maxScale);
    },
  };
}
