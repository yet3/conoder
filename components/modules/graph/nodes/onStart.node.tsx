import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {};
}>;

const Node: T = function(props) {
  return <BaseNode {...props} node={Node} className='' />
};

Node.nodeName = 'On Start';
Node.nodeType = 'event';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: false, outputs: true }];
Node.defaultSettings = {};
Node.execute = async ({}, next) => {
  next()
}

export { Node as OnStartNode };
