import { useState, useRef } from 'react'

interface ImageInputProps {
  image: string | null
  onImageChange: (imageBase64: string) => void
}

export default function ImageInput({ image, onImageChange }: ImageInputProps) {
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
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

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      })
      setStream(mediaStream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Unable to access camera. Please check permissions.')
    }
  }

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
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-md bg-black"
          />
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
          <img src={image} alt="Selected" className="w-full rounded-md" />
          <button
            onClick={() => onImageChange('')}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Remove Photo
          </button>
        </div>
      )}
    </div>
  )
}
