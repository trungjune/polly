"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function PollForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const filteredOptions = options.filter(opt => opt.trim() !== "")
    if (filteredOptions.length < 2) {
      alert("Please add at least 2 options")
      return
    }

    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        options: filteredOptions,
        isAnonymous,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      router.push(`/polls/${data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Question</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What would you like to ask?"
          required
        />
      </div>

      <div className="space-y-4">
        <Label>Options</Label>
        {options.map((option, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...options]
                newOptions[index] = e.target.value
                setOptions(newOptions)
              }}
              placeholder={`Option ${index + 1}`}
            />
            {options.length > 2 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setOptions(options.filter((_, i) => i !== index))
                }}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setOptions([...options, ""])}
        >
          Add Option
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
        />
        <Label htmlFor="anonymous">Make votes anonymous</Label>
      </div>

      <Button type="submit">Create Poll</Button>
    </form>
  )
}