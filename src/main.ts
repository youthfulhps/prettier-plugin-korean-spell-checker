import type { Plugin } from 'prettier';
import { parsers } from './parsers';
import { printers } from './printers';

const spellingCheckerPlugin: Plugin = {
  parsers,
  printers,
};

export default spellingCheckerPlugin;
