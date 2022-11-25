import { useRerender } from '@components/common/useRerender.hook';
import { Camera } from '@components/modules/camera/camera.provider';
import { CamCanvas } from '@components/modules/graph/camCanvas';
import { ClearGraphBtn } from '@components/modules/graph/clearGraphBtn';
import { getExampleGraph } from '@components/modules/graph/exampleGrpah';
import { InfoBox } from '@components/modules/graph/infoBox';
import { loadGraph } from '@components/modules/graph/loadGraph.util';
import { makeNode } from '@components/modules/graph/makeNode.util';
import { saveGraph } from '@components/modules/graph/saveGraph.util';
import { SaveLoad } from '@components/modules/graph/saveLoad';
import { StartPresentingBtn } from '@components/modules/graph/startPresentingBtn';
import { Presenter } from '@components/modules/presenter/presenter';
import { CamMouseDown, CamMouseMove, CamMouseUp } from '@typings/camera';
import { GNode, GPointer, PlaceholderPointer } from '@typings/graph';
import Head from 'next/head';
import { useEffect, useRef } from 'react';

const getNodeUnderMouse = (e: globalThis.MouseEvent, nodes: GNode[]) => {
  const path = e.composedPath();
  let node: GNode | undefined;
  for (let i = 0; i < path.length; i++) {
    const el = path[i] as HTMLElement;
    if (el.nodeName === 'DIV' && el.getAttribute('data-is-node')) {
      node = nodes.find((e) => e.id === el.id);
      break;
    }
  }
  return node;
};

const getPointerUnderMouse = (e: globalThis.MouseEvent) => {
  const path = e.composedPath();
  for (let i = 0; i < path.length; i++) {
    const el = path[i] as HTMLElement;
    if (el.nodeName === 'polyline' && el.getAttribute('data-is-pointer')) {
      return el.id;
    }
  }
  return null;
};

export default function Home() {
  const nodes = useRef<GNode[]>([]);
  const pointers = useRef<GPointer[]>([]);
  const selectedPointers = useRef<string[]>([]);

  const mode = useRef<'presenter' | 'editor'>('editor');
  const saveId = useRef<string | null>(null);

  const copiedNodes = useRef<GNode[]>([]);

  const rerender = useRerender();

  const placeholderPointer = useRef<null | PlaceholderPointer>(null);
  const mousePos = useRef<Pos>({ x: 0, y: 0 });

  const currentPressedNode = useRef<null | GNode>(null);
  const wasPressedWithShift = useRef<boolean | null>(null);
  const autoSaveTimeout = useRef<null | NodeJS.Timeout>(null);

  const autoSaveGraph = () => {
    if (autoSaveTimeout.current != null) {
      clearTimeout(autoSaveTimeout.current);
    }
    autoSaveTimeout.current = setTimeout(() => {
      saveGraph('autosave', nodes.current, true);
      autoSaveTimeout.current = null;
    }, 250);
  };

  const addNode = (node: GNode) => {
    nodes.current.push(node);
    autoSaveGraph();
    rerender();
  };

  const globalBlur = () => {
    if (typeof document === 'undefined') return;
    if (document.hasFocus() && document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    selectedPointers.current = [];
    rerender();
  };

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      let shouldRerender = false;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        // Pointers
        if (selectedPointers.current.length > 0) {
          shouldRerender = true;
          selectedPointers.current.forEach((id) => {
            const [outNodeId, inNodeId] = id.split('-');

            const outNode = nodes.current.find((n) => n.id === outNodeId);
            if (outNode) outNode.nextNodesIds.splice(outNode.nextNodesIds.indexOf(inNodeId), 1);

            const inNode = nodes.current.find((n) => n.id === inNodeId);
            if (inNode) inNode.prevNodesIds.splice(inNode.prevNodesIds.indexOf(outNodeId), 1);
          });
        }

        // Nodes
        for (let i = nodes.current.length - 1; i >= 0; i--) {
          const node = nodes.current[i];
          if (node.isSelected) {
            shouldRerender = true;

            node.nextNodesIds.forEach((nodeId) => {
              const nextNode = nodes.current.find((n) => n.id === nodeId);
              if (nextNode) nextNode.prevNodesIds.splice(nextNode.prevNodesIds.indexOf(node.id));
            });

            node.prevNodesIds.forEach((nodeId) => {
              const prevNode = nodes.current.find((n) => n.id === nodeId);
              if (prevNode) prevNode.nextNodesIds.splice(prevNode.nextNodesIds.indexOf(node.id));
            });

            nodes.current.splice(i, 1);
          }
        }

        autoSaveGraph();
      } else if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          copiedNodes.current = nodes.current
            .filter((n) => n.isSelected)
            .map((n) => {
              return n;
            });
        } else if (e.key === 'v') {
          shouldRerender = true;

          nodes.current.forEach((n) => (n.isSelected = false));

          copiedNodes.current.forEach((n) => {
            nodes.current.push(
              makeNode({
                ...n,
                id: undefined,
                isSelected: true,
                x: n.x + 50,
                y: n.y + 50,
                nextNodesIds: [],
                prevNodesIds: [],
              })
            );
          });

          copiedNodes.current = [];
        }
        autoSaveGraph();
      }

      if (shouldRerender) rerender();
    };

    if (!window.localStorage.getItem('first_load-1')) {
      window.localStorage.setItem('first_load-1', 'true');
      nodes.current = getExampleGraph();
      saveGraph('Example', nodes.current);
      rerender();
    } else {
      (async () => {
        const n = await loadGraph('autosave');
        nodes.current = n;
        saveId.current = null;
        rerender();
      })();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      nodes.current = [];
    };
  }, []);

  const handleMouseDown: CamMouseDown = (e, d) => {
    currentPressedNode.current = null;

    if (d.willMoveCamera) {
      globalBlur();
      return;
    }
    wasPressedWithShift.current = e.shiftKey;

    const node = getNodeUnderMouse(e, nodes.current);

    if (node) {
      const path = e.composedPath() as HTMLElement[];
      let canBeMoved = true;
      for (let i = 0; i < path.length; i++) {
        const el = path[i] as HTMLElement;
        if (el.nodeName === 'DIV' && el.getAttribute('data-prevent-node-movment')) {
          canBeMoved = false;
          break;
        }
      }

      if (canBeMoved) {
        currentPressedNode.current = node;
        e.preventDefault();

        globalBlur();

        if (!e.metaKey && !e.ctrlKey) {
          if (!node.isSelected) {
            if (!e.shiftKey) {
              nodes.current.forEach((n) => {
                n.isSelected = false;
              });
            }
          }
          node.isSelected = true;
        }
      }

      rerender();
    } else {
      globalBlur();
      const pointerId = getPointerUnderMouse(e);
      if (pointerId) {
        e.preventDefault();
        if (!selectedPointers.current.includes(pointerId)) {
          selectedPointers.current.push(pointerId);
        }
      }
    }
  };

  const handleMouseMove: CamMouseMove = (e, d) => {
    const { preventCameraMovment, camera, mouse } = d;

    mousePos.current = { x: e.x, y: e.y };

    if ((e.ctrlKey || e.metaKey || placeholderPointer.current) && currentPressedNode.current && e.buttons === 1) {
      e.preventDefault();
      if (!placeholderPointer.current) {
        const atchP = currentPressedNode.current.comp.attachmentPoints[0];

        if (atchP.outputs) {
          if (typeof atchP.outputs === 'number') {
            const nodeOutPointersAmt = pointers.current.filter((p) => p.outNodeRef.nodeId === currentPressedNode.current?.id).length;
            if (atchP.outputs <= nodeOutPointersAmt) return;
          }
        } else return;
      }

      preventCameraMovment();

      const nodeEl = document.getElementById(currentPressedNode.current.id);
      if (!nodeEl) return;
      const { width, height } = nodeEl.getBoundingClientRect();

      let startX = width / 2 / camera.scale;
      let startY = height / 2 / camera.scale;
      startX += currentPressedNode.current.x;
      startY += currentPressedNode.current.y;

      let endX = mouse.x - startX * camera.scale - camera.x;
      let endY = mouse.y - startY * camera.scale - camera.y;
      endX /= camera.scale;
      endY /= camera.scale;

      placeholderPointer.current = {
        outNode: currentPressedNode.current,
        startX,
        startY,
        endX,
        endY,
      };
      rerender();
      return;
    }
    if (placeholderPointer.current) {
      return;
    }

    let selectedNodes = nodes.current.filter((n) => n.isSelected);
    if (selectedNodes.length > 0 && currentPressedNode.current) {
      e.preventDefault();
      preventCameraMovment();

      selectedNodes.forEach((n) => {
        let addX = e.movementX / camera.scale;
        let addY = e.movementY / camera.scale;
        n.x += addX;
        n.y += addY;

        const nodeOutPointers = pointers.current.filter((p) => p.outNodeRef.nodeId === n.id);

        nodeOutPointers.forEach((p) => {
          p.startX += addX;
          p.startY += addY;
          p.endX -= addX;
          p.endY -= addY;
        });

        const nodeInPointers = pointers.current.filter((p) => p.inNodeRef.nodeId === n.id);

        nodeInPointers.forEach((p) => {
          p.endX += addX;
          p.endY += addY;
        });
      });
      rerender();
      autoSaveGraph();
    }
  };

  const handleMouseUp: CamMouseUp = (e, d) => {
    const { hasMovedCamera, pressPoint } = d;

    let shouldRerender = false;

    if (!hasMovedCamera) {
      if (!currentPressedNode.current) {
        nodes.current.forEach((n) => (n.isSelected = false));
        shouldRerender = true;
      } else {
        if (pressPoint?.x === e.x && pressPoint?.y === e.y) {
          if (!wasPressedWithShift.current) {
            nodes.current.forEach((n) => {
              if (n !== currentPressedNode.current) {
                n.isSelected = false;
              }
            });
            shouldRerender = true;
          }
        }
      }
    }

    if (placeholderPointer.current) {
      const inNode = getNodeUnderMouse(e, nodes.current);
      if (inNode) {
        const atchP = inNode.comp.attachmentPoints[0];
        const inputsPointersAmt = pointers.current.filter((p) => p.inNodeRef.nodeId === inNode.id).length;
        const inCond =
          atchP.inputs && (typeof atchP.inputs === 'boolean' || (typeof atchP.inputs === 'number' && atchP.inputs > inputsPointersAmt));

        if (inCond && !inNode.nextNodesIds.includes(placeholderPointer.current.outNode.id)) {
          if (!placeholderPointer.current.outNode.nextNodesIds.includes(inNode.id)) {
            placeholderPointer.current.outNode.nextNodesIds.push(inNode.id);
          }

          if (!inNode.prevNodesIds.includes(placeholderPointer.current.outNode.id)) {
            inNode.prevNodesIds.push(placeholderPointer.current.outNode.id);
          }
        }
      }

      placeholderPointer.current = null;

      nodes.current.forEach((n) => {
        n.isSelected = false;
      });
      shouldRerender = true;
      autoSaveGraph();
    }

    currentPressedNode.current = null;
    wasPressedWithShift.current = null;

    if (shouldRerender) rerender();
  };

  const setNodeSetting = (id: string, key: string, value: any) => {
    const node = nodes.current.find((n) => n.id === id);
    if (node) {
      // @ts-ignore
      node.settings[key] = value;

      autoSaveGraph();
      rerender();
    }
  };

  return (
    <div>
      <Head>
        <title>Code presenter</title>
        <meta name="description" content="A very in-development code presenter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mode.current === 'presenter' && (
        <Presenter
          nodes={nodes.current}
          stopPresenting={() => {
            mode.current = 'editor';
            rerender();
          }}
        />
      )}
      <SaveLoad
        nodes={nodes.current}
        saveId={saveId.current}
        onLoadSave={(newNodes, _saveId: string) => {
          nodes.current = newNodes;
          saveId.current = _saveId;
          rerender();
          autoSaveGraph()
        }}
      />

      <StartPresentingBtn
        onClick={() => {
          mode.current = 'presenter';
          rerender();
        }}
      />
      <ClearGraphBtn
        onClick={() => {
          nodes.current = [];
          saveId.current = null;
          autoSaveGraph();
          rerender();
        }}
      />

      <InfoBox />

      <Camera disabled={mode.current === 'presenter'} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
        <CamCanvas
          saveId={saveId.current}
          setNodeSetting={setNodeSetting}
          nodes={nodes.current}
          selectedPointers={selectedPointers.current}
          addNode={addNode}
          placeholderPointer={placeholderPointer.current}
        />
      </Camera>
    </div>
  );
}
