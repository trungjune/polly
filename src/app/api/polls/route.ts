import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession()
  
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const json = await request.json()
  const { title, options, isAnonymous } = json

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return new NextResponse("User not found", { status: 404 })
  }

  const poll = await prisma.poll.create({
    data: {
      title,
      authorId: user.id,
      isAnonymous,
      options: {
        create: options.map((text: string) => ({ text })),
      },
    },
  })

  return NextResponse.json(poll)
}