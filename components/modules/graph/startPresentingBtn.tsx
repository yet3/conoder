interface Props {
  onClick: () => void;
}

const StartPresentingBtn = ({ onClick }: Props) => {
  return (
    <aside className="absolute left-1/2 -translate-x-1/2 top-5 z-50 opacity-80">
      <button
        onClick={onClick}
        className="shadow shadow-black/40 bg-node bg-black/75 rounded-lg px-2 shiny-border before:rounded-[9px] h-8 grid place-items-center tracking-widest text-sm leading-none uppercase"
      >
        Start presenting
      </button>
    </aside>
  );
};

export { StartPresentingBtn };
