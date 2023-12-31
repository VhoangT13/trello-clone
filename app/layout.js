import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Trello Clone",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} h-screen min-h-screen overflow-hidden w-screen`}
        >
          <SignedOut>
            <div className="flex items-center justify-center w-full h-full">
              <Link
                className="text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2  "
                href="/sign-in"
              >
                Sign-in to continue
              </Link>
            </div>
          </SignedOut>

          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
