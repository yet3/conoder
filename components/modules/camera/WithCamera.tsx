import { CSSProperties, ReactNode } from 'react';
import { useCamera } from './useCamera.hook';

interface Props {
  x: number | (() => number);
  y: number | (() => number);
  children: ReactNode;

  style?: CSSProperties;
}

const WithCamera = ({ x, y, children, style }: Props) => {
  const ctx = useCamera();

  let _x, _y;
  if (typeof x === 'function') _x = x();
  else _x = x;

  if (typeof y === 'function') _y = y();
  else _y = y;

  return (
    <div className="relative" style={{ ...ctx.getOnCanvasStyle({ x: _x, y: _y }), ...style }}>
      {children}
    </div>
  );
};

export { WithCamera };
