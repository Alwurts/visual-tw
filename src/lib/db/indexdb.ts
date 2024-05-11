// db.ts
import Dexie from "dexie";

interface Project {
  id?: number;
  name: string;
  description: string;
  createdAt: Date;
  currentVersion: number;
}

export interface Commit {
  id?: number;
  projectId: number;
  version: number; // Each commit has a version
  fileContent: string;
  screenshot: string;
  commitMessage: string;
  timestamp: Date;
}

class CodeEditorDB extends Dexie {
  projects: Dexie.Table<Project, number>;
  commits: Dexie.Table<Commit, number>;

  constructor() {
    super("CodeEditorDB");
    this.version(1).stores({
      projects: "++id, name, description, createdAt, currentVersion",
      commits:
        "++id, projectId, version, fileContent, screenshot, commitMessage, timestamp",
    });

    this.projects = this.table("projects");
    this.commits = this.table("commits");
  }
}

export const db = new CodeEditorDB();
