/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 9/5/2019, 7:41:10 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import fetch from '_fetch';

export function getData(page, size) {
  return fetch(`/x000/draw/${page}/${size}?page=${page}&size=${size}`);
}
