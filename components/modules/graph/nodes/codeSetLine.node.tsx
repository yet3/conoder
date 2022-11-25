import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';
import { Input } from '@components/common/input';
import { CodeEditor } from '../codeEditor';

type T = GNodeComp<{
  settings: {
    code: string;
    line: number;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { code, line },
    setSetting,
  } = props;
  return (
    <BaseNode {...props} node={Node} className="text-left" contentClassName="gap-4 w-64">
      <Input
        containerClassName="mx-auto w-24"
        label="Line"
        type="number"
        min={1}
        value={line}
        onChange={(v) => {
          setSetting('line', v as number);
        }}
      />
      <CodeEditor value={code} onChange={(v) => setSetting('code', v)} />
    </BaseNode>
  );
};

Node.nodeName = 'Code: Set line';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: true, outputs: true }];
Node.defaultSettings = {
  line: 1,
  code: '',
};
Node.execute = async ({ settings, content, setContent }, next) => {
  const { code, line } = settings;
  const lines = content.length === 0 ? [] : content.split('\n');

  if (lines.length >= line) {
    lines.splice(line - 1, 1, ...code.split('\n'));
  } else {
    const amtOfLinesToAdd = line - lines.length - 1;
    for (let i = 0; i < amtOfLinesToAdd; i++) {
      lines.push('');
    }
    lines.push(...code.split('\n'));
  }

  setContent(lines.join('\n'));
  next();
};

export { Node as CodeSetLineNode };
