import { GNodeComp } from '@typings/graph';
import { BaseNode } from '../baseNode';
import { Input } from '@components/common/input';
import { setServers } from 'dns';

type T = GNodeComp<{
  settings: {
    lineFrom: number;
    lineTo: number;
  };
}>;

const Node: T = function (props) {
  const {
    settings: { lineFrom, lineTo },
    setSetting,
  } = props;
  return (
    <BaseNode {...props} node={Node} className="text-left" contentClassName="gap-2">
      <Input
        containerClassName="mx-auto w-24"
        type="number"
        min={1}
        value={lineFrom}
        onChange={(v) => {
          if (lineTo <= v) setSetting('lineTo', (v as number) + 1);
          setSetting('lineFrom', v as number);
        }}
      />
      <span className="text-center">To</span>
      <Input
        containerClassName="mx-auto w-24"
        type="number"
        min={lineFrom + 1}
        value={lineTo}
        onChange={(v) => setSetting('lineTo', v as number)}
      />
    </BaseNode>
  );
};

Node.nodeName = 'Code: Delete lines';
Node.nodeType = 'action';
Node.attachmentPoints = [{ id: 'outputs', x: '50%', y: '50%', inputs: true, outputs: true }];
Node.defaultSettings = {
  lineFrom: 1,
  lineTo: 2,
};
Node.execute = async ({ settings, content, setContent }, next) => {
  let { lineFrom, lineTo } = settings;
  const lines = content.length === 0 ? [] : content.split('\n');

  lineFrom -= 1;
  lineTo -= 1;
  lines.splice(lineFrom, lineTo - lineFrom + 1);

  setContent(lines.join('\n'));
  next();
};

export { Node as CodeDeleteLinesNode };
