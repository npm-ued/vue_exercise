import { argumentError, isValid, makeResponse } from './utils';
import { createDisposableWorker } from './createDisposableWorker';

export const run = (work = null, args) => {
  const validWork = isValid(work)('function');
  const validArgs = isValid(args)(['array', 'undefined']);
  if (validWork && validArgs) {
    const worker = createDisposableWorker(makeResponse(work));
    return worker.post({ args });
  }
  if (!validWork) console.error(argumentError({ expected: 'a function', received: work }));
  if (!validArgs) console.error(argumentError({ expected: 'an array', received: args }));
  return null;
};
