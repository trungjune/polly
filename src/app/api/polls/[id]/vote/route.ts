import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const json = await request.json()
  const { optionId } = json

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return new NextResponse("User not found", { status: 404 })
  }

  // Check if user has already voted
  const existingVote = await prisma.vote.findFirst({
    where: {
      userId: user.id,
      poll: {
        id: params.id,
      },
    },
  })

  if (existingVote) {
    return new NextResponse("Already voted", { status: 400 })
  }

  const vote = await prisma.vote.create({
    data: {
      userId: user.id,
      pollId: params.id,
      optionId,
    },
  })

  return NextResponse.json(vote)
}