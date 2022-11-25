import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';

type T = GNodeComp<{
  settings: {
    msg: string;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { msg },
    setSetting,
  } = props;
  return (
    <BaseNode {...props} node={Node}>
      <textarea className="bg-input p-2 rounded-lg rows-5" value={msg ?? ''} onChange={(e) => setSetting('msg', e.target.value)} />
    </BaseNode>
  );
};

Node.nodeName = 'DEBUG Log';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: true, outputs: true }];
Node.defaultSettings = {
  msg: '',
};
Node.execute = async ({settings, content, setContent}, next) => {
  let lines = content.split('\n')
  if (lines.length === 1 && lines[0] === '') lines = []

  lines.push(...settings.msg.split('\n'))
  setContent(content + settings.msg)

  setContent(lines.join('\n'))

  next()
}

export { Node as DebugLogNode };
