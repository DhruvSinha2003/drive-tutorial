"use client";

import { SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="w-full max-w-md space-y-8 text-center backdrop-blur-sm">
      <h1 className="mb-8 animate-pulse bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
        Hello &nbsp; Me
      </h1>
      <div className="transform transition-transform hover:scale-105">
        <SignInButton forceRedirectUrl={"/drive"} />
      </div>
    </div>
  );
}
