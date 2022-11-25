interface Props {
  onClick: () => void;
}

const ClearGraphBtn = ({ onClick }: Props) => {
  const handleClick = () => {
    if (confirm('Are you sure you want to clear graph?')) {
      onClick();
    }
  }

  return (
    <aside className="absolute right-5 bottom-5 z-50 opacity-80">
      <button
        onClick={handleClick}
        className="shadow shadow-black/40 bg-node bg-black/75 rounded-lg px-2 shiny-border before:rounded-[9px] h-8 grid place-items-center tracking-widest text-sm leading-none uppercase"
      >
        CLEAR GRAPH
      </button>
    </aside>
  );
};

export { ClearGraphBtn };
