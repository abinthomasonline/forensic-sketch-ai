import { useState, useEffect } from 'react'

interface ApiKeyInputProps {
  apiKey: string
  onApiKeyChange: (key: string) => void
}

export default function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [rememberKey, setRememberKey] = useState(false)
  const [showPublicKey, setShowPublicKey] = useState(false)

  // TODO: Replace with actual public key
  const PUBLIC_KEY = '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'

  useEffect(() => {
    const savedKey = localStorage.getItem('openrouter_api_key')
    if (savedKey) {
      onApiKeyChange(savedKey)
      setRememberKey(true)
    }
  }, [onApiKeyChange])

  const handleKeyChange = (key: string) => {
    onApiKeyChange(key)
    if (rememberKey) {
      localStorage.setItem('openrouter_api_key', key)
    }
  }

  const handleRememberChange = (remember: boolean) => {
    setRememberKey(remember)
    if (remember && apiKey) {
      localStorage.setItem('openrouter_api_key', apiKey)
    } else {
      localStorage.removeItem('openrouter_api_key')
    }
  }

  const handleUsePublicKey = () => {
    handleKeyChange(PUBLIC_KEY)
    setShowPublicKey(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
        OpenRouter API Key
      </label>
      <input
        id="api-key"
        type="text"
        value={apiKey}
        onChange={(e) => handleKeyChange(e.target.value)}
        placeholder="Enter your OpenRouter API key"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div className="mt-3 flex items-center">
        <input
          id="remember-key"
          type="checkbox"
          checked={rememberKey}
          onChange={(e) => handleRememberChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-key" className="ml-2 text-sm text-gray-600">
          Remember my key (stored locally)
        </label>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Your API key is only sent to OpenRouter and never stored on any server
        </p>
        <button
          onClick={() => setShowPublicKey(!showPublicKey)}
          className="text-xs text-blue-600 hover:text-blue-700 underline cursor-pointer"
        >
          don't have a key?
        </button>
      </div>

      {showPublicKey && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-gray-700 mb-2">
            <strong>Free Public Key (Limited Usage)</strong>
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs text-gray-800 overflow-x-auto">
              {PUBLIC_KEY}
            </code>
            <button
              onClick={handleUsePublicKey}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition whitespace-nowrap"
            >
              Use Key
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            This is a shared key with rate limits. For unlimited access, get your own key at{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenRouter
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
