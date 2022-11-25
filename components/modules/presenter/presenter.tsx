import '@uiw/react-textarea-code-editor/dist.css';
import Editor from '@uiw/react-textarea-code-editor';
import { GNode } from '@typings/graph';
import { useEffect, useRef, useState } from 'react';
import { nodesToTimelines, TimelinePart } from '../graph/nodesToTimelines.util';
import { useRerender } from '@components/common/useRerender.hook';
import { autoId } from '@utils/autoId.util';
import clsx from 'clsx';

interface Props {
  nodes: GNode[];
  stopPresenting: () => void;
}

const Presenter = ({ nodes, stopPresenting }: Props) => {
  const presentationId = useRef(autoId());
  const content = useRef('');
  const [showUi, setShowUi] = useState(true);
  const rerender = useRerender();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeout = setTimeout(() => {
      setShowUi(false);
    }, 300);

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        stopPresenting();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    let savedId = presentationId.current;

    (async () => {
      const timelines = nodesToTimelines(nodes);

      const executeTimelines = async (timelines: TimelinePart[]) => {
        const proms: Promise<void>[] = [];

        timelines.forEach((p) => {
          proms.push(
            new Promise((resolve) => {
              const onNext = async () => {
                if (savedId !== presentationId.current) {
                  resolve();
                  return;
                }

                rerender();
                await executeTimelines(p.next);
                resolve();
              };

              p.execute(
                { id: p.nodeId, settings: p.nodeSettings, content: content.current, setContent: (v) => (content.current = v) },
                onNext
              );
            })
          );
        });

        await Promise.all(proms);
      };

      await executeTimelines(timelines);
    })();

    return () => {
      savedId = 'nope';
      content.current = '';
      rerender();
    };
  }, [nodes, presentationId.current]);

  return (
    <aside className="fixed z-[500] top-0 left-0 w-screen h-screen bg-dark-gray px-12 pb-24 pt-0">
      <div className={clsx('h-12 flex gap-4 transition-opacity hover:opacity-100', showUi ? 'opacity-100' : 'opacity-0')}>
        <button onClick={stopPresenting}>Close presenter</button>
        <button
          onClick={() => {
            content.current = '';
            presentationId.current = autoId();
            rerender();
          }}
        >
          Reset
        </button>
      </div>
      <Editor
        value={content.current}
        language="tsx"
        disabled={true}
        padding={20}
        style={{
          fontSize: 16,
          borderRadius: '8px',
          height: '100%',
          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
      />
    </aside>
  );
};

export { Presenter };
