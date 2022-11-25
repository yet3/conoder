import { GNode, PlaceholderPointer } from '@typings/graph';
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import { useCamera } from '../camera/useCamera.hook';
import { WithCamera } from '../camera/WithCamera';
import { makeNode } from './makeNode.util';
import { NodeSelector } from './nodeSelector';
import { Pointer } from './pointer';

interface Props {
  nodes: GNode[];
  addNode: (node: GNode) => void;
  placeholderPointer: PlaceholderPointer | null;
  setNodeSetting: (id: string, key: string, value: any) => void;
  selectedPointers: string[];
  saveId?: string | null
}

const CamCanvas = forwardRef<HTMLDivElement, Props>(
  ({ setNodeSetting, nodes, addNode, placeholderPointer, selectedPointers, saveId, ...props }, ref) => {
    const ctx = useCamera();
    const [initLoad, setInitLoad] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setInitLoad(false);
      }, 25);

      return () => {
        setInitLoad(true);
        clearTimeout(timeout);
      };
    }, [saveId]);

    if (!ctx) throw Error('CameraContext is not defined');

    const pointersToDraw: { nodeOut: GNode; nodeInId: string }[] = [];
    const nodesEls = nodes.map((node) => {
      node.nextNodesIds.forEach((nnId) => {
        pointersToDraw.push({ nodeOut: node, nodeInId: nnId });
      });

      return (
        <WithCamera {...node} key={node.id}>
          {node.comp({
            settings: node.settings,
            isSelected: node.isSelected,
            id: node.id,
            setSetting: (key: string, val: any) => setNodeSetting(node.id, key, val),
          })}
        </WithCamera>
      );
    });

    const pointersEls: ReactNode[] = [];
    pointersToDraw.forEach((p) => {
      const nodeIn = nodes.find((n) => n.id === p.nodeInId);
      if (nodeIn) {
        const pointerId = `${p.nodeOut.id}-${p.nodeInId}`;
        pointersEls.push(
          <Pointer key={pointerId} id={pointerId} outNode={p.nodeOut} inNode={nodeIn} isSelected={selectedPointers.includes(pointerId)} />
        );
      }
    });

    const cam = ctx.camera;
    return (
      <div
        {...props}
        ref={ref}
        className="flex w-full h-screen relative overflow-hidden bg-dark-gray"
        style={{
          backgroundImage: 'radial-gradient(#44444460, 5%, transparent 0%)',
          backgroundSize: '40px 40px',
          backgroundPosition: `${cam.x}px ${cam.y}px`,
        }}
      >
        {placeholderPointer && <Pointer {...placeholderPointer} id="placeholder" />}

        <NodeSelector
          onPick={(c, pos) => {
            addNode(
              makeNode({
                x: (pos.x - cam.x) / cam.scale,
                y: (pos.y - cam.y) / cam.scale,
                comp: c,
                settings: {},
                prevNodesIds: [],
                nextNodesIds: [],
              })
            );
          }}
        />

        {!initLoad && pointersEls}
        {nodesEls}
      </div>
    );
  }
);

export { CamCanvas };
