/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import CreateGroupButton from "@/components/CreateGroupButton";
import Group from "@/components/Group";
import useBoardStore from "@/store/boardStore";

import { getBoardById } from "@/utils/supabaseBoardRequests";
import { getGroups, updateGroupIndex } from "@/utils/supabaseGroupRequests";
import { getBoardTodos, updateCardIndex } from "@/utils/supabaseTodoRequests";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const page = ({ params }) => {
  const boardId = params.id;
  const [board, setBoard] = useState("");
  const { userId, getToken } = useAuth();

  const [setStartupGroups, groups, setCards, cards, filterCards] =
    useBoardStore((state) => [
      state.setStartupGroups,
      state.groups,
      state.setCards,
      state.cards,
      state.filterCards,
    ]);

  useEffect(() => {
    const getBoardData = async () => {
      const token = await getToken({ template: "supabase" });
      const board = await getBoardById({ userId, token, boardId });
      if (board) setBoard(board);
      const groups = await getGroups({ userId, token, boardId });
      if (groups) setStartupGroups(groups);
      const boardTodos = await getBoardTodos({ userId, token, boardId });
      if (boardTodos) setCards(boardTodos);

      filterCards();
    };
    getBoardData();
  }, [
    boardId,
    getToken,
    userId,
    setStartupGroups,
    setCards,
    filterCards,
    cards,
  ]);

  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const token = await getToken({ template: "supabase" });

    // Group drag and drop
    if (type === "COLUMN") {
      const updatedGroups = Array.from(groups);
      // Reorder the groups array based on the drag and drop event
      const [movedGroup] = updatedGroups.splice(source.index, 1);
      updatedGroups.splice(destination.index, 0, movedGroup);

      // Update the index numbers of the groups
      const reorderedGroups = updatedGroups.map((group, index) => ({
        ...group,
        index_number: index + 1,
      }));
      setStartupGroups(reorderedGroups);
      // Save position in database
      updateGroupIndex({
        userId,
        token,
        boardId,
        updatedGroups: reorderedGroups,
      });
    }
    // Card drag and drop
    if (type === "CARD") {
      const { index: sourceIndex, droppableId: sourceGroupId } = source;
      const { index: destinationIndex, droppableId: destinationGroupId } =
        destination;

      // Check if card move in the same group
      if (sourceGroupId === destinationGroupId) {
        const updatedCards = Array.from(cards);

        const groupCards = updatedCards
          .filter((card) => card.group_id === +sourceGroupId)
          .sort((a, b) => a.index_number - b.index_number);

        const [draggedCard] = groupCards.splice(sourceIndex, 1);
        groupCards.splice(destinationIndex, 0, draggedCard);
        // Update the index_number of cards within the group
        const reorderedGroupCard = groupCards.map((card, index) => ({
          ...card,
          index_number: index + 1,
        }));
        const result = updatedCards.map((card) => {
          const newCard = reorderedGroupCard.find((x) => x.id === card.id);
          if (newCard) {
            return newCard;
          } else return card;
        });
        // Update the cards state
        setCards(result);
        // Update index_number in database
        updateCardIndex({ userId, token, cards: result });
      } else {
        const reorderedCards = Array.from(cards);
        const sourceCards = reorderedCards
          .filter((card) => card.group_id === +sourceGroupId)
          .sort((a, b) => a.index_number - b.index_number);
        const destinationCards = reorderedCards
          .filter((card) => card.group_id === +destinationGroupId)
          .sort((a, b) => a.index_number - b.index_number);
        const [movedCard] = sourceCards.splice(sourceIndex, 1);

        const remainCards = reorderedCards.filter(
          (card) =>
            !(
              card.group_id === +sourceGroupId ||
              card.group_id === +destinationGroupId
            )
        );
        movedCard.group_id = +destinationGroupId;
        destinationCards.splice(destinationIndex, 0, movedCard);

        // Update index_number in the card table
        sourceCards.forEach((card, index) => {
          card.index_number = index + 1;
        });
        destinationCards.forEach((card, index) => {
          card.index_number = index + 1;
        });
        const updatedCards = [
          ...sourceCards,
          ...destinationCards,
          ...remainCards,
        ];
        // Update the cards state
        setCards(updatedCards);
        // Update index_number in database
        updateCardIndex({ userId, token, cards: updatedCards });
      }
    }
  };

  return (
    <>
      <div className="flex-1 p-4 bg-gradient-to-r from-purple-300 to-pink-300">
        <div className="w-full px-8 py-4 mb-8 bg-white rounded-lg shadow-md max-w-screen-2xl ">
          <p className="text-2xl font-semibold text-gray-600">
            {" "}
            {board["board_name"]}
          </p>
        </div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex items-start h-[46rem] gap-4 overflow-x-auto overflow-y-hidden max-w-screen-2xl "
              >
                {groups.map((group, index) => (
                  <Draggable
                    key={group.id}
                    draggableId={group.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <Group index={index} boardId={boardId} id={group.id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <CreateGroupButton boardId={boardId} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>
  );
};

export default page;
