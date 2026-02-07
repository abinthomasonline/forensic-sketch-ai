import { describe, it, expect } from 'vitest'
import { visionModels, imageModels } from '../src/components/ModelSelector'
import { PUBLIC_KEY } from '../src/components/ApiKeyInput'
import { generateForensicDescription, generateReconstructedImage } from '../src/api'

// Small test image (1x1 red pixel as base64)
const TEST_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=='

// Simple test description for image generation
const TEST_DESCRIPTION = 'A person with: round face, brown eyes, short dark hair, neutral expression'

describe('Vision Models Integration Test', () => {
  it.each(visionModels.map(m => [m.id, m.displayName]))(
    'should validate vision model: %s (%s)',
    async (modelId, displayName) => {
      console.log(`\nTesting vision model: ${displayName} (${modelId})`)

      // Use actual API function from our codebase
      const result = await generateForensicDescription(
        PUBLIC_KEY,
        modelId as string,
        TEST_IMAGE
      )

      // Verify we got a description back
      expect(result.description).toBeDefined()
      expect(typeof result.description).toBe('string')
      expect(result.description.length).toBeGreaterThan(0)

      console.log(`✓ Vision model ${displayName} - PASSED`)
    },
    180000 // 3 minute timeout per test
  )
})

describe('Image Generation Models Integration Test', () => {
  it.each(imageModels.map(m => [m.id, m.displayName]))(
    'should validate image model: %s (%s)',
    async (modelId, displayName) => {
      console.log(`\nTesting image model: ${displayName} (${modelId})`)

      // Use actual API function from our codebase
      const result = await generateReconstructedImage(
        PUBLIC_KEY,
        modelId as string,
        TEST_DESCRIPTION
      )

      // Verify we got an image URL back
      expect(result.imageUrl).toBeDefined()
      expect(typeof result.imageUrl).toBe('string')
      expect(
        result.imageUrl.startsWith('http') || result.imageUrl.startsWith('data:image')
      ).toBe(true)

      console.log(`✓ Image model ${displayName} - PASSED`)
    },
    180000 // 3 minute timeout per test
  )
})

describe('Model Configuration Validation', () => {
  it('should have at least one vision model', () => {
    expect(visionModels.length).toBeGreaterThan(0)
  })

  it('should have at least one image model', () => {
    expect(imageModels.length).toBeGreaterThan(0)
  })

  it('should have valid model IDs (no empty strings)', () => {
    visionModels.forEach(model => {
      expect(model.id).toBeTruthy()
      expect(model.displayName).toBeTruthy()
    })

    imageModels.forEach(model => {
      expect(model.id).toBeTruthy()
      expect(model.displayName).toBeTruthy()
    })
  })

  it('should have unique model IDs', () => {
    const allVisionIds = visionModels.map(m => m.id)
    const uniqueVisionIds = new Set(allVisionIds)
    expect(uniqueVisionIds.size).toBe(allVisionIds.length)

    const allImageIds = imageModels.map(m => m.id)
    const uniqueImageIds = new Set(allImageIds)
    expect(uniqueImageIds.size).toBe(allImageIds.length)
  })
})
