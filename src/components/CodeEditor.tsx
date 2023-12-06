interface CodeEditorProps {
  code: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <textarea
      className="w-full resize-none overflow-auto whitespace-nowrap"
      value={code}
      onChange={onChange}
      rows={10}
      cols={50}
    />
  );
};

export default CodeEditor;
