import { GNodeComp } from '@typings/graph';
import clsx from 'clsx';
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { findBestMatch } from 'string-similarity';

const getHilighted = (text: string, value?: string) => {
  if (!value) return text;

  const words = value.split(' ');

  let indexes: { startI: number; endI: number }[] = [];

  words.forEach((w) => {
    const i = text.toLowerCase().indexOf(w.toLowerCase());
    if (i >= 0 && w.length > 0) indexes.push({ startI: i, endI: i + w.length });
  });

  indexes = indexes.sort((a, b) => a.startI - b.startI);

  let acc: ReactNode[] = [];
  let prevEndI = 0;
  indexes.forEach(({ startI, endI }) => {
    acc.push(<span key={`${prevEndI}-${startI}`}>{text.substring(prevEndI, startI)}</span>);

    acc.push(
      <mark className="bg-blue-100/25 text-node-primary rounded px-[2px]" key={`${startI}-${endI}`}>
        {text.substring(startI, endI)}
      </mark>
    );

    prevEndI = endI;
  });
  acc.push(<span key={`${prevEndI}-${text.length}`}>{text.substring(prevEndI, text.length)}</span>);

  return <div>{acc}</div>;
};

interface Props {
  onPick?: (nodeComp: GNodeComp, pos: Pos) => void;
}

const NodeSelector = ({ onPick }: Props) => {
  const [nodes, setNodes] = useState<GNodeComp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pos, setPos] = useState<Pos | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mousePos = useRef<Pos>({ x: -999999999, y: -999999999 });
  const ref = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);

  const sortedNodes = useMemo(() => {
    if (!searchQuery) return nodes.sort((a, b) => a.nodeName.localeCompare(b.nodeName));

    let nodesNames: string[] = nodes.map((n) => n.nodeName);
    const bestMatches = findBestMatch(searchQuery, nodesNames);

    const rated = bestMatches.ratings.sort((a, b) => b.rating - a.rating);

    const sortedNodes: GNodeComp[] = [];
    rated.forEach(({ target: nodeName }) => {
      const node = nodes.find((n) => n.nodeName === nodeName);
      if (node) sortedNodes.push(node);
    });
    return sortedNodes;
  }, [nodes, searchQuery]);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const t = await import('./nodes');
        const tmp: GNodeComp[] = [];
        Object.values(t).forEach((m) => {
          tmp.push(m as any);
        });
        setNodes(tmp);
      } catch (e) {
        console.log(e);
        setNodes([]);
      }
    };
    loadNodes();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseDown = (e: globalThis.MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        setPos(null);
      }
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mousePos.current = { x: e.x, y: e.y };
    };

    const handleOnKeyDown = (e: globalThis.KeyboardEvent) => {
      const { key } = e;

      if (key === 'Escape' && pos) {
        e.preventDefault();
        e.stopPropagation();
        setPos(null);
        return;
      }

      if (e.key === 'Tab' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();

        setSelectedIndex((oldI) => {
          let newI = 0;
          if (e.shiftKey || e.key === 'ArrowUp') {
            if (oldI > 0) newI = oldI - 1;
            else newI = nodes.length - 1;
          } else if (oldI < nodes.length - 1) newI = oldI + 1;

          if (listRef.current) {
            const list = listRef.current;
            const el = list.childNodes[newI] as HTMLElement;
            if (el.nodeName === 'LI') el.scrollIntoView();
          }

          return newI;
        });
        return;
      }

      let fNodeName = document.activeElement?.nodeName;
      if (document.activeElement) {
        const atr = document.activeElement.getAttribute('role');
        if (atr === 'textbox') fNodeName = 'TEXTAREA';
      }

      if (key === ' ' && !['TEXTAREA', 'INPUT'].includes(fNodeName || '')) {
        e.preventDefault();
        setPos({ ...mousePos.current });
      }
    };

    if (pos) window.addEventListener('mousedown', handleMouseDown);
    else {
      setSelectedIndex(0);
      setSearchQuery('');
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleOnKeyDown);
    return () => {
      if (pos) window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleOnKeyDown);
    };
  }, [pos]);

  const handleSearchQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedIndex(0);
    setSearchQuery(value);
  };

  const handleOnPick = (index = selectedIndex) => {
    if (onPick && pos && index >= 0) {
      onPick(sortedNodes[index], pos);
    }
    setPos(null);
  };

  if (!pos) return null;

  return (
    <aside
      ref={ref}
      className="absolute z-50"
      style={{ top: pos.y, left: pos.x }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleOnPick();
      }}
    >
      <div className="w-64 overflow-hidden shiny-border before:rounded-[9px] bg-node rounded-lg text-sm text-node-primary">
        <input
          autoFocus
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="outline-none w-full py-1 px-2 rounded-t-lg bg-node border-b border-b-node"
        />
        <ol ref={listRef} className="p-1 grid gap-2 content-start max-h-32 overflow-auto">
          {sortedNodes.map((node, i) => (
            <li
              key={node.nodeName}
              className={clsx(selectedIndex === i ? 'text-node-primary' : ' text-node-secondary', 'outline-none')}
              role="button"
              onClick={() => handleOnPick(i)}
            >
              {getHilighted(node.nodeName, searchQuery)}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
};

export { NodeSelector };
