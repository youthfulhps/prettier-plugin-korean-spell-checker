import type { Fixture } from '../setting';
import { format } from 'prettier3';
import { baseOptions } from '../setting';

const options = {
  ...baseOptions,
  parser: 'typescript',
};

const fixtures: Fixture[] = [
  {
    name: 'typescript/declaration',
    input: `const 안되 = "안돼";`,
    output: `const 안되 = "안돼";
`,
  },
];

describe('typescript/declaration', () => {
  for (const { name, input, output } of fixtures) {
    test(name, async () => {
      expect(await format(input, options)).toBe(output);
    });
  }
});
