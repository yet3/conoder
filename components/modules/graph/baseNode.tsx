import { GNodeBaseProps, GNodeComp } from '@typings/graph';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props extends GNodeBaseProps {
  node: GNodeComp<any>;
  children?: ReactNode;

  clearStyle?: boolean;
  className?: string;
  hideHeader?: boolean;
  contentClassName?: string;
}

const BaseNode = ({ children, node, id, hideHeader, isSelected, clearStyle, className, contentClassName }: Props) => {
  return (
    <div
      id={id}
      data-is-node
      className={clsx(
        className,
        !clearStyle && 'node shiny-border before:rounded-[9px]',
        !clearStyle && isSelected && 'node-border-selected'
      )}
    >
      {!hideHeader && (
        <header className={clsx('py-2 px-4 text-center text-node-primary', children && 'border-b border-node')}>
          <h3 className="capitalize text-xs text-node-secondary italic">{node.nodeType}</h3>
          <h2>{node.nodeName}</h2>
        </header>
      )}

      {children && (
        <div data-prevent-node-movment className={clsx(contentClassName, 'node-content')}>
          {children}
        </div>
      )}

      {node.attachmentPoints.map((point) => (
        <div
          id={`${id}-${point.id}`}
          key={point.id}
          hidden
          className="absolute w-2 h-2 rounded-full bg-pink-400/20 -translate-x-1/2 -translate-y-1/2"
          style={{ top: point.y, left: point.x }}
        />
      ))}
    </div>
  );
};
export { BaseNode };
