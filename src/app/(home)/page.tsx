import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="w-full max-w-md space-y-8 text-center backdrop-blur-sm">
      <h1 className="mb-8 bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
        Dhruv&apos;s Personal Drive
      </h1>
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
        <p className="pb-8 text-lg font-medium text-red-400 transition-colors hover:text-red-300">
          Turn Back If You Are Not Me
        </p>
        <Button
          className="bg-slate-100 text-gray-900 transition-all duration-300 hover:bg-slate-200 hover:shadow-lg hover:shadow-slate-500/20 focus:ring-2 focus:ring-slate-300"
          type="submit"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
