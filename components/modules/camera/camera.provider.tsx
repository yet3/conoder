import { useRerender } from '@components/common/useRerender.hook';
import { CamMouseDown, CamMouseMove, CamMouseUp, ICamera, ICameraCtxState } from '@typings/camera';
import { cloneElement, ReactElement, useEffect, useRef } from 'react';
import { CameraCtx, CAMERA_CTX_INIT_STATE, CAM_CAN_MOVME_ATR, CAM_MAX_SCALE, CAM_MIN_SCALE } from './camera.context';

interface Props {
  onMouseDown?: CamMouseDown;
  onMouseMove?: CamMouseMove;
  onMouseUp?: CamMouseUp;

  children: ReactElement;

  disabled?: boolean;
}

const getPosOnCanvas = (pos: Pos, cam: ICamera) => {
  return {
    x: (pos.x - cam.x) / cam.scale,
    y: (pos.y - cam.y) / cam.scale,
  };
};

const Camera = ({ children, disabled, ...props }: Props) => {
  const canvasRef = useRef<null | HTMLElement>(null);

  const ctx = useRef<ICameraCtxState>({ ...CAMERA_CTX_INIT_STATE });
  const rerender = useRerender();

  useEffect(() => {
    if (!canvasRef.current) return;
    if (typeof window === 'undefined') return;
    if (disabled) return;

    let hasMovedCamera = false;

    const onMouseDown = (e: globalThis.MouseEvent) => {
      if (!canvasRef.current) return;
      hasMovedCamera = false;

      let willMoveCamera = false;
      const targetEl = e.target as HTMLElement;
      if (targetEl?.getAttribute(CAM_CAN_MOVME_ATR)) {
        e.preventDefault();
        willMoveCamera = true;
      }

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const cam = ctx.current.camera;

      const mouseX = e.x - canvasRect.x;
      const mouseY = e.y - canvasRect.y;
      const canvasMouseX = mouseX - cam.x;
      const canvasMouseY = mouseY - cam.y;

      ctx.current.pressPoint = {
        ...ctx.current.pressPoint,
        x: mouseX,
        y: mouseY,
        canvasX: canvasMouseX,
        canvasY: canvasMouseY,
        target: targetEl,
        currentTarget: e.currentTarget as HTMLElement,
      };

      if (props.onMouseDown) {
        props.onMouseDown(e, {
          canvaEl: canvasRef.current,
          canvasRect,
          mouse: {
            x: mouseX,
            y: mouseY,
            canvasX: canvasMouseX,
            canvasY: canvasMouseY,
          },
          camera: cam,
          pressPoint: ctx.current.pressPoint,
          willMoveCamera,
          getPosOnCanvas: (pos: Pos) => getPosOnCanvas(pos, cam),
        });
      }

      rerender();
    };

    const onMouseMove = (e: globalThis.MouseEvent) => {
      if (!canvasRef.current) return;

      const pressPoint = ctx.current.pressPoint;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const cam = ctx.current.camera;

      const mouseX = e.x - canvasRect.x;
      const mouseY = e.y - canvasRect.y;
      const canvasMouseX = mouseX - cam.x;
      const canvasMouseY = mouseY - cam.y;

      let shouldPreventCameraMovment = false;

      let newCameraPos: Pos = { x: cam.x, y: cam.y };

      if (pressPoint) {
        newCameraPos.x = mouseX - pressPoint.canvasX;
        newCameraPos.y = mouseY - pressPoint.canvasY;
      }

      let canMoveCamera = true;
      const targetEl = pressPoint?.target;
      if (!targetEl?.getAttribute(CAM_CAN_MOVME_ATR)) {
        canMoveCamera = false;
        newCameraPos = { x: cam.x, y: cam.y };
      }

      if (props.onMouseMove) {
        const newCam = { ...cam, ...newCameraPos };
        props.onMouseMove(e, {
          canvaEl: canvasRef.current,
          canvasRect,
          mouse: {
            x: mouseX,
            y: mouseY,
            canvasX: canvasMouseX,
            canvasY: canvasMouseY,
          },
          camera: newCam,
          pressPoint: pressPoint,
          preventCameraMovment: () => (shouldPreventCameraMovment = true),
          getPosOnCanvas: (pos: Pos) => getPosOnCanvas(pos, newCam),
        });
      }

      if (!shouldPreventCameraMovment && canMoveCamera && pressPoint) {
        e.preventDefault();
        hasMovedCamera = true;
        ctx.current.camera = {
          ...ctx.current.camera,
          ...newCameraPos,
        };
        rerender();
      }
    };

    const onMouseUp = (e: globalThis.MouseEvent) => {
      if (!canvasRef.current) return;

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const cam = ctx.current.camera;

      const mouseX = e.x - canvasRect.x;
      const mouseY = e.y - canvasRect.y;
      const canvasMouseX = mouseX - cam.x;
      const canvasMouseY = mouseY - cam.y;

      if (props.onMouseUp) {
        props.onMouseUp(e, {
          canvaEl: canvasRef.current,
          canvasRect,
          mouse: {
            x: mouseX,
            y: mouseY,
            canvasX: canvasMouseX,
            canvasY: canvasMouseY,
          },
          camera: cam,
          pressPoint: ctx.current.pressPoint,
          hasMovedCamera,
          getPosOnCanvas: (pos: Pos) => getPosOnCanvas(pos, cam),
        });
      }

      if (ctx.current.pressPoint) {
        ctx.current.pressPoint = null;
      }

      hasMovedCamera = false;
    };

    const onWheel = (e: globalThis.WheelEvent) => {
      if (!canvasRef.current) return;

      const targetEl = e.target as HTMLElement;
      if (!targetEl?.getAttribute(CAM_CAN_MOVME_ATR)) {
        return;
      }

      const cam = ctx.current.camera;
      const { deltaY, deltaX } = e;

      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        let scale = cam.scale - deltaY * 0.01;
        scale = Math.max(CAM_MIN_SCALE, Math.min(CAM_MAX_SCALE, scale));

        cam.scale = scale;

        rerender();
      } else {
        hasMovedCamera = true;
        cam.x = cam.x - deltaX;
        cam.y = cam.y - deltaY;
        rerender();
      }
    };

    const onGestureStart = (e: Event) => {
      e.preventDefault();
    };

    canvasRef.current.addEventListener('wheel', onWheel);
    canvasRef.current.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('gesturestart', onGestureStart);
    return () => {
      canvasRef.current?.removeEventListener('wheel', onWheel);
      canvasRef.current?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('gesturestart', onGestureStart);
    };
  }, [disabled]);

  return (
    <CameraCtx.Provider value={ctx.current}>
      {cloneElement(children, {
        [CAM_CAN_MOVME_ATR]: true,
        ref: (r: HTMLElement | null) => {
          if (!r) return;
          if ((children as any).ref) (children as any).ref.current = r;
          canvasRef.current = r;
        },
      })}
    </CameraCtx.Provider>
  );
};

export { Camera };
