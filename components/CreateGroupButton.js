import useBoardStore from "@/store/boardStore";
import { addGroup } from "@/utils/supabaseGroupRequests";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";

const CreateGroupButton = ({ boardId }) => {
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const { userId, getToken } = useAuth();

  const createGroup = useBoardStore((state) => state.createGroup);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken({ template: "supabase" });
    const group = await addGroup({ userId, token, groupName: text, boardId });

    createGroup(group);
    setText("");
    setShowForm(false);
  };

  return (
    <>
      <div className="flex-none w-64 overflow-hidden shadow-md h-fit bg-gray-50 rounded-xl">
        <button
          onClick={() => setShowForm(true)}
          className={`${
            showForm ? "hidden" : ""
          } flex items-center w-full gap-2 px-4 py-2 hover:bg-gray-100`}
        >
          <BiPlus className="text-lg" />
          <span>Add another list</span>{" "}
        </button>
        <form
          onSubmit={handleSubmit}
          className={`${showForm ? "" : "hidden"} p-2 flex flex-col gap-2`}
        >
          <input
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowForm(false);
              }
            }}
            autoFocus={true}
            onChange={(e) => setText(e.target.value)}
            value={text}
            type="text"
            placeholder="Enter list title..."
            className="p-2 border"
          />
          <button
            className="self-start px-2 py-1 text-sm rounded-md bg-sky-400"
            type="submit"
          >
            Add list
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateGroupButton;
