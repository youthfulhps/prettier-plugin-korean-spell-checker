import { AST } from 'prettier';

export type NodeRange = [number, number];

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

function isNodeRange(arg: unknown): arg is NodeRange {
  return Array.isArray(arg) && arg.length === 2 && arg.every((item) => typeof item === 'number');
}

function hasKorean(text: string) {
  return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
}

export function traversal(ast: AST, parserName: 'babel' | 'typescript') {
  const nodeList: any[] = [];

  if (parserName === 'babel') {
    if (!ast.program || !ast.program.body.length) {
      return [];
    }
  }

  function recursion(node: unknown) {
    if (!isObject(node) || !('type' in node)) {
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (key === 'type') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((childNode: unknown) => {
          recursion(childNode);
        });
        return;
      }

      recursion(value);
    });

    if (parserName === 'babel') {
      if (
        'extra' in node &&
        isObject(node.extra) &&
        'rawValue' in node.extra &&
        'raw' in node.extra &&
        node.extra.raw &&
        node.extra.rawValue &&
        typeof node.extra.raw === 'string' &&
        typeof node.extra.rawValue === 'string' &&
        'value' in node &&
        typeof node.value === 'string' &&
        'range' in node &&
        isNodeRange(node.range)
      ) {
        if (hasKorean(node.extra.rawValue)) {
          nodeList.push(node.range);
        }
      }
    } else if (parserName === 'typescript') {
      if (
        'value' in node &&
        typeof node.value === 'string' &&
        'raw' in node &&
        typeof node.raw === 'string' &&
        'range' in node &&
        isNodeRange(node.range)
      ) {
        if (hasKorean(node.raw)) {
          nodeList.push(node.range);
        }
      }
    }
  }

  recursion(ast);

  return nodeList;
}
