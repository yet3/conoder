import { GNode } from '@typings/graph';
import clsx from 'clsx';
import { useCamera } from '../camera/useCamera.hook';
import { WithCamera } from '../camera/WithCamera';

const PAD = 10;

interface Props {
  id: string;

  outNode?: GNode;
  inNode?: GNode;


  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;

  isSelected?: boolean;
}

const Pointer = (props: Props) => {
  const { isSelected, outNode, inNode, id } = props;
  const ctx = useCamera();

  if (typeof document === 'undefined') return null;
  const cam = ctx.camera;

  let width = 100;
  let height = 100;

  let camX = props.startX ?? 0;
  let camY = props.startY ?? 0;
  let startX = 0;
  let startY = 0;
  let endX = props.endX ?? 0;
  let endY = props.endY ?? 0;

  if (outNode && inNode) {
    const outNodeEl = document.getElementById(outNode.id);
    const inNodeEl = document.getElementById(inNode.id);

    if (!outNodeEl || !inNodeEl) return null;

    let outRect = outNodeEl.getBoundingClientRect();
    let inRect = inNodeEl.getBoundingClientRect();

    outRect.width /= cam.scale;
    outRect.height /= cam.scale;

    inRect.width /= cam.scale;
    inRect.height /= cam.scale;

    camX = outNode.x + outRect.width / 2;
    camY = outNode.y + outRect.height / 2;
    endX = inNode.x - camX + inRect.width / 2;
    endY = inNode.y - camY + inRect.height / 2;

  } 

  let dx = endX - startX;
  let dy = endY - startY;

  width = Math.abs(dx);
  height = Math.abs(dy);

  const posX = dx >= 0 ? 0 : width;
  const posY = dy >= 0 ? 0 : height;
  startX += PAD + posX;
  startY += PAD + posY;
  endX += PAD + posX;
  endY += PAD + posY;

  width += PAD * 2;
  height += PAD * 2;

  return (
    <WithCamera x={camX} y={camY}>
      <div
        className="pointer-events-none"
        style={{
          transform: `translate(${-PAD - posX}px, ${-PAD - posY}px)`,
        }}
      >
        <svg className="pointer-events-none" width={width} height={height} xmlns="http://www.w3.org/2000/svg" fill="none">
          <defs>
            <marker id="pointerArrow" markerWidth={8} markerHeight={16} refX={0} refY={8} markerUnits="userSpaceOnUse" orient="auto">
              <path d="M 0 0 L 8 8 L 0 16" fill="none" className="stroke-pointer" strokeWidth={2} />
            </marker>

            <marker id="pointerArrowHover" markerWidth={8} markerHeight={16} refX={0} refY={8} markerUnits="userSpaceOnUse" orient="auto">
              <path d="M 0 0 L 8 8 L 0 16" fill="none" className="stroke-pointer-selected/50" strokeWidth={2} />
            </marker>

            <marker
              id="pointerArrowSelected"
              markerWidth={8}
              markerHeight={16}
              refX={0}
              refY={8}
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M 0 0 L 8 8 L 0 16" fill="none" className="stroke-pointer-selected" strokeWidth={2} />
            </marker>
          </defs>

          <polyline
            fill="none"
            strokeWidth={8}
            points={`${startX},${startY} ${(endX + startX) / 2},${(startY + endY) / 2}  ${endX},${endY}`}
            className="pointer-events-auto stroke-transparent peer pointer-collider"
            id={id}
            data-is-pointer
          />

          <polyline
            fill="none"
            strokeWidth={2}
            points={`${startX},${startY} ${(endX + startX) / 2},${(startY + endY) / 2}  ${endX},${endY}`}
            className={clsx(
              isSelected
                ? 'stroke-pointer-selected pointer-line-arrow-selected'
                : 'stroke-pointer peer-hover:stroke-pointer-selected/50 pointer-line-arrow',
              'pointer-events-none'
            )}
          />
        </svg>
      </div>
    </WithCamera>
  );
};

export { Pointer };
