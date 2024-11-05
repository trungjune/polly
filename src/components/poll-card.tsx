import Link from "next/link"
import { Poll } from "@/types"

interface PollCardProps {
  poll: Poll
}

export function PollCard({ poll }: PollCardProps) {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  )

  return (
    <Link 
      href={`/polls/${poll.id}`}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
      <p className="text-sm text-gray-500">
        by {poll.author.name} · {poll.options.length} options · 
        {totalVotes} votes
      </p>
    </Link>
  )
}