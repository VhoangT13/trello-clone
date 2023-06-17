"use client";
import useBoardStore from "@/store/boardStore";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

const NavSearch = () => {
  const [searchQuery, filterCards, setSearchQuery] = useBoardStore((state) => [
    state.searchQuery,
    state.filterCards,
    state.setSearchQuery,
  ]);
  const handleSubmit = (e) => {
    e.preventDefault();
    filterCards(searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-2 bg-white rounded-md shadow-md"
    >
      <BiSearch className="text-xl" />
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="outline-none"
        type="text"
        placeholder="Search..."
      />
      <button type="hidden"></button>
    </form>
  );
};

export default NavSearch;
