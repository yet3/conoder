import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';
import { CodeEditor } from '../codeEditor';

type T = GNodeComp<{
  settings: {
    code: string;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { code },
    setSetting,
  } = props;

  return (
    <BaseNode {...props} node={Node} className="text-left" contentClassName='w-64'>
      <CodeEditor value={code} onChange={(v) => setSetting('code', v)} />
    </BaseNode>
  );
};

Node.nodeName = 'Code: Insert';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: true, outputs: true }];
Node.defaultSettings = {
  code: '',
};
Node.execute = async ({ settings, content, setContent }, next) => {
  const { code } = settings;
  const lines = content.length === 0 ? [] : content.split('\n');
  lines.push(code);
  setContent(lines.join('\n'));
  next();
};

export { Node as CodeInsertNode };
