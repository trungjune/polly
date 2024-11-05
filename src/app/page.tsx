import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { PollCard } from "@/components/poll-card"
import { Poll } from "@/types"

export default async function Home() {
  const session = await getServerSession()
  const polls = await prisma.poll.findMany({
    include: {
      author: true,
      options: {
        include: {
          votes: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  }) as Poll[]

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Polling App</h1>
        {session ? (
          <Link href="/polls/new">
            <Button>Create New Poll</Button>
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <Button>Sign in to create polls</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4">
        {polls.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
      </div>
    </main>
  )
}