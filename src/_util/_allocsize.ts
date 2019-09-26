export default function allocsize(
  sizeAll: number,
  growAll: number
): (grow: number) => number {
  const partion = sizeAll / (growAll || 1);
  let floor = false;
  const whole = (size: number) => {
    if ((floor = !floor)) {
      return Math.floor(size);
    }
    return Math.ceil(size);
  };
  return grow => {
    if (grow <= 0) {
      return 0;
    }
    if ((growAll -= grow) === 0) {
      return sizeAll;
    }
    if (growAll > 0) {
      const size = whole(grow * partion);
      sizeAll -= size;
      return size;
    }
    throw 'No size to alloc anymore!';
  };
}
