import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';
import { Input } from '@components/common/input';

type T = GNodeComp<{
  settings: {
    line: number;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { line },
    setSetting,
  } = props;
  return (
    <BaseNode {...props} node={Node} className="text-left" contentClassName="gap-4">
      <Input
        containerClassName="mx-auto w-24"
        label="Line"
        type="number"
        min={1}
        value={line}
        onChange={(v) => setSetting('line', v as number)}
      />
    </BaseNode>
  );
};

Node.nodeName = 'Code: Delete line';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: true, outputs: true }];
Node.defaultSettings = {
  line: 1,
};
Node.execute = async ({ settings, content, setContent }, next) => {
  const { line } = settings;
  const lines = content.length === 0 ? [] : content.split('\n');

  if (lines.length >= line) {
    lines.splice(line, 1);
  }

  setContent(lines.join('\n'));
  next();
};

export { Node as CodeDeleteLineNode };
