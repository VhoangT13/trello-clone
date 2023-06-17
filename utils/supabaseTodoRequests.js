import { supabaseClient } from "./supabaseClient";

export const getTodos = async ({ userId, token, groupId }) => {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("todos").select().match({
    user_id: userId,
    group_id: groupId,
  });
  if (error) {
    console.log("error when getting todos");
    console.log(error.message);
    return;
  }
  return data;
};

export const addTodo = async ({ userId, token, title, groupId }) => {
  const supabase = await supabaseClient(token);
  if (!title) return;
  const lastTodoIndex = await getLastTodoIndexByGroup({
    userId,
    token,
    groupId,
  });
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        user_id: userId,
        title,
        group_id: groupId,
        index_number: lastTodoIndex + 1,
      },
    ])
    .select();

  if (error) {
    console.log("error when create new card");
    console.error(error.message);
  }
  return data[0];
};

export const getLastTodoIndexByGroup = async ({ userId, token, groupId }) => {
  const supabase = await supabaseClient(token);
  const { data } = await supabase
    .from("todos")
    .select("index_number")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .order("index_number", { ascending: false });

  if (data.length > 0) {
    return data[0].index_number;
  } else return 0;
};

export const editTodo = async ({ token, title, id }) => {
  const supabase = await supabaseClient(token);
  if (!title) return;

  const { data, error } = await supabase
    .from("todos")
    .update({ title })
    .eq("id", id)
    .select();

  if (error) {
    console.log("error when updating card");
    console.log(error.message);
  }
  return data[0];
};

export const getBoardTodos = async ({ userId, token, boardId }) => {
  const supabase = await supabaseClient(token);
  let boardTodos = [];

  let { data: groupIds, error } = await supabase
    .from("groups")
    .select("id")
    .eq("user_id", userId)
    .eq("board_id", boardId);

  for (let i = 0; i < groupIds.length; i++) {
    const id = groupIds[i].id;
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("group_id", id);
    if (data.length > 0) {
      boardTodos = [...boardTodos, ...data];
    }
  }
  return boardTodos;
};

export const updateCardIndex = async ({ userId, token, cards }) => {
  console.log(cards);
  const supabase = await supabaseClient(token);
  try {
    const { data, error } = await supabase
      .from("todos")
      .upsert(cards, { onConflict: ["id"] })
      .eq("user_id", userId);
    if (error) {
      console.log("Error when update card index");
      console.log(error.message);
      return;
    }
    console.log("Card index updated");
  } catch (error) {
    console.log("Error when update card index");
    console.log(error.message);
    return;
  }
};
