import type { Fixture } from '../setting';
import { format } from 'prettier3';
import { baseOptions } from '../setting';

const options = {
  ...baseOptions,
  parser: 'babel',
};

const fixtures: Fixture[] = [
  {
    name: 'babel/literal',
    input: `const text = '그렇게해선 안되요.';
const conditionalText = true ? "됍니다." : "안되요.";
`,
    output: `const text = "그렇게 해선 안 돼요.";
const conditionalText = true ? "됩니다." : "안 돼요.";
`,
  },
];

describe('babel/literal', () => {
  for (const { name, input, output } of fixtures) {
    test(name, async () => {
      expect(await format(input, options)).toBe(output);
    });
  }
});
