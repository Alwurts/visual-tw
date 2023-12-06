interface CodeEditorProps {
  code: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <textarea
      className="bg-red-200 w-full"
      value={code}
      onChange={onChange}
      rows={10}
      cols={50}
    />
  );
};

export default CodeEditor;
