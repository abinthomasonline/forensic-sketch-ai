import { useState } from 'react'
import Header from './components/Header'
import ApiKeyInput from './components/ApiKeyInput'
import ImageInput from './components/ImageInput'
import ModelSelector from './components/ModelSelector'
import RunButton from './components/RunButton'
import ProgressIndicator from './components/ProgressIndicator'
import Results from './components/Results'
import { generateForensicDescription, generateReconstructedImage } from './api'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [visionModel, setVisionModel] = useState('meta-llama/llama-4-maverick')
  const [imageModel, setImageModel] = useState('google/gemini-3-pro-image-preview')
  const [loading, setLoading] = useState(false)
  const [progressStage, setProgressStage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    originalImage: string
    reconstructedImage: string
    description: string
  } | null>(null)

  const canRun = apiKey.trim() !== '' && image !== null

  const handleRun = async () => {
    if (!canRun) return

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      setProgressStage('Generating forensic description...')
      const { description } = await generateForensicDescription(
        apiKey,
        visionModel,
        image!
      )

      setProgressStage('Generating reconstructed face...')
      const { imageUrl } = await generateReconstructedImage(
        apiKey,
        imageModel,
        description
      )

      setResults({
        originalImage: image!,
        reconstructedImage: imageUrl,
        description
      })
      setProgressStage(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProgressStage(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

          <ImageInput image={image} onImageChange={setImage} />

          <ModelSelector
            visionModel={visionModel}
            imageModel={imageModel}
            onVisionModelChange={setVisionModel}
            onImageModelChange={setImageModel}
          />

          <RunButton onClick={handleRun} disabled={!canRun} loading={loading} />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-medium">Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          <ProgressIndicator stage={progressStage} />

          {results && (
            <Results
              originalImage={results.originalImage}
              reconstructedImage={results.reconstructedImage}
              description={results.description}
            />
          )}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            All processing happens in your browser. No images or data are stored on any server.
            Your API key is only sent directly to OpenRouter.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
