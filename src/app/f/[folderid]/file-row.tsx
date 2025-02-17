import { FileIcon, Folder as FolderIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { deleteFile } from "~/server/actions";
import type { files_table, folders_table } from "~/server/db/schema";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  const { file } = props;
  return (
    <li
      key={file.id}
      className="border-b border-slate-700/50 px-6 py-4 transition-colors hover:bg-slate-700/30"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={file.url}
            className="flex items-center text-slate-100 transition-colors hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3 text-slate-400" size={20} />
            {file.name}
          </a>
        </div>
        <div className="col-span-2 text-slate-400">{"file"}</div>
        <div className="col-span-3 text-slate-400">{file.size}</div>
        <div className="col-span-1 text-slate-400">
          <Button
            variant="ghost"
            aria-label="Delete File"
            onClick={() => deleteFile(file.id)}
            className="transition-colors hover:text-red-400"
          >
            <Trash2Icon className="mr-1" size={16} />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  const { folder } = props;
  return (
    <li
      key={folder.id}
      className="border-b border-slate-700/50 px-6 py-4 transition-colors hover:bg-slate-700/30"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${folder.id}`}
            className="flex items-center text-slate-100 transition-colors hover:text-blue-400"
          >
            <FolderIcon className="mr-3 text-slate-400" size={20} />
            {folder.name}
          </Link>
        </div>
        <div className="col-span-3 text-slate-400"></div>
        <div className="col-span-3 text-slate-400"></div>
      </div>
    </li>
  );
}
