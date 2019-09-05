export default (data: any, ms: number = 2000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, ms);
  });
