export function keyOf<T, K extends Extract<keyof T, string>>(
  map: T,
  val: T[K]
): K {
  for (const key in map) {
    if (map[key] === val) return key as K;
  }
  return val as any;
}
