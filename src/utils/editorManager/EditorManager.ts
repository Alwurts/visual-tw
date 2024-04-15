// CodeManager.ts
import * as parse5 from "parse5";
import { findNodeById, traverseParse5Document } from "../parseDom";
import viewerElementOverlay from "../../utils/viewerElementOverlay.js?raw";
import DEFAULT_HEAD from "../../utils/editorManager/defaultHead.html?raw";
import { v4 as uuidv4 } from "uuid";

type ObserverFunction = (editorNotification: {
  htmlContent: string;
  dom: unknown;
}) => void;

class EditorManager {
  private static instance: EditorManager;
  private observers: ObserverFunction[];
  private dom: unknown;
  private serializedDom: string = "";
  private code: string = "";

  private constructor() {
    this.observers = [];
  }

  public static getInstance(): EditorManager {
    if (!EditorManager.instance) {
      EditorManager.instance = new EditorManager();
    }
    return EditorManager.instance;
  }

  private parseHTMLString(html: string) {
    /* const completeHTML = `<!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
    
      <body class="bg-white">
        ${html}
      </body>
    </html>`; */

    const document = parse5.parse(html, {
      sourceCodeLocationInfo: true,
    });

    traverseParse5Document(document, (node) => {
      const nodeIdentifier = uuidv4();

      if (node.tagName) {
        node.attrs.push({
          name: "visual-tw-id",
          value: nodeIdentifier,
        });

        if (node.tagName === "head") {
          const defaultHeadNode = parse5.parseFragment(DEFAULT_HEAD);
          node.childNodes = defaultHeadNode.childNodes;
        }

        if (node.tagName === "body") {
          const scriptNode = parse5.parseFragment(
            `<script>${viewerElementOverlay}</script>`,
          );
          node.childNodes.push(scriptNode.childNodes[0]);
        }
      }
    });

    const serializedDom = parse5.serialize(document);

    this.code = html;
    this.dom = document;
    this.serializedDom = serializedDom;
    return {
      htmlContent: serializedDom,
      dom: document,
    };
  }

  public updateCode(html: string): void {
    const serializedDom = this.parseHTMLString(html);
    this.notifyObservers(serializedDom);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getNodeById(id: string): any {
    return findNodeById(this.dom, id);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getNodeLocation = (id: string): any => {
    const node = this.getNodeById(id);
    if (!node) return null;
    if (!node.sourceCodeLocation) return null;
    if (
      !node.sourceCodeLocation.startLine ||
      !node.sourceCodeLocation.startCol ||
      !node.sourceCodeLocation.endLine ||
      !node.sourceCodeLocation.endCol
    )
      return null;
    return {
      startLineNumber: node.sourceCodeLocation.startLine,
      startColumn: node.sourceCodeLocation.startCol,
      endLineNumber: node.sourceCodeLocation.endLine,
      endColumn: node.sourceCodeLocation.endCol,
    };
  };

  public getDOM(): unknown {
    return this.dom;
  }

  public getSerializedDOM(): string {
    return this.serializedDom;
  }

  public getCode(): string {
    return this.code;
  }

  public subscribe(observerFunction: ObserverFunction): void {
    this.observers.push(observerFunction);
  }

  public unsubscribe(observerFunction: ObserverFunction): void {
    this.observers = this.observers.filter(
      (subscriber) => subscriber !== observerFunction,
    );
  }

  private notifyObservers(editorNotification: {
    htmlContent: string;
    dom: unknown;
  }): void {
    this.observers.forEach((observerFunction) =>
      observerFunction(editorNotification),
    );
  }
}

export const editorManager = EditorManager.getInstance();
