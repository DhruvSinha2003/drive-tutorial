"use client";

import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="w-full max-w-md space-y-8 text-center">
      <h1 className="mb-8 animate-bounce text-4xl font-bold">
        Hello &nbsp; Me
      </h1>
      <SignInButton forceRedirectUrl={"/drive"} />
    </div>
  );
}
