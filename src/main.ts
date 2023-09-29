import type { Plugin } from 'prettier';
import { parsers } from './parsers';
import { printers } from './printers';

const spellCheckerPlugin: Plugin = {
  parsers,
  printers,
};

export default spellCheckerPlugin;
