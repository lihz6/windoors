/** 最大公约数 */
export default function gcd(numbers: number[]) {
  const [first, ...rest] = numbers.filter(n => n !== 0);
  if (!rest.length) return first || 1;
  return gcd(rest.map(n => n % first).concat(first));
}
