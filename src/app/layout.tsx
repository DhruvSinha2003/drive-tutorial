import { ClerkProvider } from "@clerk/nextjs";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { CSPostHogProvider } from "./_providers/posthog-provider";

export const metadata: Metadata = {
  title: "Drive",
  description:
    "Google drive but the cool part is that it does not work as well",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body>{children}</body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
