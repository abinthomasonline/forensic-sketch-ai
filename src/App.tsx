import { useState, useEffect } from 'react'
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
  const [visionModel, setVisionModel] = useState('google/gemini-3-flash-preview')
  const [imageModel, setImageModel] = useState('google/gemini-2.5-flash-image')
  const [loading, setLoading] = useState(false)
  const [progressStage, setProgressStage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    originalImage: string
    reconstructedImage: string
    description: string
  } | null>(null)

  // Load placeholder image on mount
  useEffect(() => {
    const loadPlaceholderImage = async () => {
      try {
        const response = await fetch(import.meta.env.BASE_URL + 'placeholder.png')
        const blob = await response.blob()
        const reader = new FileReader()
        reader.onloadend = () => {
          setImage(reader.result as string)
        }
        reader.readAsDataURL(blob)
      } catch (err) {
        console.error('Failed to load placeholder image:', err)
      }
    }

    loadPlaceholderImage()
  }, [])

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

        <footer className="mt-12 pt-6 border-t border-gray-200 text-center space-y-2">
          <p className="text-xs text-gray-500">
          All processing happens in your browser and on OpenRouter’s servers. No images or data are stored by this site. Your API key is sent directly to OpenRouter only.
          </p>
          <p className="text-xs text-gray-500">
            Made with ❤️ by{' '}
            <a
              href="https://github.com/abinthomasonline"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              abinthomasonline
            </a>
            {' '}using{' '}
            <a
              href="https://code.claude.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              claude
            </a>
            {' '}•{' '}
            <a
              href="https://github.com/abinthomasonline/forensic-sketch-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              source code
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
