export default (errmsg: string, ms: number = 2000) =>
  new Promise(() => {
    setTimeout(() => {
      throw errmsg;
    }, ms);
  });
