import { IRange, type editor as monacoEditor } from "monaco-editor";

export function selectCode(
  editor: monacoEditor.IStandaloneCodeEditor,
  range: IRange,
) {
  editor.setSelection(range);
  editor.revealLineInCenter(range.startLineNumber);
}

export function insertCode(
  editor: monacoEditor.IStandaloneCodeEditor,
  range: IRange,
  newCode: string,
) {
  editor.executeEdits("ALWURTS", [
    {
      range,
      text: newCode,
      forceMoveMarkers: true,
    },
  ]);
}

export function insertElements(
  editor: monacoEditor.IStandaloneCodeEditor,
  range: IRange,
  type: "h1" | "h2" | "h3" | "div" | "span" | "p",
) {
  switch (type) {
    case "h1":
      insertCode(editor, range, "\r\n<h1>Lorem ipsum</h1>\r\n");
      break;
    case "h2":
      insertCode(editor, range, "\r\n<h2>Lorem ipsum</h2>\r\n");
      break;
    case "h3":
      insertCode(editor, range, "\r\n<h3>Lorem ipsum</h3>\r\n");
      break;
    case "div":
      insertCode(editor, range, "\r\n<div></div>\r\n");
      break;
    case "span":
      insertCode(editor, range, "\r\n<span>Lorem ipsum</span>\r\n");
      break;
    case "p":
      insertCode(
        editor,
        range,
        "\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\r\n",
      );
      break;
  }
}

export function formatEditorCode(editor: monacoEditor.IStandaloneCodeEditor) {
  editor.getAction("editor.action.formatDocument")?.run();
}
