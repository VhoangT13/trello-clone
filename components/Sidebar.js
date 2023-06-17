"use client";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BiAddToQueue } from "react-icons/bi";
import Spinner from "./UI/Spinner";

import Board from "./Board";
import { addBoard, getBoards } from "@/utils/supabaseBoardRequests";
import { createDefaultGroup } from "@/utils/supabaseGroupRequests";

const Sidebar = () => {
  const [showInput, setShowInput] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const router = useRouter();

  const loadBoards = useCallback(async () => {
    const token = await getToken({ template: "supabase" });
    const boards = await getBoards({ userId, token });
    setBoards(boards);
    setIsLoading(false);
  }, [getToken, userId]);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName) {
      return;
    }
    const token = await getToken({ template: "supabase" });
    const board = await addBoard({ userId, token, boardName });
    console.log(board);
    const groups = await createDefaultGroup({
      userId,
      token,
      boardId: board.id,
    });
    await loadBoards();
    setBoardName("");
    setShowInput(false);
    router.push(`/board/${board.id}`);
  };

  return (
    <aside className="flex flex-col flex-none w-1/6 p-4 overflow-y-auto border-r-2">
      <div
        onClick={() => setShowInput(true)}
        className="flex items-center gap-2 p-4 mb-4 border border-yellow-200 rounded-md shadow-lg hover:cursor-pointer "
      >
        <BiAddToQueue />
        <button>Create new board</button>
      </div>
      <div className="flex flex-col flex-1 gap-4 py-4 border-t-2 ">
        {/* Board list */}
        <p className="text-lg font-semibold text-center">Your boards</p>
        <div className="relative">
          {isLoading && <Spinner />}
          <div className="flex flex-col gap-2">
            {boards?.map((board) => (
              <Board
                href={`/board/${board.id}`}
                key={board.id}
                name={board["board_name"]}
              />
            ))}
          </div>
        </div>
        {/* new board */}
        {showInput && (
          <form onSubmit={handleSubmit}>
            <input
              autoFocus={true}
              onBlur={() => setShowInput(false)}
              className="w-full p-2 border rounded-sm"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <button type="hidden"></button>
          </form>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
