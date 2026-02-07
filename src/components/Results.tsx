import { useState } from 'react'

interface ResultsProps {
  originalImage: string
  reconstructedImage: string
  description: string
}

export default function Results({ originalImage, reconstructedImage, description }: ResultsProps) {
  const [showDescription, setShowDescription] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Image Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Original</h3>
            <img src={originalImage} alt="Original" className="w-full rounded-md border border-gray-300" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Reconstructed</h3>
            <img src={reconstructedImage} alt="Reconstructed" className="w-full rounded-md border border-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-gray-900">Forensic Description</h2>
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showDescription ? 'Hide' : 'Show'}
          </button>
        </div>
        {showDescription && (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
              {description}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
