/**
 * 李鸿章 <poodll@163.com>
 * 6/27/2019, 3:57:15 PM
 */

import fetch from '_fetch';

export function signin(data) {
  return fetch(`/x000/signin`, data);
}

export function forgetPword({ username }) {
  return fetch(`/x000/forget-pword`, { username }).then(
    () => `登录密码已发送，请查收你的邮箱`
  );
}
