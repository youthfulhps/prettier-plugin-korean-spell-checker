import type { Fixture } from '../setting';
import { format } from 'prettier3';
import { baseOptions } from '../setting';

const options = {
  ...baseOptions,
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'babel/comments',
    input: `function ComponentA() {
  // const text = "그렇게 해선 안 되요.";
  const conditionalText = true ? "됩니다." : "안 되요.";
  return (
    <section>
      {/* <span>안되요.</span> */}
      <span> 천만에요, 제 일인걸요.</span>
      <span>비가 억수와 같이 쏟아진다</span>
      {/* <span>내일 봬어요.</span> */}
    </section>
  );
}
export default ComponentA;
`,
    output: `function ComponentA() {
  // const text = "그렇게 해선 안 되요.";
  const conditionalText = true ? "됩니다." : "안 돼요.";
  return (
    <section>
      {/* <span>안되요.</span> */}
      <span> 천만에요, 제 일인걸요.</span>
      <span>비가 억수와 같이 쏟아진다.</span>
      {/* <span>내일 봬어요.</span> */}
    </section>
  );
}
export default ComponentA;
`,
  },
];

describe('babel/comments', () => {
  for (const { name, input, output } of fixtures) {
    test(name, async () => {
      expect(await format(input, options)).toBe(output);
    });
  }
});
