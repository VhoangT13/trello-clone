"use client";

import useBoardStore from "@/store/boardStore";
import CardTodo from "./CardTodo";
import { Draggable, Droppable } from "react-beautiful-dnd";

const ListCard = ({ groupId, index }) => {
  const data = useBoardStore((state) => state.filteredCards);
  const filteredData = data
    .filter((x) => x.group_id === groupId)
    .sort((a, b) => a.index_number - b.index_number);

  return (
    <Droppable
      droppableId={groupId.toString()}
      type="CARD"
      direction="vertical"
    >
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className="flex flex-col gap-3 mb-4"
        >
          {filteredData.map((item, index) => (
            <CardTodo key={item.id} index={index} id={item.id} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ListCard;
