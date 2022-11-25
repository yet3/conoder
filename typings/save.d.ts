
export interface GNodeSave {
  id: string
  x: number;
  y: number;

  nodeName: string;

  settings: Record<string, any>
  nextNodesIds: string[];
  prevNodesIds: string[];
}

export interface GraphSave {
  id: string;
  name: string;

  nodes: GNodeSave[];

  appVersion: string;
  savedAt: Date;
}
