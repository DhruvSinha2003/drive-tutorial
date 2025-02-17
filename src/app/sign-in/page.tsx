"use client";

import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-8 text-amber-50">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1 className="mb-8 animate-bounce text-4xl font-bold">
          Hello &nbsp; Me
        </h1>
        <SignInButton forceRedirectUrl={"/drive"} />
      </div>
    </main>
  );
}
