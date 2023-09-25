import { AST } from 'prettier';

export type NodeRange = [number, number];

function isObject(arg: unknown): arg is object {
  return typeof arg === 'object' && arg !== null;
}

function isNodeRange(arg: unknown): arg is NodeRange {
  return Array.isArray(arg) && arg.length === 2 && arg.every((item) => typeof item === 'number');
}

export function traversal(ast: AST) {
  const nodeList: any[] = [];
  if (!ast.program || !ast.program.body.length) {
    return ast;
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

    // TODO: 그 전에 한글인지 판단이 우선적으로 필요.
    // TODO: 이하 조건은 JSXElement 내부에 들어있는 문자열만을 확인한다.
    // TODO: template literal 안에 있다면?
    // TODO: 영어와 섞여있다면?
    // TODO: 그외 문자열 정의 등등의 조건은 어떻게 되는지 확인 필요.
    if (
      node.type === 'JSXText' &&
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
      nodeList.push(node.range);
    }
  }

  recursion(ast);

  return nodeList;
}
