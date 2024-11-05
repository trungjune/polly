import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  )
}