import { useRef, useState } from 'react'
import Header from './components/Header'
import ApiKeyInput from './components/ApiKeyInput'
import ImageInput from './components/ImageInput'
import ModelSelector from './components/ModelSelector'
import RunButton from './components/RunButton'
import ProgressIndicator from './components/ProgressIndicator'
import Results from './components/Results'
import { generateForensicDescription, generateReconstructedImage } from './api'

const DEFAULT_IMAGE_URL = `${import.meta.env.BASE_URL}placeholder.jpg`

const resolveImageDataUrl = async (imageSource: string): Promise<string> => {
  if (imageSource.startsWith('data:')) {
    return imageSource
  }

  const response = await fetch(imageSource)
  if (!response.ok) {
    throw new Error(`Failed to load the default image (${response.status})`)
  }

  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to prepare the default image'))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error('Failed to prepare the default image'))
    reader.readAsDataURL(blob)
  })
}

function App() {
  const [apiKey, setApiKey] = useState('')
  const [image, setImage] = useState<string | null>(DEFAULT_IMAGE_URL)
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
  const activeRunRef = useRef(0)

  const canRun = apiKey.trim() !== '' && Boolean(image)

  const handleImageChange = (nextImage: string) => {
    activeRunRef.current += 1
    setImage(nextImage || null)
    setResults(null)
    setError(null)
    setProgressStage(null)
    setLoading(false)
  }

  const handleRun = async () => {
    if (!canRun) return

    const runId = activeRunRef.current + 1
    activeRunRef.current = runId
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const selectedImage = image!
      setProgressStage('Generating forensic description...')
      const imageForApi = await resolveImageDataUrl(selectedImage)
      const { description } = await generateForensicDescription(
        apiKey,
        visionModel,
        imageForApi
      )
      if (runId !== activeRunRef.current) return

      setProgressStage('Generating reconstructed face...')
      const { imageUrl } = await generateReconstructedImage(
        apiKey,
        imageModel,
        description
      )
      if (runId !== activeRunRef.current) return

      setResults({
        originalImage: selectedImage,
        reconstructedImage: imageUrl,
        description
      })
      setProgressStage(null)
    } catch (err) {
      if (runId !== activeRunRef.current) return
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      setProgressStage(null)
    } finally {
      if (runId === activeRunRef.current) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

          <ImageInput image={image} onImageChange={handleImageChange} />

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

        <section
          aria-labelledby="how-it-works-heading"
          className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 id="how-it-works-heading" className="text-lg font-medium text-gray-900">
            How the face-to-sketch experiment works
          </h2>
          <ol className="mt-4 grid gap-4 text-sm text-gray-600 md:grid-cols-3">
            <li>
              <h3 className="font-medium text-gray-900">1. Choose a photo</h3>
              <p className="mt-1">Upload an image or capture one with your device camera.</p>
            </li>
            <li>
              <h3 className="font-medium text-gray-900">2. Describe the face</h3>
              <p className="mt-1">A vision model converts visible facial details into a written description.</p>
            </li>
            <li>
              <h3 className="font-medium text-gray-900">3. Reconstruct a sketch</h3>
              <p className="mt-1">An image model uses that description to create a forensic-style sketch.</p>
            </li>
          </ol>
          <p className="mt-4 text-xs text-gray-500">
            This is a creative experiment, not an identification or investigative tool. AI outputs can be inaccurate.
          </p>
        </section>
      </main>

      <footer className="container mx-auto max-w-4xl px-4 pb-8">
        <div className="border-t border-gray-200 pt-6 text-center space-y-2">
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
        </div>
      </footer>
    </div>
  )
}

export default App
