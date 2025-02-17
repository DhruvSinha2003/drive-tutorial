"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "./db";
import { files_table, folders_table } from "./db/schema";

const utApi = new UTApi();

export async function deleteFile(fileId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }
  const [file] = await db
    .select()
    .from(files_table)
    .where(
      and(eq(files_table.id, fileId), eq(files_table.ownerId, session.userId))
    );

  if (!file) {
    return { error: "Not found" };
  }

  await utApi.deleteFiles([file.url.replace("https://utfs.io/f/", "")]);
  await db.delete(files_table).where(eq(files_table.id, fileId));

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true };
}

export async function createFolder(name: string, parentId: number) {
  const session = await auth();
  if (!session.userId) {
    return { error: "Unauthorized" };
  }

  const result = await db
    .insert(folders_table)
    .values({
      name,
      parent: parentId,
      ownerId: session.userId,
    })
    .$returningId();

  const c = await cookies();
  c.set("force-refresh", JSON.stringify(Math.random()));

  if (result.length > 0 && result[0]) {
    return { success: true, folderId: result[0].id };
  } else {
    return { error: "Failed to create folder" };
  }
}
