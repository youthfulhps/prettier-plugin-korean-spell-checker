import type { Plugin } from 'prettier3';
import { parsers } from './parsers';
import { printers } from './printers';

const spellCheckerV3Plugin: Plugin = {
  parsers,
  printers,
};

export default spellCheckerV3Plugin;
