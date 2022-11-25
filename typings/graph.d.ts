import { Component, ComponentProps, ReactNode } from 'react';

export type GNodeType = 'event' | 'action' | 'helper';

export interface PlaceholderPointer {
  startX: number;
  startY: number;

  endY: number;
  endX: number;

  outNode: GNode;
}

export interface BaseGNode<C extends GNodeComp = GNodeComp> {
  x: number;
  y: number;

  comp: C;
  settings: Partial<ComponentProps<C>['settings']>;

  isSelected?: boolean;

  nextNodesIds: string[];
  prevNodesIds: string[];
}

export interface GNode<C extends GNodeComp = GNodeComp> extends BaseGNode<C> {
  id: string;
}

export interface GPointerNodeRef {
  nodeId: string;
  attachmentPointId: string;
}

export interface GPointer {
  id: string;

  startX: number;
  startY: number;
  endX: number;
  endY: number;

  outNodeRef: GPointerNodeRef;
  inNodeRef: GPointerNodeRef;
}

export interface AttachmentPoint {
  id: string;

  x: string;
  y: string;

  inputs: number | boolean | null | (() => void);
  outputs: number | boolean | null | (() => void);
}

interface GNodeBaseProps {
  isSelected?: boolean;
  id: string;
  setSetting: (key: string, value: number | string | boolean) => void;
  settings: {};
}
export type GNodeCompProps<P extends Record<string, any> = {}> = {
  settings: P['settings'];
};

export type GNodeExecuteFn = (
  data: { id: string; settings: T['settings']; forPreview?: boolean; content: readonly string; setContent: (value: string) => void },
  next: () => void
) => void;

export type GNodeComp<P extends GNodeCompProps = any, T = GNodeCompProps<P>> = {
  (props: T & GNodeBaseProps): JSX.Element;
  nodeName: string;
  nodeType: GNodeType;
  attachmentPoints: AttachmentPoint[];
  defaultSettings: T['settings'];
  execute?: GNodeExecuteFn;
};
