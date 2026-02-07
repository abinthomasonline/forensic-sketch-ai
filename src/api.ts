import {
  FORENSIC_DESCRIPTION_SYSTEM_PROMPT,
  FORENSIC_DESCRIPTION_USER_PROMPT,
  IMAGE_GENERATION_PROMPT_PREFIX,
  IMAGE_GENERATION_PROMPT_SUFFIX
} from './prompts'

const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1'

export interface VisionResponse {
  description: string
}

export interface ImageGenerationResponse {
  imageUrl: string
}

export async function generateForensicDescription(
  apiKey: string,
  modelId: string,
  imageBase64: string
): Promise<VisionResponse> {
  const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Face Reconstruction App'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: FORENSIC_DESCRIPTION_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: FORENSIC_DESCRIPTION_USER_PROMPT
            },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64
              }
            }
          ]
        }
      ]
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vision API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  const description = data.choices?.[0]?.message?.content

  if (!description) {
    throw new Error('No description generated')
  }

  return { description }
}

export async function generateReconstructedImage(
  apiKey: string,
  modelId: string,
  description: string
): Promise<ImageGenerationResponse> {
  const prompt = `${IMAGE_GENERATION_PROMPT_PREFIX}${description}${IMAGE_GENERATION_PROMPT_SUFFIX}`

  // OpenRouter uses the chat completions endpoint for all models, including image generation
  const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Face Reconstruction App'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      // Required for image generation models
      modalities: ['image', 'text']
    })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Image generation API error: ${response.status} - ${error}`)
  }

  const data = await response.json()

  // For image generation models, OpenRouter returns images in a specific format
  const message = data.choices?.[0]?.message

  if (!message) {
    throw new Error('No response from image generation model')
  }

  // Primary format: images array (correct OpenRouter format)
  if (message.images && Array.isArray(message.images) && message.images.length > 0) {
    const imageUrl = message.images[0]?.image_url?.url
    if (imageUrl) {
      return { imageUrl }
    }
  }

  // Fallback: check if content is an array (alternative multimodal response)
  if (Array.isArray(message.content)) {
    const imageContent = message.content.find((block: any) => block.type === 'image_url')
    if (imageContent?.image_url?.url) {
      return { imageUrl: imageContent.image_url.url }
    }
  }

  // Fallback: check if content is a string URL
  if (typeof message.content === 'string') {
    if (message.content.startsWith('http') || message.content.startsWith('data:')) {
      return { imageUrl: message.content }
    }
  }

  // Debug info
  console.error('Unexpected response format:', JSON.stringify(data, null, 2))
  throw new Error('No image found in response. The model may not support image generation or returned an unexpected format.')
}
