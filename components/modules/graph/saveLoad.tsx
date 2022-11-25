import { Input } from '@components/common/input';
import { GNode } from '@typings/graph';
import { GraphSave } from '@typings/save';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { loadGraph } from './loadGraph.util';
import { saveGraph } from './saveGraph.util';

interface Props {
  nodes: GNode[];
  onLoadSave: (v: GNode[], saveId: string) => void;
  saveId: string | null;
}

const SaveLoad = ({ nodes, onLoadSave, saveId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saves, setSaves] = useState<GraphSave[]>([]);
  const [selectedSaveId, setSelectedSaveId] = useState<null | string>(null);
  const [inputSaveName, setInputSaveName] = useState('');
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isOpen) {
      const handleMouseDown = (e: globalThis.MouseEvent) => {
        if (!ref.current?.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      const savesString = window.localStorage.getItem('saves');
      if (savesString) {
        const parsed = JSON.parse(savesString);
        if (Array.isArray(parsed)) {
          const n = parsed.find((p) => p.id === saveId);
          if (n) setSelectedSaveId(n.id);
          setSaves(parsed);
        }
      }

      window.addEventListener('mousedown', handleMouseDown);
      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        setSaves([]);
      };
    }
  }, [isOpen]);

  const handleOnSave = (name: string = 'Untitled') => {
    if (inputSaveName.trim().length > 0) name = inputSaveName;
    name = name.trim();

    const es = saves.find((s) => s.name === name);

    if (es && !confirm('Are you sure you want to overwrite save?')) {
      return;
    }

    const newSaves = saveGraph(name, nodes, false);
    setSaves(newSaves);
    setIsOpen(false);
    setInputSaveName('');
  };

  const handleDeleteSave = (id: string) => {
    if (confirm('Are you sure you want delete save?')) {
      setSaves((prev) => {
        const cloned = prev.slice();

        const index = cloned.findIndex((c) => c.id === id);
        if (index >= 0) {
          cloned.splice(index, 1);
          window.localStorage.setItem('saves', JSON.stringify(cloned));
        }

        return cloned;
      });
    }
  };

  const handleLoad = async (idToLoad = selectedSaveId) => {
    if (idToLoad) {
      onLoadSave(await loadGraph(idToLoad), idToLoad);
      setIsOpen(false);
    }
  };

  return (
    <aside className="absolute right-5 top-5 z-50 opacity-80" ref={ref}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="shadow shadow-black/40 bg-node bg-black/75 rounded-lg px-2 shiny-border before:rounded-[9px] h-8 grid place-items-center tracking-widest text-sm leading-none uppercase"
        >
          save / load
        </button>
      ) : (
        <div className="shadow shadow-black/40 bg-node bg-black/75 rounded-lg p-2 shiny-border before:rounded-[9px] grid place-items-center text-sm w-64 overflow-hidden">
          <h2 className="leading-none uppercase tracking-widest">SAVES / LOADS</h2>
          <ul className="w-full h-48 my-2 overflow-auto">
            {saves.map((save) => (
              <li
                key={save.id}
                className={clsx('p-2 rounded relative', selectedSaveId === save.id && 'bg-blue-100/25')}
                onDoubleClick={() => {
                  handleLoad(save.id);
                }}
                onClick={() => {
                  setSelectedSaveId(save.id);
                  setInputSaveName(save.name);
                }}
                role="button"
              >
                {save.name}

                <button onClick={() => handleDeleteSave(save.id)} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 h-[1px] bg-white rotate-45" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 h-[1px] bg-white -rotate-45" />
                </button>
              </li>
            ))}
          </ul>

          <Input
            label="Save name"
            className="mb-4"
            placeholder="Untitled"
            onChange={(v) => setInputSaveName(v as string)}
            value={inputSaveName}
          />
          <div className="flex gap-4">
            <button
              disabled={nodes.length === 0}
              className="border border-node rounded-lg py-1 px-2 disabled:text-node-secondary"
              onClick={() => handleOnSave()}
            >
              SAVE
            </button>
            <button
              onClick={() => handleLoad()}
              className={clsx('border border-node rounded-lg py-1 px-2 disabled:text-node-secondary')}
              disabled={!selectedSaveId}
            >
              LOAD
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export { SaveLoad };
