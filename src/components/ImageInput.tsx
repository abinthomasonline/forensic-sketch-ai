import { useState, useRef, useEffect } from 'react'

interface ImageInputProps {
  image: string | null
  onImageChange: (imageBase64: string) => void
}

export default function ImageInput({ image, onImageChange }: ImageInputProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      onImageChange(base64)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async (mode: 'user' | 'environment' = 'user') => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      })
      setStream(mediaStream)
      setFacingMode(mode)
      setShowCamera(true)
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const switchCamera = async () => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    // Start camera with opposite facing mode
    const newMode = facingMode === 'user' ? 'environment' : 'user'
    await startCamera(newMode)
  }

  // Attach stream to video element after it's mounted
  useEffect(() => {
    if (stream && videoRef.current && showCamera) {
      videoRef.current.srcObject = stream
      // Explicitly play the video (required for some browsers)
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err)
      })
    }
  }, [stream, showCamera])

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0)
      const base64 = canvas.toDataURL('image/jpeg')
      onImageChange(base64)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upload or Capture Photo</h2>

      {!image && !showCamera && (
        <div className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Upload Photo
          </button>
          <button
            onClick={startCamera}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
          >
            Use Camera
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {showCamera && (
        <div className="space-y-3">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-md bg-black"
            />
            <button
              onClick={switchCamera}
              className="absolute top-4 right-4 p-3 bg-white/90 rounded-full hover:bg-white transition shadow-lg"
              title="Switch camera"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={capturePhoto}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {image && !showCamera && (
        <div className="space-y-3">
          <img
            src={image}
            alt="Selected"
            className="w-full max-h-96 object-contain rounded-md bg-gray-50"
          />
          <button
            onClick={() => onImageChange('')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Replace Photo
          </button>
        </div>
      )}
    </div>
  )
}
