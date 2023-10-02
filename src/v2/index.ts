import type { Plugin } from 'prettier';
import { parsers } from './parsers';
import { printers } from './printers';

const spellCheckerV2Plugin: Plugin = {
  parsers,
  printers,
};

export default spellCheckerV2Plugin;
