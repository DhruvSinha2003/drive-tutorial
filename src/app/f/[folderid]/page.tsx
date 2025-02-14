import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import {
  files as fileSchema,
  folders as folderSchema,
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

    // Only update currentId if the parent is different from the current ID
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

  // Add some debug logging
  const [folders, files, parents] = await Promise.all([
    foldersPromise.then((f) => {
      console.log("Folders:", f);
      return f;
    }),
    filesPromise.then((f) => {
      console.log("Files:", f);
      return f;
    }),
    parentsPromise.then((p) => {
      console.log("Parents:", p);
      return p;
    }),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
