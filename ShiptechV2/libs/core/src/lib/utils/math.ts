/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function truncateDecimals(value: number, decimals: number): number {
  if (!value) {
    return value;
  }

  const isFloat = value.toString().includes('.');

  if (!isFloat) {
    return parseFloat(value.toFixed(decimals));
  }

  const numberArr = value.toString().split('.');
  numberArr[1] = numberArr[1].slice(0, decimals);
  return parseFloat(numberArr.join('.'));
}
