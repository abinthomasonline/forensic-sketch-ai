# Face Reconstruction App

A fully static web application that generates forensic facial descriptions and reconstructed face images using AI models via OpenRouter.

## Features

- Upload or capture photos using your device camera
- Generate forensic-style facial descriptions using vision AI models
- Create reconstructed face images from descriptions using image generation models
- Fully client-side with no backend or data storage
- Mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- An OpenRouter API key ([Get one here](https://openrouter.ai/))

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment to GitHub Pages

1. Update `vite.config.ts` with your repository name:
   ```ts
   base: '/your-repo-name/',
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy the `dist` folder to GitHub Pages:
   ```bash
   # Option 1: Use gh-pages package
   npm install -g gh-pages
   gh-pages -d dist

   # Option 2: Manual deployment
   # Push the dist folder to the gh-pages branch
   ```

4. Enable GitHub Pages in your repository settings (Source: gh-pages branch)

## Usage

1. Open the app in your browser
2. Paste your OpenRouter API key
3. Upload a photo or use your camera to capture one
4. Select the AI models you want to use:
   - Vision model for generating the forensic description
   - Image model for reconstructing the face
5. Click "Run Reconstruction"
6. View the results: original image, reconstructed image, and forensic description

### Finding Valid Model IDs

To find the current list of available models on OpenRouter:

1. Visit [OpenRouter Models](https://openrouter.ai/models)
2. Look for models with:
   - **Vision capabilities** (for description generation) - models that accept image inputs
   - **Image generation capabilities** (for reconstruction) - models that create images
3. Use the model ID shown on the model page (format: `provider/model-name`)

**Note:** Not all models on OpenRouter support image generation. Check the model details to ensure it has image generation capabilities. Common image generation models include FLUX and Stable Diffusion variants.

## Privacy & Security

- All processing happens in your browser
- No images or data are stored on any server
- Your API key is only sent directly to OpenRouter
- Optional local storage for API key (can be disabled)

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- OpenRouter API

## License

MIT
