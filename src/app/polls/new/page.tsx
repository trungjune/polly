import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { PollForm } from "./poll-form"

export default async function NewPoll() {
  const session = await getServerSession()
  
  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Poll</h1>
      <PollForm />
    </div>
  )
}