import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {};
}>;

const Node: T = function (props) {
  return <BaseNode {...props} node={Node} />;
};

Node.nodeName = 'On Mouse Click';
Node.nodeType = 'event';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: 1, outputs: true }];
Node.defaultSettings = {};
Node.execute = async ({ forPreview }, next) => {
  if (typeof window === 'undefined' || forPreview) {
    next();
    return;
  }

  const handleMouseDown = (e: globalThis.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    window.removeEventListener('mousedown', handleMouseDown)
    next();
  }

  window.addEventListener('mousedown', handleMouseDown)

};

export { Node as OnMouseClickNode };
