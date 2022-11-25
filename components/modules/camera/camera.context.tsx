import { createContext } from 'react';
import { ICameraCtxState } from '@typings/camera';

export const CAM_MIN_SCALE = 0.1
export const CAM_MAX_SCALE = 10
export const CAM_CAN_MOVME_ATR = 'data-can-move-camera'

export const CAMERA_CTX_INIT_STATE: ICameraCtxState = {
  camera: {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  pressPoint: null,
};

export const CameraCtx = createContext<ICameraCtxState>(CAMERA_CTX_INIT_STATE);
