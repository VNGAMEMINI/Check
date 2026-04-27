/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * This is a pure in-place shuffle with O(n) time complexity
 *
 * @param {Array} arr - Array to shuffle
 * @modifies arr - The input array is shuffled in place
 * @example
 * const arr = [1, 2, 3, 4, 5];
 * rdArr(arr);
 * console.log(arr); // [3, 1, 5, 2, 4] (randomized)
 */
export function rdArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
