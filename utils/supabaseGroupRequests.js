import { supabaseClient } from "./supabaseClient";

export const addGroup = async ({ userId, token, groupName, boardId }) => {
  const supabase = await supabaseClient(token);
  if (!groupName) return;
  const lastIndex = await getLastGroupIndexByBoard({ userId, token, boardId });
  const { data, error } = await supabase
    .from("groups")
    .insert([
      {
        user_id: userId,
        group_name: groupName,
        board_id: boardId,
        index_number: lastIndex + 1,
      },
    ])
    .select();
  if (error) {
    console.log("error when add new group");
    console.log(error.message);
    return;
  }
  return data[0];
};

export const updateGroupIndex = async ({
  userId,
  token,
  boardId,
  updatedGroups,
}) => {
  const supabase = await supabaseClient(token);
  try {
    const { data, error } = await supabase
      .from("groups")
      .upsert(updatedGroups, { onConflict: ["id"] })
      .eq("user_id", userId)
      .eq("board_id", boardId);
    if (error) {
      console.log("Error when update group index");
      console.log(error.message);
    }
    console.log("Group index updated");
  } catch (error) {
    console.log("Error when update group index");
    console.log(error.message);
  }
};

export const getLastGroupIndexByBoard = async ({ userId, token, boardId }) => {
  const supabase = await supabaseClient(token);
  const { data } = await supabase
    .from("groups")
    .select("index_number")
    .eq("user_id", userId)
    .eq("board_id", boardId)
    .order("index_number", { ascending: false });
  if (data.length > 0) {
    return data[0].index_number;
  } else return 0;
};

export const createDefaultGroup = async ({ userId, token, boardId }) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("groups").insert([
    {
      user_id: userId,
      group_name: "To do",
      board_id: boardId,
      index_number: 1,
    },
    {
      user_id: userId,
      group_name: "Doing",
      board_id: boardId,
      index_number: 2,
    },
    { user_id: userId, group_name: "Done", board_id: boardId, index_number: 3 },
  ]);

  if (error) {
    console.log("Error when creating default group !!");
    console.log(error.message);
    return;
  }
  return data;
};

export const getGroups = async ({ userId, token, boardId }) => {
  const supabase = await supabaseClient(token);

  let { data: groups, error } = await supabase
    .from("groups")
    .select("*")
    .eq("user_id", userId)
    .eq("board_id", boardId)
    .order("index_number");

  if (error) {
    console.log("error when getting groups");
    return;
  }

  return groups;
};

export const getGroupById = async ({ userId, token, boardId, groupId }) => {
  const supabase = await supabaseClient(token);

  let { data: groups, error } = await supabase
    .from("groups")
    .select("*")
    .eq("user_id", userId)
    .eq("board_id", boardId)
    .eq("id", groupId);

  if (error) {
    console.log("error");
    return;
  }

  return groups[0];
};
