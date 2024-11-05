import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { VotingForm } from "./voting-form"
import { Poll } from "@/types"

export default async function PollPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const poll = await prisma.poll.findUnique({
    where: { id },
    include: {
      author: true,
      options: {
        include: {
          votes: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  }) as Poll | null

  if (!poll) {
    notFound()
  }

  const session = await getServerSession()
  const hasVoted = session?.user?.email && poll.options.some(
    option => option.votes.some(vote => vote.user.email === session.user?.email)
  )

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{poll.title}</h1>
      <p className="text-gray-500 mb-6">
        Created by {poll.author.name} · {totalVotes} votes
      </p>

      <VotingForm
        poll={poll}
        hasVoted={hasVoted}
        session={session}
      />
    </div>
  )
}