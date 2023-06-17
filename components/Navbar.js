import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import NavSearch from "./NavSearch";
const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-sky-200">
      <Link className="text-xl font-bold" href="/">
        Trello Clone
      </Link>
      <div className="flex items-center gap-6">
        {/* Search box */}
        <NavSearch />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">Sign-in</Link>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Navbar;
