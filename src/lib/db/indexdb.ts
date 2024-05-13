// db.ts
import Dexie from "dexie";

export interface Project {
  id: string;
  name: string;
  description?: string;
  screenshot: string;
  autoSavedCode: string;
  currentCommit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commit {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  fileContent: string;
  screenshot: string;
  timestamp: Date;
}

class CodeEditorDB extends Dexie {
  projects: Dexie.Table<Project, string>;
  commits: Dexie.Table<Commit, string>;

  constructor() {
    super("CodeEditorDB");
    this.version(1).stores({
      projects: "id, name, description, createdAt, currentVersion",
      commits:
        "id, projectId, version, fileContent, screenshot, commitMessage, timestamp",
    });

    this.projects = this.table("projects");
    this.commits = this.table("commits");
  }
}

export const db = new CodeEditorDB();
