import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
    files_table as fileSchema,
    folders_table as folderSchema,
} from "~/server/db/schema";

export async function getAllParentsForFolder(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  const seenIds = new Set(); // Track IDs we've already processed

  while (currentId !== null) {
    // Prevent infinite loops
    if (seenIds.has(currentId)) {
      break;
    }
    seenIds.add(currentId);

    const folder = await db
      .select()
      .from(folderSchema)
      .where(eq(folderSchema.id, currentId))
      .limit(1);

    if (!folder[0]) {
      throw new Error("Parent folder not found");
    }
    parents.unshift(folder[0]);

    currentId = folder[0].parent === currentId ? null : folder[0].parent;
  }
  return parents;
}

export function getFoldersByParent(folderId: number) {
    return db
        .select()
        .from(folderSchema)
        .where(eq(folderSchema.parent, folderId));
}

export function getFilesByParent(folderId: number) {
    return db
        .select()
        .from(fileSchema)
        .where(eq(fileSchema.parent, folderId));
}

 