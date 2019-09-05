/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 7/1/2019, 4:13:34 PM
 * ```
 * doc comment for the file goes here
 */

/** Happy Coding */
import { Fetch } from '.';
import fetch from '_fetch';
export default (): Promise<Fetch> => fetch(`/core/context`);
