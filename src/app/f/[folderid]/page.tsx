import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files_table as fileSchema,
  folders_table as folderSchema,
} from "~/server/db/schema";
import DriveContents from "../../drive-contents";

async function getAllParents(folderId: number) {
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

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderid: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderid);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid Folder ID</div>;
  }
  const foldersPromise = db
    .select()
    .from(folderSchema)
    .where(eq(folderSchema.parent, parsedFolderId));

  const filesPromise = db
    .select()
    .from(fileSchema)
    .where(eq(fileSchema.parent, parsedFolderId));

  const parentsPromise = getAllParents(parsedFolderId);

  const [folders, files, parents] = await Promise.all([
    foldersPromise,
    filesPromise,
    parentsPromise,
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
