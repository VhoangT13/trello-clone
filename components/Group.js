import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

import ListCard from "./ListCard";
import CreateCardButton from "./CreateCardButton";

import useBoardStore from "@/store/boardStore";

const Group = ({ id, boardId, index }) => {
  const { userId, getToken } = useAuth();
  const [data, setData] = useState(null);

  const [groups] = useBoardStore((state) => [state.groups]);

  useEffect(() => {
    const setupData = () => {
      const group = groups.find((x) => x.id === id);
      setData(group);
    };

    setupData();
  }, [boardId, userId, getToken, id, groups]);
  return (
    <div className="flex-none p-4 pr-2 shadow-md w-72 bg-gray-50 rounded-xl">
      <div className="max-h-[42rem] overflow-hidden overflow-y-auto pr-2">
        <div className="mb-4 text-lg font-semibold hover:bg-gray-100">
          {data?.group_name}
        </div>

        <ListCard groupId={id} index={index} />

        <CreateCardButton groupId={id} />
      </div>
    </div>
  );
};

export default Group;
