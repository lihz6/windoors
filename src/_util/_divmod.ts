export default function(x: number, y: number, n: number = 0): [number, number] {
  return [Math.floor(x / y) + n, (x % y) + n];
}
