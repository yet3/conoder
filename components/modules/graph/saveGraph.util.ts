import { GNode } from '@typings/graph';
import { GNodeSave, GraphSave } from '@typings/save';
import { autoId } from '@utils/autoId.util';
import pkg from 'package.json';

export const saveGraph = (saveName: string, nodes: GNode[], autosave = false) => {
  if (typeof window === 'undefined') return [];

  const saveNodes: GNodeSave[] = [];
  nodes.forEach((n) => {
    saveNodes.push({
      id: n.id,
      x: n.x,
      y: n.y,
      settings: n.settings,
      nodeName: n.comp.nodeName,
      nextNodesIds: n.nextNodesIds,
      prevNodesIds: n.prevNodesIds,
    });
  });

  const save: GraphSave = {
    id: autoId(),
    name: saveName,
    nodes: saveNodes,
    appVersion: pkg.version,
    savedAt: new Date(),
  };

  if (autosave) {
    save.id = 'autosave';
    window.localStorage.setItem('autosave', JSON.stringify(save));
    return [save];
  }

  const savesString = window.localStorage.getItem('saves');
  let saves: GraphSave[] = [];
  if (savesString) {
    const parsed = JSON.parse(savesString);
    if (Array.isArray(parsed)) saves = parsed;
  }

  const fI = saves.findIndex((f) => f.name === saveName);
  if (fI >= 0) {
    saves[fI] = save;
  } else saves.push(save);

  window.localStorage.setItem('saves', JSON.stringify(saves));
  return saves;
};
