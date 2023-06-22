import React, { useState, useRef, useEffect } from "react";

import { BiPlus, BiX } from "react-icons/bi";
import { addTodo } from "@/utils/supabaseTodoRequests";
import { useAuth } from "@clerk/nextjs";
import useBoardStore from "@/store/boardStore";

const CreateCardButton = ({ groupId }) => {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const { userId, getToken } = useAuth();
  const createCard = useBoardStore((state) => state.createCard);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    const token = await getToken({ template: "supabase" });
    const card = await addTodo({ token, userId, title: text, groupId });
    if (card) createCard(card);

    setText("");
    setShowForm(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowForm(true)}
        className={`${
          showForm ? "hidden" : ""
        } flex items-center w-full gap-2 p-2 rounded-lg hover:bg-gray-200`}
      >
        <BiPlus className="text-lg" />
        <span>Add a card</span>
      </button>
      <form
        onSubmit={handleSubmit}
        className={`${showForm ? "" : "hidden"} p-2 flex flex-col gap-1`}
      >
        <textarea
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowForm(false);
            }
          }}
          autoFocus={true}
          onChange={(e) => setText(e.target.value)}
          value={text}
          placeholder="Enter a title for this card..."
          className="p-2 border h-[100px] rounded-md text-sm mb-2"
        />
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-1 text-sm rounded-md bg-sky-400"
            type="submit"
          >
            Add
          </button>
          <BiX
            className="text-3xl text-gray-500 cursor-pointer"
            onClick={() => setShowForm(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCardButton;
