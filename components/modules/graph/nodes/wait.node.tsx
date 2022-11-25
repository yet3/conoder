import { Input } from '@components/common/input';
import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {
    duration: number;
  };
}>;

const Node: T = function (props) {
  const { settings, setSetting } = props;

  return (
    <BaseNode {...props} node={Node}>
      <Input
        label="Seconds"
        className="w-24"
        type="number"
        value={settings.duration}
        onChange={(v) => setSetting('duration', v as number)}
        min={0}
        step='1'
      />
    </BaseNode>
  );
};

Node.nodeName = 'Wait';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: 1, outputs: true }];
Node.defaultSettings = {
  duration: 5,
};
Node.execute = async ({ settings, forPreview }, next) => {
  if (forPreview) {
    next();
    return;
  }
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, settings.duration * 1000);
  });

  next()
};

export { Node as WaitNode };
