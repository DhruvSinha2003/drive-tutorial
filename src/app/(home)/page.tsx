import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <h1 className="mb-8 text-4xl font-bold">Dhruv&apos;s Personal Drive</h1>
      <form
        action={async () => {
          "use server";
          const session = await auth();
          if (!session.userId) {
            return redirect("/sign-in");
          }
          return redirect("/drive");
        }}
      >
        <p className="pb-8 text-lg font-semibold text-red-500">
          Turn Back If You Are Not Me
        </p>
        <Button
          className="bg-amber-50 text-black transition-colors hover:bg-amber-100"
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
