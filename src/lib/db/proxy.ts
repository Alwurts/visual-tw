import { db } from "./indexdb";
import { nanoid } from "nanoid";
import DEFAULT_EDITOR_CODE from "../editor/defaultEditorCode.html?raw";
import { htmlStringToPng } from "../viewer";
import * as domTools from "@/lib/dom";

export async function createNewProject(name: string, description?: string) {
  const newProjectId = nanoid(7);

  const { serializedDom } = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);
  const screenshotDataUrl = await htmlStringToPng(serializedDom);

  return db.transaction("rw", db.projects, db.commits, async () => {
    const firstCommitId = await db.commits.add({
      id: nanoid(7),
      projectId: newProjectId,
      title: "Initial commit",
      description,
      fileContent: DEFAULT_EDITOR_CODE,
      screenshot: screenshotDataUrl,
      timestamp: new Date(),
    });

    const newDate = new Date();

    const projectId = await db.projects.add({
      id: newProjectId,
      name,
      description,
      createdAt: newDate,
      updatedAt: newDate,
      autoSavedCode: DEFAULT_EDITOR_CODE,
      screenshot: screenshotDataUrl,
      currentCommit: firstCommitId,
    });

    return projectId;
  });
}

export async function updateProjectAutoSavedCode(
  projectId: string,
  code: string,
) {
  await db.projects.update(projectId, { autoSavedCode: code });
}

export async function getProjects() {
  return db.projects.toArray();
}

export async function getProject(projectId: string) {
  return db.projects.get(projectId);
}

export async function deleteProject(projectId: string) {
  db.transaction("rw", db.projects, db.commits, async () => {
    await db.projects.delete(projectId);
    await db.commits.where({ projectId }).delete();
  });
}

export async function renameProject(projectId: string, newName: string) {
  await db.projects.update(projectId, { name: newName });
}

export async function getCommits(projectId: string) {
  return db.commits.where({ projectId }).toArray();
}

export async function getCommit(commitId: string) {
  return db.commits.get(commitId);
}

export async function createNewCommit(
  code: string,
  title: string,
  description: string,
  projectId: string,
  serializedDom: string,
) {
  const screenshotDataUrl = await htmlStringToPng(serializedDom);

  return db.transaction("rw", db.commits, db.projects, async () => {
    const newCommitId = await db.commits.add({
      id: nanoid(7),
      projectId,
      title,
      description,
      fileContent: code,
      screenshot: screenshotDataUrl,
      timestamp: new Date(),
    });

    await db.projects.update(projectId, {
      currentCommit: newCommitId,
      screenshot: screenshotDataUrl,
      updatedAt: new Date(),
    });

    const loadedCommits = await getCommits(projectId);
    return loadedCommits;
  });
}
