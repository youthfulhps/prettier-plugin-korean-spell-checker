import type { AstPath, ParserOptions, Doc, Printer, Plugin } from 'prettier';
import { AST } from 'prettier';
import { checkSpelling } from '~/helpers/spelling-checker';
import { format as formatSync } from '@prettier/sync';
import { NodeRange, traversal } from '~/shared/traversal';

let targetNodeRangeList: NodeRange[] = [];

function createPrinter(parserName: 'babel' | 'typescript') {
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  async function main(path: AstPath, options: ParserOptions, print: (path: AstPath) => Doc): Doc {
    // @ts-ignore
    const plugins = options.plugins.filter((plugin) => typeof plugin !== 'string') as Plugin[];
    const pluginCandidate = plugins.find((plugin) => plugin.parsers?.[parserName]);

    if (!pluginCandidate) {
      throw new Error('A plugin with the given parser does not exist.');
    }

    const node = path.getValue();

    if (node?.comments) {
      node.comments.forEach((comment: any) => {
        // eslint-disable-next-line no-param-reassign
        comment.printed = true;
      });
    }

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
      ...options,
      plugins: [pluginCandidate],
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
