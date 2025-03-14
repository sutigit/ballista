import type { Metadata } from "next";
import NavBar from "./components/nav-bar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { verifySession } from "@/lib/session/verifySession";

export const metadata: Metadata = {
  title: "Ballista",
  description: "AI debate room by TreeBuches",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();

  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar
          loggedIn={session.isAuth}
          username={session.username}
          userId={session.userId}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
