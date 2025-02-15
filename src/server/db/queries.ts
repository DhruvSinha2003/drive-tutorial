import "server-only";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  type DB_FileType,
  files_table as fileSchema,
  folders_table as folderSchema
} from "~/server/db/schema";

export const QUERIES = {
getAllParentsForFolder: async function (folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  const seenIds = new Set(); // Track IDs we've already processed

  while (currentId !== null) {
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
},

getFoldersByParent: function (folderId: number) {
    return db
        .select()
        .from(folderSchema)
        .where(eq(folderSchema.parent, folderId));
},

getFilesByParent: function (folderId: number) {
    return db
        .select()
        .from(fileSchema)
        .where(eq(fileSchema.parent, folderId));
}

}

export const MUTATIONS = {
    createFile: async function (input:{
      file: {name: string,size: number, url: string};userId:string}) {
        return await db.insert(fileSchema).values({...input.file, parent: 1});
    }
}