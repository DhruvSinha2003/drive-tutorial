import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { mockFiles, mockFolders } from "~/lib/mock-data";
import { db } from "~/server/db";
import { files_table, folders_table } from "~/server/db/schema";

// page.tsx
export default async function SandboxPage() {
  const user = await auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }
  const folders = await db
    .select()
    .from(folders_table)
    .where(eq(folders_table.ownerId, user.userId));

  console.log(folders);
  return (
    <div>
      Seed Function
      <form
        action={async () => {
          "use server";
          const user = await auth();
          if (!user.userId) {
            throw new Error("Unauthorized");
          }
          const rootFolder = await db
            .insert(folders_table)
            .values({
              name: "root",
              ownerId: user.userId,
              parent: 1,
            })
            .$returningId();

          const insertFolders = mockFolders.map((folder) => ({
            name: folder.name,
            parent: rootFolder[0]!.id,
            ownerId: user.userId,
          }));

          await db.insert(folders_table).values(insertFolders);

          // const insertFiles = mockFiles.map((file) => ({
          //   name: file.name,
          //   parent: file.parent,
          //   ownerId: user.userId,
          //   url: file.url,
          //   size: file.size,
          // }));

          // await db.insert(folders_table).values(insertFolders);
        }}
      >
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
