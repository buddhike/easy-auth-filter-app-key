import ensure from 'easy-ensure';

export default (key) => {
  ensure(key, 'a valid key is required');

  return req => {
    const appName = req.get('x-app-id');
    const appKey = req.get('x-app-key');

    if (appName && appKey && appKey === key ) {
      return {
        sub: appName,
        scheme: 'app-key'
      }
    }

    return false;
  }
}
