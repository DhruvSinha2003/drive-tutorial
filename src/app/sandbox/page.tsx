import { mockFiles, mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

// page.tsx
export default function SandboxPage() {
  return (
    <div>
      Seed Function
      <form
        action={async () => {
          "use server";

          // First insert the root folder
          const rootFolder = await db.insert(folders_table).values({
            id: 1,
            name: "root folder",
            parent: 1, // Root folder references itself
          });

          // Then insert other folders
          const otherFolders = await db.insert(folders_table).values(
            mockFolders.slice(1).map((folder, index) => ({
              id: index + 2, // Start from ID 2 since root is 1
              name: folder.name,
              parent: 1, // All other folders are children of root
            })),
          );

          // Then insert files
          const fileInsert = await db.insert(files_table).values(
            mockFiles.map((file, index) => ({
              id: file.id,
              name: file.name,
              url: file.url,
              parent: (index % 3) + 1, // Distribute files among folders 1, 2, and 3
              size: 500,
            })),
          );

          console.log(rootFolder, otherFolders, fileInsert);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
