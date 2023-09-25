import type { AstPath, ParserOptions, Doc, Printer, Options, AST } from 'prettier';
import { format as formatSync } from '@prettier/sync';
import { NodeRange, traversal } from '~/traversal';
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

      // TODO: 모든 제안을 수용하는 것이 좋은 방법인지 판단이 필요함
      // TODO: 제안이 많다는 것은 오히려 적절하지 못한 수정이 될 수 있음
      // TODO: 즉 단일의 제안으로 명확한 문법 오류가 아니라면, 굳이 수정해서 혼란을 주지 않는 편이 낫다.
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

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
async function preprocess(ast: AST, options: ParserOptions) {
  targetNodeRangeList = traversal(ast);
  return ast;
}

export const printers: { [astFormat: string]: Printer } = {
  'babel-ast': {
    print: createPrinter('babel'),
    preprocess,
  },
  'typescript-ast': {
    print: createPrinter('typescript'),
    preprocess,
  },
};
