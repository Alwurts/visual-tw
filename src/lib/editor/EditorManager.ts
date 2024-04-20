import * as parse5 from "parse5";

import * as domTools from "../dom";
import DEFAULT_HEAD_CODE from "./defaultHeadCode.html?raw";
import VIEWER_CODE from "../viewer.js?raw";
import DEFAULT_EDITOR_CODE from "./defaultEditorCode.html?raw";

import { v4 as uuidv4 } from "uuid";
import { IRange } from "monaco-editor";
import {
  EditorNotification,
  ElementSelectedTypes,
} from "@/types/EditorManager";
import { Node } from "node_modules/parse5/dist/tree-adapters/default";

type SubscriberFunction = (editorNotification: EditorNotification) => void;

class EditorManager {
  private static instance: EditorManager;
  private subscribers: SubscriberFunction[];
  private dom: Node;
  private serializedDom: string;
  private code: string;
  private selectedElement: Node | null = null;

  private constructor() {
    this.subscribers = [];
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

    domTools.traverseDocument(document, (node) => {
      const nodeIdentifier = uuidv4();

      if ("attrs" in node) {
        node.attrs.push({
          name: "visual-tw-id",
          value: nodeIdentifier,
        });

        if (node.tagName === "head") {
          const defaultHeadNode = parse5.parseFragment(DEFAULT_HEAD_CODE);
          node.childNodes = defaultHeadNode.childNodes;
        }

        if (node.tagName === "head") {
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
    this.notifySubscribers({
      type: "code-update",
      data: {
        code: this.code,
        dom: this.dom,
        serializedDom: this.serializedDom,
      },
    });

    if (this.selectedElement) {
      const selectedElementUUID = domTools.getElementAttribute(
        this.selectedElement,
        "visual-tw-id",
      );

      console.log(selectedElementUUID);

      if (selectedElementUUID) {
        /* this.selectElement("editor-element-selected", selectedElementUUID); */
        this.notifySubscribers({
          type: "editor-element-selected",
          data: {
            uuid: selectedElementUUID,
          },
        });
      }
    }
  }

  public selectElement(
    type: (typeof ElementSelectedTypes)[number],
    uuid: string,
  ) {
    this.selectedElement = domTools.getElementByUUID(this.dom, uuid);
    this.notifySubscribers({
      type,
      data: {
        uuid,
      },
    });
  }

  public getElementByUUID(uuid: string) {
    return domTools.getElementByUUID(this.dom, uuid);
  }

  public getElementByTagName(tagName: string) {
    return domTools.getElementsByTagName(this.dom, tagName);
  }

  public getElementSourceCodeLocation(uuid: string): IRange | null {
    const node = this.getElementByUUID(uuid);
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
  }

  public getDOM() {
    return this.dom;
  }

  public getSerializedDOM() {
    return this.serializedDom;
  }

  public getCode() {
    return this.code;
  }

  public relayMessage(message: EditorNotification) {
    this.notifySubscribers(message);
  }

  public subscribe(subscriberFunction: SubscriberFunction): void {
    this.subscribers.push(subscriberFunction);
  }

  public unsubscribe(subscriberFunction: SubscriberFunction): void {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== subscriberFunction,
    );
  }

  private notifySubscribers(editorNotification: EditorNotification): void {
    this.subscribers.forEach((subscriberFunction) =>
      subscriberFunction(editorNotification),
    );
  }
}

export const editorManager = EditorManager.getInstance();
