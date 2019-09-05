// require('es6-promise').polyfill();
// const fetch = require('isomorphic-fetch');
export default function(domain: string) {
  return <T = any>(path: string, data?: any, headers?: any): Promise<T> =>
    fetch(urlJoin(domain, uniqePath(path)), formdata(data, headers)).then(
      (res: Response) => {
        if (res.ok) return res.json() as Promise<T>;
        throw res.statusText;
      }
    );
}

export function toFormData(data: any) {
  const form = new FormData();
  for (const key in data) {
    form.append(key, data[key]);
  }
  return form;
}

function formdata(data: any, headers: any) {
  const options: any = {
    credentials: 'include',
    method: 'GET',
    mode: 'cors',
  };
  if (headers) {
    options.headers = headers;
  }
  if (data) {
    options.method = 'POST';
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        'Content-Type': 'application/json',
        ...headers,
      };
    }
  }
  return options;
}

function uniqePath(path: string) {
  if (path.indexOf('?') >= 0) {
    return path + `&ts=${Date.now()}`;
  }
  return path + `?ts=${Date.now()}`;
}

function urlJoin(base: string, path: string) {
  if (path.includes('//')) {
    return path;
  }
  switch ([base.slice(-1), path.slice(0, 1)].filter(c => c === '/').length) {
    case 2:
      return base + path.slice(1);
    case 1:
      return base + path;
    default:
      return base + '/' + path;
  }
}
