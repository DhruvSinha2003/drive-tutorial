import {
  getAllParentsForFolder,
  getFilesByParent,
  getFoldersByParent,
} from "~/server/db/queries";

import DriveContents from "../../drive-contents";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderid: string }>;
}) {
  const params = await props.params;

  const parsedFolderId = parseInt(params.folderid);
  if (isNaN(parsedFolderId)) {
    return <div>Invalid Folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    getFoldersByParent(parsedFolderId),
    getFilesByParent(parsedFolderId),
    getAllParentsForFolder(parsedFolderId),
  ]);

  return <DriveContents files={files} folders={folders} parents={parents} />;
}
