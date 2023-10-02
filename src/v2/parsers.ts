import type { Parser } from 'prettier';
import { parsers as babelParsers } from 'prettier/parser-babel';
import { parsers as typescriptParsers } from 'prettier/parser-typescript';

export const parsers: { [parserName: string]: Parser } = {
  babel: {
    ...babelParsers.babel,
    astFormat: 'babel-ast',
  },
  typescript: {
    ...typescriptParsers.typescript,
    astFormat: 'typescript-ast',
  },
};
