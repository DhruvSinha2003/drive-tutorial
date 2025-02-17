import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <form
          action={async () => {
            "use server";
            const session = await auth();
            if (!session.userId) {
              return redirect("/sign-in");
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId);
            return redirect(`/f/${rootFolderId}`);
          }}
        >
          <Button className="bg-slate-100 text-gray-900 transition-all duration-300 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-500/20 focus:ring-2 focus:ring-slate-300">
            Create New Drive
          </Button>
        </form>
      </div>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}
