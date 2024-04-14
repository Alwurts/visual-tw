// CodeManager.ts
import * as parse5 from "parse5";
import { traverseParse5Document } from "../parseDom";
import renderScript from "../../utils/render.js?raw";

type ObserverFunction = (htmlContent: string) => void;

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
    const document = parse5.parse(html, { sourceCodeLocationInfo: true });

    traverseParse5Document(document, (node) => {
      if (node.tagName && node.sourceCodeLocation) {
        if (node.tagName === "body") {
          const scriptNode = parse5.parseFragment(
            `<script>${renderScript}</script>`,
          );
          node.childNodes.push(scriptNode.childNodes[0]);
        }
      }
    });

    const serializedDom = `<!doctype html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
    
      <body class="bg-white">
        ${parse5.serialize(document)}
      </body>
    </html>`;

    this.code = html;
    this.dom = document;
    this.serializedDom = serializedDom;
    return serializedDom;
  }

  public updateCode(html: string): void {
    const serializedDom = this.parseHTMLString(html);
    this.notifyObservers(serializedDom);
  }

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

  private notifyObservers(htmlContent: string): void {
    this.observers.forEach((observerFunction) => observerFunction(htmlContent));
  }
}

export const editorManager = EditorManager.getInstance();
