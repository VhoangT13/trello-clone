"use client";

import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Group from "./Group";
import CreateGroupButton from "./CreateGroupButton";

const DndBoard = ({ boardId, groups }) => {
  // return (
  //   <DragDropContext onDragEnd={() => console.log("AAAA")}>
  //     <Droppable droppableId="board" type="COLUMN" direction="horizontal">
  //       {(provided) => (
  //       )}
  //     </Droppable>
  //   </DragDropContext>
  // );
};

export default DndBoard;
