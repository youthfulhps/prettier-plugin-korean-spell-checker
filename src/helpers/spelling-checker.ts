/* eslint-disable @typescript-eslint/no-var-requires */
const hanspell = require('hanspell');

export function checkSpelling(sentence: string) {
  const promise = new Promise<any[]>((resolve, reject) => {
    hanspell.spellCheckByPNU(
      sentence,
      6000,
      resolve,
      /* eslint-disable @typescript-eslint/no-empty-function */
      () => {},
      reject,
    );
  });

  return promise;
}
