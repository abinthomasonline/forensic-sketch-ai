interface ProgressIndicatorProps {
  stage: string | null
}

export default function ProgressIndicator({ stage }: ProgressIndicatorProps) {
  if (!stage) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <span className="text-blue-900 font-medium">{stage}</span>
      </div>
    </div>
  )
}
