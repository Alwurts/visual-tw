import { db } from "./indexdb";
import { nanoid } from "nanoid";
import DEFAULT_EDITOR_CODE from "../editor/defaultEditorCode.html?raw";
import { htmlStringToPng } from "../viewer";
import * as domTools from "@/lib/dom";

export async function createNewProject(name: string, description?: string) {
  const newProjectId = nanoid(7);

  const { serializedDom } = domTools.parseHTMLString(DEFAULT_EDITOR_CODE);

  const screenshotDataUrl = await htmlStringToPng(serializedDom);

  const firstCommitId = await db.commits.add({
    id: nanoid(7),
    projectId: newProjectId,
    title: "Initial commit",
    description,
    fileContent: DEFAULT_EDITOR_CODE,
    screenshot: screenshotDataUrl ?? "",
    timestamp: new Date(),
  });

  const newDate = new Date();

  const id = await db.projects.add({
    id: newProjectId,
    name,
    description,
    createdAt: newDate,
    updatedAt: newDate,
    currentVersion: firstCommitId,
  });

  return id;
}

export async function getProjects() {
  return db.projects.toArray();
}

export async function getProject(projectId: string) {
  return db.projects.get(projectId);
}

export async function deleteProject(projectId: string) {
  await db.projects.delete(projectId);
  await db.commits.where({ projectId }).delete();
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

  if (!screenshotDataUrl) {
    return;
  }

  try {
    // TODO add transaction for versioning and updating currentVersion
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
      currentVersion: newCommitId,
      updatedAt: new Date(),
    });

    const loadedCommits = await getCommits(projectId);
    return loadedCommits;
  } catch (error) {
    console.error("Failed to save screenshot:", error);
  }
}
