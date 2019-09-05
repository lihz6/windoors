// see `.env.development` and `.env.production`
import fetch from './_fetch';
export const host = process.env.REACT_APP_HOST!;
export default fetch(host);
