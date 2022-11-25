import { InfoSvg } from '@components/common/icons/info.svg';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const InfoBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.localStorage.getItem('first_page_entry_info_box-1')) {
      window.localStorage.setItem('first_page_entry_info_box-1', 'true');
      setIsOpen(true);
    }
  }, []);

  return (
    <aside className="absolute left-5 top-5 z-50 opacity-80">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="shadow shadow-black/40 bg-node bg-black/75 rounded-lg p-2 shiny-border before:rounded-[9px] w-8 h-8 grid place-items-center"
        >
          <InfoSvg height={15} />
        </button>
      ) : (
        <div
          className={clsx(
            'shadow shadow-black/40 bg-node bg-black/75 rounded-lg p-2 shiny-border before:rounded-[9px] flex flex-col w-64 text-sm text-node-primary gap-2'
          )}
        >
          <button className="mx-auto text-center text-xs text-node-secondary tracking-widest" onClick={() => setIsOpen(false)}>
            HIDE
          </button>
          <p>To move camera simple drag your mouse over empty space.</p>
          <p>You can zoom in/out by using your scroll wheel.</p>
          <p>
            To open node selector press <span className="bg-input rounded px-1">space</span> wile not being focused on any node/pointer.
          </p>
          <p>
            To conntect nodes with each other hold <span className="bg-input rounded px-1">ctrl</span> or{' '}
            <span className="bg-input rounded px-1">command</span> key and drag moves form one node to another.
          </p>
          <p>
            You can select multiple nodes by holding <span className="bg-input rounded px-1">shift</span> key.
          </p>
          <p>
            You can delete selected nodes/pointers by pressing <span className="bg-input rounded px-1">delete</span> or{' '}
            <span className="bg-input rounded px-1">backspace</span>.
          </p>
        </div>
      )}
    </aside>
  );
};

export { InfoBox };
