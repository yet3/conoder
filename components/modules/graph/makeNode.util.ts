import { BaseGNode, GNode, GNodeComp } from '@typings/graph';
import { autoId } from '@utils/autoId.util';

export const makeNode = <N extends GNodeComp>(node: BaseGNode<N> & { id?: string }): GNode<N> => {
  return {
    ...node,
    id: node.id ?? autoId(),
    settings: {
      ...node.comp.defaultSettings,
      ...node.settings,
    },
  };
};
