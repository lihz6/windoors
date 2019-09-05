export default (seed: any) => walk(seed).join(' ');

function walk(seed: any): string[] {
  if ((seed && seed !== true) || seed === 0) {
    if (Array.isArray(seed)) {
      return seed.map(walk).reduce((a, b) => a.concat(b), []);
    }
    const type = typeof seed;
    if (type === 'string' || type === 'number') {
      return [seed];
    } else if (type === 'object') {
      const array: string[] = [];
      for (const key in seed) {
        const val = seed[key];
        if (val || val === 0) {
          array.push(key);
          walk(val).forEach(sub => {
            array.push(key + '-' + sub);
          });
        }
      }
      return array;
    }
  }
  return [];
}
