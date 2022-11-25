import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {};
}>;

const Node: T = function(props) {
  return <BaseNode {...props} node={Node} hideHeader className="rounded-full p-0 w-6 h-6 before:rounded-full" />;
};

Node.nodeName = 'Splitter Node';
Node.nodeType = 'helper';
Node.attachmentPoints = [{ id: 'in/out', x: '50%', y: '50%', inputs: 1, outputs: true }];
Node.defaultSettings = {};
Node.execute = (_, next) => {
  next()
}

export { Node as SplitterNode };
