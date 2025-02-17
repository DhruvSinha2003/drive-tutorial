"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ChevronRight, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createFolder } from "~/server/actions";
import type { files_table, folders_table } from "~/server/db/schema";
import { UploadButton } from "../../../components/uploadthing";
import { FileRow, FolderRow } from "./file-row";

export default function DriveContents(props: {
  files: (typeof files_table.$inferSelect)[];
  folders: (typeof folders_table.$inferSelect)[];
  parents: (typeof folders_table.$inferSelect)[];
  currentFolderId: number;
}) {
  const navigate = useRouter();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const result = await createFolder(newFolderName, props.currentFolderId);
    if (result.error) {
      // You might want to show an error message here
      return;
    }

    setNewFolderName("");
    setIsCreatingFolder(false);
    navigate.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-900 to-slate-900 p-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            {props.parents.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="mx-2 text-slate-400" size={16} />
                )}
                <Link
                  href={`/f/${folder.id}`}
                  className="text-slate-300 transition-colors hover:text-slate-100"
                >
                  {folder.name}
                </Link>
              </div>
            ))}
          </div>

          <div>
            <header className="flex h-16 items-center justify-end gap-4 p-4">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
          </div>
          {isCreatingFolder ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="h-10 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    await handleCreateFolder();
                  }
                }}
              />
              <button
                onClick={handleCreateFolder}
                className="h-10 rounded-md bg-slate-700 px-4 py-2 text-slate-100 transition-colors hover:bg-slate-600"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreatingFolder(false)}
                className="h-10 rounded-md px-4 py-2 text-slate-400 transition-colors hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex h-10 items-center gap-2 rounded-md bg-slate-700 px-4 py-2 text-slate-100 transition-colors hover:bg-slate-600"
            >
              <FolderPlus size={16} />
              New Folder
            </button>
          )}
        </div>

        <div className="rounded-lg bg-slate-800/50 shadow-xl backdrop-blur-sm">
          <div className="border-b border-slate-700/50 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-1"></div>
            </div>
          </div>
          <ul>
            {props.folders.map((folder) => (
              <FolderRow key={folder.id} folder={folder} />
            ))}
            {props.files.map((file) => (
              <FileRow key={file.id} file={file} />
            ))}
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-4"></div>
          <UploadButton
            endpoint="driveUploader"
            onClientUploadComplete={() => {
              navigate.refresh();
            }}
            input={{ folderId: props.currentFolderId }}
          />
        </div>
      </div>
    </div>
  );
}
