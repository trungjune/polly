"use client"

import { Session } from "next-auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Poll } from "@/types"

interface VotingFormProps {
  poll: Poll
  hasVoted: boolean
  session: Session | null
}

export function VotingForm({ poll, hasVoted, session }: VotingFormProps) {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0
  )

  const handleVote = async () => {
    if (!selectedOption) return
    
    setIsSubmitting(true)
    setError(undefined)

    try {
      const response = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId: selectedOption }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to submit vote")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit vote")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center">
        <p className="mb-4">Sign in to vote in this poll</p>
        <Button asChild>
          <a href="/api/auth/signin">Sign in</a>
        </Button>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="space-y-4">
        {poll.options.map((option) => {
          const voteCount = option.votes.length
          const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0

          return (
            <div key={option.id} className="relative">
              <div
                className="h-12 bg-blue-100 rounded"
                style={{ width: `${percentage}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <span>{option.text}</span>
                <span>{percentage}% ({voteCount} votes)</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (isSubmitting) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      
      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
      >
        {poll.options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id}>{option.text}</Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        onClick={handleVote}
        disabled={!selectedOption || isSubmitting}
      >
        Submit Vote
      </Button>
    </div>
  )
}