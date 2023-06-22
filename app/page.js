import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function Home() {
  const { sessionId } = auth();
  if (sessionId) redirect("/board");
  return <main className=""></main>;
}
