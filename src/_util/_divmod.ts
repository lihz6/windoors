export default function(x: number, y: number): [number, number] {
  return [Math.floor(x / y), x % y];
}
