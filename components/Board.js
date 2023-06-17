import Link from "next/link";
import React from "react";
import { BiTable } from "react-icons/bi";

const Board = ({ href, name }) => {
  return (
    <Link
      className="flex items-center gap-2 p-2 rounded-md shadow-md"
      href={href}
    >
      <BiTable className="text-lg" />
      {name}
    </Link>
  );
};

export default Board;
