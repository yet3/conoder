import { GNode, GNodeComp } from '@typings/graph';
import { GraphSave } from '@typings/save';
import { makeNode } from './makeNode.util';

export const loadGraph = async (idToLoad: string): Promise<GNode[]> => {
  if (typeof window === 'undefined') return [];

  let saves: GraphSave[] = [];
  if (idToLoad === 'autosave') {
    const savesString = window.localStorage.getItem('autosave');
    if (savesString) {
      const parsed = JSON.parse(savesString);
      if (typeof parsed === 'object') saves = [parsed];
    }
  } else {
    const savesString = window.localStorage.getItem('saves');
    if (savesString) {
      const parsed = JSON.parse(savesString);
      if (Array.isArray(parsed)) saves = parsed;
    }
  }

  try {
    const save = saves.find((s) => s.id === idToLoad);
    if (!save) return [];

    const t = await import('./nodes');
    const tmp: GNodeComp[] = [];
    Object.values(t).forEach((m) => {
      tmp.push(m as any);
    });

    const newNodes: GNode[] = [];
    save.nodes.forEach((n) => {
      const nk = tmp.find((k) => k.nodeName === n.nodeName);
      if (nk) {
        newNodes.push(
          makeNode({
            id: n.id,
            x: n.x,
            y: n.y,

            comp: nk,
            settings: n.settings,

            nextNodesIds: n.nextNodesIds,
            prevNodesIds: n.prevNodesIds,
          })
        );
      }
    });

    return newNodes;
  } catch (e) {
    console.log(e);
    return [];
  }
};
