import '@uiw/react-textarea-code-editor/dist.css';
import Editor from '@uiw/react-textarea-code-editor';

interface Props {
  value?: string;
  onChange?: (code: string) => void;
  disabled?: boolean;
}

const CodeEditor = ({ value, onChange, disabled }: Props) => {
  return (
    <Editor
      value={value}
      language="tsx"
      disabled={disabled}
      placeholder="Your code here"
      onChange={(evn) => {
        if (onChange) onChange(evn.target.value);
      }}
      padding={5}
      style={{
        fontSize: 12,
        borderRadius: '8px',
        backgroundColor: '#444444',
        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
      }}
    />
  );
};

export { CodeEditor };
