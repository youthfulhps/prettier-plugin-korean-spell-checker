import type { Fixture } from '../setting';
import { format } from 'prettier3';
import { baseOptions } from '../setting';

const options = {
  ...baseOptions,
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'babel/jsx-text',
    input: `function ComponentA() {
  return (
    <section>
      <span>구지 할 필요가 있겠어?</span>
      <span>천만해요, 제 일인걸요.</span>
      <span>비가 억수와 같이 쏫아진다.</span>
      <span>내일 봬어요.</span>
    </section>
  );
}
export default ComponentA;
`,
    output: `function ComponentA() {
  return (
    <section>
      <span>굳이 할 필요가 있겠어?</span>
      <span>천만에요, 제 일인걸요.</span>
      <span>비가 억수와 같이 쏟아진다.</span>
      <span>내일 뵈어요.</span>
    </section>
  );
}
export default ComponentA;
`,
  },
];

describe('babel/jsx-text', () => {
  for (const { name, input, output } of fixtures) {
    test(
      name,
      async () => {
        expect(await format(input, options)).toBe(output);
      },
      10000,
    );
  }
});
