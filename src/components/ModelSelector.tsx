import { useState } from 'react'

interface Model {
  id: string
  displayName: string
  notes?: string
}

interface ModelSelectorProps {
  visionModel: string
  imageModel: string
  onVisionModelChange: (modelId: string) => void
  onImageModelChange: (modelId: string) => void
}

const visionModels: Model[] = [
  { id: 'meta-llama/llama-4-maverick', displayName: 'Llama 4 Maverick 17B', notes: '1M token context, best multimodal reasoning' },
  { id: 'qwen/qwen-3-vl-32b-instruct', displayName: 'Qwen3-VL 32B', notes: 'High-precision vision-language understanding' },
  { id: 'openai/gpt-4o', displayName: 'GPT-4o', notes: 'Fast, strong multimodal capabilities' },
  { id: 'qwen/qwen-3-vl-8b-instruct', displayName: 'Qwen3-VL 8B', notes: 'Good balance, 256K context' },
  { id: 'anthropic/claude-3.5-sonnet', displayName: 'Claude 3.5 Sonnet', notes: 'Excellent vision analysis' }
]

const imageModels: Model[] = [
  { id: 'google/gemini-3-pro-image-preview', displayName: 'Nano Banana Pro', notes: 'Best quality, perfect text rendering (Gemini 3 Pro)' },
  { id: 'openai/gpt-5-image', displayName: 'GPT-5 Image', notes: 'Superior instruction following and text rendering' },
  { id: 'black-forest-labs/flux.2-max', displayName: 'FLUX.2 Max', notes: 'Top-tier image quality and prompt understanding' },
  { id: 'sourceful/riverflow-v2-pro', displayName: 'Riverflow V2 Pro', notes: 'Perfect text rendering, top-tier control' },
  { id: 'black-forest-labs/flux.2-pro', displayName: 'FLUX.2 Pro', notes: 'High-end quality and reliability' }
]

export default function ModelSelector({
  visionModel,
  imageModel,
  onVisionModelChange,
  onImageModelChange
}: ModelSelectorProps) {
  const [useCustomVision, setUseCustomVision] = useState(false)
  const [useCustomImage, setUseCustomImage] = useState(false)
  const [customVisionModel, setCustomVisionModel] = useState('')
  const [customImageModel, setCustomImageModel] = useState('')

  const handleCustomVisionChange = (value: string) => {
    setCustomVisionModel(value)
    if (value.trim()) {
      onVisionModelChange(value.trim())
    }
  }

  const handleCustomImageChange = (value: string) => {
    setCustomImageModel(value)
    if (value.trim()) {
      onImageModelChange(value.trim())
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Select Models</h2>
      <p className="text-xs text-gray-500 mb-4">
        Check{' '}
        <a
          href="https://openrouter.ai/models"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          OpenRouter Models
        </a>
        {' '}for the latest available models and IDs
      </p>

      <div className="space-y-6">
        {/* Vision Model Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="vision-model" className="block text-sm font-medium text-gray-700">
              Vision Model (Description)
            </label>
            <button
              onClick={() => {
                setUseCustomVision(!useCustomVision)
                if (!useCustomVision) {
                  setCustomVisionModel('')
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {useCustomVision ? 'Use Preset' : 'Use Custom ID'}
            </button>
          </div>

          {!useCustomVision ? (
            <>
              <select
                id="vision-model"
                value={visionModel}
                onChange={(e) => onVisionModelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {visionModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {visionModels.find(m => m.id === visionModel)?.notes}
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                value={customVisionModel}
                onChange={(e) => handleCustomVisionChange(e.target.value)}
                placeholder="e.g., meta-llama/llama-4-maverick"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter any OpenRouter vision model ID
              </p>
            </>
          )}
        </div>

        {/* Image Model Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="image-model" className="block text-sm font-medium text-gray-700">
              Image Model (Reconstruction)
            </label>
            <button
              onClick={() => {
                setUseCustomImage(!useCustomImage)
                if (!useCustomImage) {
                  setCustomImageModel('')
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {useCustomImage ? 'Use Preset' : 'Use Custom ID'}
            </button>
          </div>

          {!useCustomImage ? (
            <>
              <select
                id="image-model"
                value={imageModel}
                onChange={(e) => onImageModelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {imageModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.displayName}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {imageModels.find(m => m.id === imageModel)?.notes}
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                value={customImageModel}
                onChange={(e) => handleCustomImageChange(e.target.value)}
                placeholder="e.g., google/gemini-3-pro-image-preview"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter any OpenRouter image generation model ID
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
