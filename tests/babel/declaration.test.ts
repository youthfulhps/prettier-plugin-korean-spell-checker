import type { Fixture } from '../setting';
import { format } from 'prettier3';
import { baseOptions } from '../setting';

const options = {
  ...baseOptions,
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'babel/declaration',
    input: `const 안되 = "안돼";`,
    output: `const 안되 = "안돼";
`,
  },
];

describe('babel/declaration', () => {
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
