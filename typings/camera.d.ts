export interface ICamera {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface ICameraCtxState {
  camera: ICamera;
  pressPoint: null | {
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
    target: HTMLElement | null;
    currentTarget: HTMLElement | null;
  };
}

// Events
interface CamMouseCommonData {
  canvaEl: HTMLElement;
  canvasRect: DOMRect;
  mouse: {
    x: number;
    y: number;
    canvasX: number;
    canvasY: number;
  };
  camera: ICamera;
  pressPoint: ICameraCtxState['pressPoint']
  getPosOnCanvas: (pos: Pos) => void;
}

export interface CamMouseDownData extends CamMouseCommonData {
  willMoveCamera: boolean
}

export interface CamMouseMoveData extends CamMouseCommonData {
  preventCameraMovment: () => void;
}

export interface CamMouseUpData extends CamMouseCommonData {
  hasMovedCamera: boolean
}

export type CamMouseDown = (e: globalThis.MouseEvent, data: CamMouseDownData) => void;
export type CamMouseMove = (e: globalThis.MouseEvent, data: CamMouseMoveData) => void;
export type CamMouseUp = (e: globalThis.MouseEvent, data: CamMouseUpData) => void;
