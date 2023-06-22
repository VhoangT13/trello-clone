

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BiEdit, BiX } from "react-icons/bi";
import { editTodo } from "@/utils/supabaseTodoRequests";
import useBoardStore from "@/store/boardStore";
import { Draggable } from "react-beautiful-dnd";

const CardTodo = ({ id, index }) => {
  const [showEditButton, setShowEditButton] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [text, setText] = useState("");
  const [tempText, setTempText] = useState("");
  const { userId, getToken } = useAuth();

  const [getCardById, editCard] = useBoardStore((state) => [
    state.getCardById,
    state.editCard,
  ]);
  const card = getCardById(id);
  useEffect(() => {
    if (card) {
      setText(card.title);
      setTempText(card.title);
    }
  }, [card]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken({ template: "supabase" });
    const card = await editTodo({ token, title: text, id });
    if (card) editCard(card);
    setTempText(card.title);
    setShowEditForm(false);
  };

  const handleCancel = () => {
    setShowEditForm(false);
    setText(tempText);
  };

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <div
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="w-full min-h-[40px] bg-white rounded-lg shadow-md "
        >
          <div
            onMouseOver={() => {
              setShowEditButton(true);
            }}
            onMouseOut={() => setShowEditButton(false)}
            className={`${
              showEditForm ? "hidden" : ""
            } px-4 py-2 w-full flex  justify-between gap-1  hover:bg-gray-100 `}
          >
            <p className="flex-1 break-words">{tempText}</p>

            <BiEdit
              onClick={() => setShowEditForm(true)}
              className={`${
                showEditButton ? "" : "opacity-0"
              } flex-none text-lg text-gray-500 cursor-pointer`}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className={`${showEditForm ? "" : "hidden"} flex flex-col gap-1`}
          >
            <textarea
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleCancel();
                }
              }}
              autoFocus={true}
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder=""
              className=" border h-[100px] rounded-md p-2 mb-2"
            />
            <div className="flex items-center justify-between">
              <button
                disabled={!text}
                className="px-4 py-1 text-sm rounded-md bg-sky-400"
                type="submit"
              >
                Edit
              </button>
              <BiX
                className="text-3xl text-gray-500 cursor-pointer"
                onClick={handleCancel}
              />
            </div>
          </form>
        </div>
      )}
    </Draggable>
  );
};

export default CardTodo;
