import { User } from "@prisma/client"

export interface Poll {
  id: string
  title: string
  createdAt: Date
  endsAt?: Date | null
  authorId: string
  isAnonymous: boolean
  author: User
  options: Option[]
}

export interface Option {
  id: string
  text: string
  pollId: string
  votes: Vote[]
}

export interface Vote {
  id: string
  createdAt: Date
  pollId: string
  optionId: string
  userId: string
  user: User
}