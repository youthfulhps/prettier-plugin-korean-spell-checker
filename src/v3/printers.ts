import type { AstPath, ParserOptions, Doc, Printer, Options, AST } from 'prettier3';
import { format as formatSync } from '@prettier/sync';
import { NodeRange, traversal } from '~/shared/traversal';
import { checkSpelling } from '~/helpers/spelling-checker';
import { PRETTIER_OPTIONS } from '~/constants';

let targetNodeRangeList: NodeRange[] = [];

function createPrinter(parserName: 'babel' | 'typescript') {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  async function main(path: AstPath, options: ParserOptions, print: (path: AstPath) => Doc): Doc {
    // @ts-ignore
    const comments = options[Symbol.for('comments')];

    if (comments) {
      comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

    const necessaryOptions: Options = {
      parser: parserName,
      ...Object.fromEntries(PRETTIER_OPTIONS.map((key) => [key, options[key]])),
    };

    let { originalText } = options;

    for (const [start, end] of targetNodeRangeList) {
      if (end - start <= 1) {
        continue;
      }

      const targetText = originalText.slice(start, end);
      const suggestions = await checkSpelling(targetText);

      if (!suggestions.length) {
        continue;
      }

      const checkedText = suggestions.reduce(
        (sum, suggestion) => sum.replace(suggestion.token, suggestion.suggestions[0]),
        targetText,
      );

      originalText = originalText.replace(targetText, checkedText);
    }

    const formattedText = formatSync(originalText, {
      ...necessaryOptions,
      endOfLine: 'lf',
    });

    return formattedText;
  }

  return main;
}

function createPreprocess(parserName: 'babel' | 'typescript') {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  async function preprocess(ast: AST, options: ParserOptions) {
    targetNodeRangeList = traversal(ast, parserName);
    return ast;
  }

  return preprocess;
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': {
    print: createPrinter('babel'),
    preprocess: createPreprocess('babel'),
  },
  'typescript-ast': {
    print: createPrinter('typescript'),
    preprocess: createPreprocess('typescript'),
  },
};
