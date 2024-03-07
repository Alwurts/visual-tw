import { JSDOM } from "jsdom";

class EditorManager {
  constructor() {
    if (EditorManager.instance == null) {
      this.observers = [];
      EditorManager.instance = this;
    }

    return EditorManager.instance;
  }

  parse(html) {
    this.dom = new JSDOM(html);
    this.notifyObservers();
  }

  getHTML() {
    return this.dom.serialize();
  }

  registerObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers() {
    for (let observer of this.observers) {
      observer.update(this.getHTML());
    }
  }
}

const editorManager = new EditorManager();
Object.freeze(EditorManager);

export default editorManager;
