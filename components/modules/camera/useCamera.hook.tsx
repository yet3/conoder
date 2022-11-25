import { cssTransform } from '@utils/cssTransform.util';
import { CSSProperties, useContext } from 'react';
import { CameraCtx, CAM_CAN_MOVME_ATR } from './camera.context';

const useCamera = () => {
  const ctx = useContext(CameraCtx);

  if (!ctx) throw Error('CameraContext is not defined');

  return {
    ...ctx,
    allowToMoveCamera: { [CAM_CAN_MOVME_ATR]: true },
    getOnCanvasStyle: (d: Pos, s: CSSProperties = {}): CSSProperties => {
      const { x, y } = d;
      const { scale, x: camX, y: camY, offsetX, offsetY } = ctx.camera;

      return {
        transformOrigin: 'top left',
        ...s,
        position: 'absolute',
        top: 0,
        left: 0,
        transform: cssTransform({ scale, x: x * scale + camX + offsetX, y: y * scale + camY + offsetY }),
        /* willChange: 'transform', */
      };
    },
  };
};

export { useCamera };
