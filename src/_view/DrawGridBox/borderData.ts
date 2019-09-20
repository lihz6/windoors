import { Flow, Type, Node } from '_type/struct';
import { Border } from '.';
export default function borderData(
  focusNode: Node[],
  innerNode: Node[]
): Partial<Record<Border, Node>> {
  if (focusNode.length >= innerNode.length) {
    return {};
  }
  const key = (flow: Flow, index: 0 | -1) => {
    if (flow === Flow.T2B) {
      return (index && 'bottom') || 'top';
    }
    return (index && 'right') || 'left';
  };
  return (
    innerNode
      .slice(0, 1 - focusNode.length)
      // .reverse()
      .reduce((a, b) => {
        if (b.type === Type.FLEX) {
          const { flow, children } = b;
          if (children[0].type === Type.PIPE) {
            a[key(flow, 0)] = children[0];
          }
          if (children.slice(-1)[0].type === Type.PIPE) {
            a[key(flow, -1)] = children.slice(-1)[0];
          }
        }
        return a;
      }, {})
  );
}
