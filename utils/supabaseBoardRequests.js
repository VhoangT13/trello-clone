import { supabaseClient } from "./supabaseClient";

export const addBoard = async ({ userId, token, boardName }) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("boards")
    .insert([{ board_name: boardName, created_by: userId }])
    .select();
  if (error) {
    console.log("error");
    return;
  }
  return data[0];
};

export const getBoards = async ({ userId, token }) => {
  const supabase = await supabaseClient(token);

  let { data: boards, error } = await supabase
    .from("boards")
    .select("*")
    .eq("created_by", userId);
  if (error) {
    console.log("error");
    return;
  }
  return boards;
};

export const getBoardById = async ({ userId, token, boardId }) => {
  const supabase = await supabaseClient(token);
  let { data: board, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", boardId)
    .eq("created_by", userId);
  if (error) {
    console.log("error");
    return;
  }
  return board[0];
};
