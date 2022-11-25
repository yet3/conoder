import { Input } from '@components/common/input';
import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {
    key: string;
    isPickingKey: boolean;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { isPickingKey, key },
    setSetting,
  } = props;

  const setIsPickingKey = (value: boolean) => setSetting('isPickingKey', value);

  return (
    <BaseNode {...props} node={Node} className="w-32">
      <Input
        label="Key"
        value={isPickingKey ? '' : key}
        placeholder={isPickingKey ? 'Press key...' : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.currentTarget.blur();
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          if (e.key === ' ') setSetting('key', 'Space');
          else setSetting('key', e.key);

          e.currentTarget.blur();
        }}
        onFocus={() => {
          setIsPickingKey(true);
        }}
        onBlur={() => {
          setIsPickingKey(false);
        }}
        className="text-center"
      />
    </BaseNode>
  );
};

Node.nodeName = 'On Key Press';
Node.nodeType = 'event';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: 1, outputs: true }];
Node.defaultSettings = { key: 'Space', isPickingKey: false };
Node.execute = async ({ settings, forPreview }, next) => {
  let { key } = settings;
  if (key === 'Space') key = ' ';

  if (typeof window === 'undefined' || forPreview) {
    next();
    return;
  }

  const handleKeyDown = (e: globalThis.KeyboardEvent) => {
    if (e.key === key) {
      e.preventDefault();
      e.stopPropagation();
      window.removeEventListener('keydown', handleKeyDown);
      next();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
};

export { Node as OnKeyPressNode };
