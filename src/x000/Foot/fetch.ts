/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 7/2/2019, 11:09:53 AM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import fetch from '_fetch';

export function getData(page, size) {
  return fetch(`/x000/foot/${page}/${size}?page=${page}&size=${size}`);
}
