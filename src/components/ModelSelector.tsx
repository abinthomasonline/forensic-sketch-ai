import { useState } from 'react'

export interface Model {
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

// Export model lists for testing
export const visionModels: Model[] = [
  { id: 'google/gemini-3-flash-preview', displayName: 'Google: Gemini 3 Flash Preview', notes: 'Fast, general multimodal vision' },
  { id: 'google/gemini-3-pro-preview', displayName: 'Google: Gemini 3 Pro Preview', notes: 'Higher detail, stronger visual reasoning' },

  { id: 'openai/gpt-5-nano', displayName: 'OpenAI: GPT-5 Nano', notes: 'Very fast, lightweight multimodal' },
  { id: 'openai/gpt-5.2-chat', displayName: 'OpenAI: GPT-5.2 Chat', notes: 'Balanced multimodal performance' },
  { id: 'openai/gpt-5.2', displayName: 'OpenAI: GPT-5.2', notes: 'High-quality multimodal reasoning' },

  { id: 'anthropic/claude-haiku-4.5', displayName: 'Anthropic: Claude Haiku 4.5', notes: 'Fast, concise extraction' },
  { id: 'anthropic/claude-sonnet-4.5', displayName: 'Anthropic: Claude Sonnet 4.5', notes: 'Balanced, structured output' },
  { id: 'anthropic/claude-opus-4.6', displayName: 'Anthropic: Claude Opus 4.6', notes: 'Most detailed, careful analysis' },

  { id: 'moonshotai/kimi-k2.5', displayName: 'MoonshotAI: Kimi K2.5', notes: 'Efficient vision-language model' }
]

export const imageModels: Model[] = [
  { id: 'google/gemini-2.5-flash-image', displayName: 'Google: Gemini 2.5 Flash Image (Nano Banana)', notes: 'Fast image generation' },
  { id: 'google/gemini-3-pro-image-preview', displayName: 'Google: Nano Banana Pro (Gemini 3 Pro Image Preview)', notes: 'Higher fidelity image output' },

  { id: 'openai/gpt-5-image-mini', displayName: 'OpenAI: GPT-5 Image Mini', notes: 'Efficient text-to-image' },
  { id: 'openai/gpt-5-image', displayName: 'OpenAI: GPT-5 Image', notes: 'Best overall image quality' }
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
