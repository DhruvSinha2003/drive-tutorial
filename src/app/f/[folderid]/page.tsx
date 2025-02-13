import { eq } from "drizzle-orm";
import { parse } from "path";
import { z } from "zod";
import { db } from "~/server/db";
import {
  files,
  files as fileSchema,
  folders as folderSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderid: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderid);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid Folder ID</div>;
  }
  const folders = await db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, parsedFolderId));
  const files = await db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parent, parsedFolderId));

  return <DriveContents files={files} folders={folders} />;
}
