import { GNode, GNodeExecuteFn, GNodeType } from '@typings/graph';

export interface TimelinePart {
  nodeId: string;
  nodeName: string;
  nodeType: GNodeType;
  nodeSettings: any;
  execute: GNodeExecuteFn;
  next: TimelinePart[];
}

export const nodesToTimelines = (nodes: GNode[]) => {
  const startNodes = nodes.filter((n) => n.comp.nodeType === 'event' && n.prevNodesIds.length === 0);

  const timelines: TimelinePart[] = [];

  const goThroughNodes = (node: GNode, parentObj: TimelinePart, idsTrack: string[] = []) => {
    const connectedNodes = nodes.filter((n) => node.nextNodesIds.includes(n.id));

    connectedNodes.forEach((nextNode) => {
      const obj: TimelinePart = {
        nodeId: nextNode.id,
        nodeName: nextNode.comp.nodeName,
        nodeType: nextNode.comp.nodeType,
        nodeSettings: nextNode.settings,
        execute: nextNode.comp.execute ?? (async () => {}),
        next: [],
      };

      goThroughNodes(nextNode, obj);
      // if (!idsTrack.includes(nextNode.id)) {
      parentObj.next.push(obj);
      // }
    });
  };

  try {
    startNodes.forEach((startNode) => {
      const obj: TimelinePart = {
        nodeId: startNode.id,
        nodeName: startNode.comp.nodeName,
        nodeType: startNode.comp.nodeType,
        nodeSettings: startNode.settings,
        execute: startNode.comp.execute ?? (async () => {}),
        next: [],
      };

      const idsTrack: string[] = [startNode.id];

      goThroughNodes(startNode, obj, idsTrack);

      timelines.push(obj);
    });
  } catch (e) {
    console.dir(e);
  }


  return timelines
};
