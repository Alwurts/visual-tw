import * as parse5 from "parse5";
import type { DefaultTreeAdapterMap } from "parse5";

import { getElementByUUID, traverseDocument } from "../dom";
import DEFAULT_HEAD_CODE from "./defaultHeadCode.html?raw";
import VIEWER_CODE from "../viewer.js?raw";
import DEFAULT_EDITOR_CODE from "./defaultEditorCode.html?raw";

import { v4 as uuidv4 } from "uuid";
import { IRange } from "monaco-editor";

type ObserverFunction = (editorNotification: {
  htmlContent: string;
  dom: unknown;
}) => void;

class EditorManager {
  private static instance: EditorManager;
  private observers: ObserverFunction[];
  private dom: DefaultTreeAdapterMap["document"];
  private serializedDom: string;
  private code: string;

  private constructor() {
    this.observers = [];
    const { code, dom, serializedDom } =
      this.parseHTMLString(DEFAULT_EDITOR_CODE);
    this.code = code;
    this.dom = dom;
    this.serializedDom = serializedDom;
  }

  public static getInstance(): EditorManager {
    if (!EditorManager.instance) {
      EditorManager.instance = new EditorManager();
    }
    return EditorManager.instance;
  }

  private parseHTMLString(html: string) {
    const document = parse5.parse(html, {
      sourceCodeLocationInfo: true,
    });

    traverseDocument(document, (node) => {
      const nodeIdentifier = uuidv4();

      if ("tagName" in node) {
        node.attrs.push({
          name: "visual-tw-id",
          value: nodeIdentifier,
        });

        if (node.tagName === "head") {
          const defaultHeadNode = parse5.parseFragment(DEFAULT_HEAD_CODE);
          node.childNodes = defaultHeadNode.childNodes;
        }

        if (node.tagName === "body") {
          const scriptNode = parse5.parseFragment(
            `<script>${VIEWER_CODE}</script>`,
          );
          node.childNodes.push(scriptNode.childNodes[0]);
        }
      }
    });

    const serializedDom = parse5.serialize(document);

    return {
      code: html,
      serializedDom: serializedDom,
      dom: document,
    };
  }

  public updateCode(html: string | undefined = undefined): void {
    if (html) {
      const parsedResponse = this.parseHTMLString(html);
      this.code = parsedResponse.code;
      this.dom = parsedResponse.dom;
      this.serializedDom = parsedResponse.serializedDom;
    }
    this.notifyObservers({
      htmlContent: this.serializedDom,
      dom: this.dom,
    });
  }

  private getElement(uuid: string) {
    return getElementByUUID(this.dom, uuid);
  }

  public getElementSourceCodeLocation = (uuid: string): IRange | null => {
    const node = this.getElement(uuid);
    if (!node) {
      return null;
    }

    const sourceCodeLocation = node.sourceCodeLocation;

    if (
      !sourceCodeLocation ||
      !sourceCodeLocation.startLine ||
      !sourceCodeLocation.startCol ||
      !sourceCodeLocation.endLine ||
      !sourceCodeLocation.endCol
    ) {
      return null;
    }

    return {
      startLineNumber: sourceCodeLocation.startLine,
      startColumn: sourceCodeLocation.startCol,
      endLineNumber: sourceCodeLocation.endLine,
      endColumn: sourceCodeLocation.endCol,
    };
  };

  public getDOM() {
    return this.dom;
  }

  public getSerializedDOM() {
    return this.serializedDom;
  }

  public getCode() {
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
