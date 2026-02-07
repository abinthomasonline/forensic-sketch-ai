# Forensic Sketch AI

A fully static web application that generates forensic facial descriptions and reconstructed face sketches using AI models via OpenRouter. A simple experiment studying information loss across modalities (vision → language → vision). All models are integration tested and verified to work.

## Features

- **AI-Powered Facial Analysis**: Generate detailed forensic-style descriptions using state-of-the-art vision models
- **Face Sketch Reconstruction**: Create reconstructed face sketches from descriptions using advanced image generation models
- **14 Verified Models**: All models are integration tested against the actual OpenRouter API
  - 9 vision models (Google Gemini, OpenAI GPT-5, Anthropic Claude, MoonshotAI Kimi, etc.)
  - 4 image generation models (Google Gemini, OpenAI GPT-5, etc.)
- **Custom Model Support**: Toggle to use any OpenRouter model ID beyond the preset options
- **Camera & Upload**: Capture photos directly or upload from your device
- **Fully Client-Side**: No backend, no data storage, complete privacy
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Free Test Key**: Public API key included for immediate testing

## Live Demo

🚀 [https://abinthomasonline.github.io/forensic-sketch-ai/](https://abinthomasonline.github.io/forensic-sketch-ai/)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: OpenRouter (unified interface for multiple AI providers)
- **Testing**: Vitest with integration tests

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- An OpenRouter API key ([Get one here](https://openrouter.ai/)) - or use the included public test key

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

### Testing

Run the integration test suite to verify all models work:

```bash
npm test
```

Tests run sequentially (3-minute timeout per model) to avoid rate limiting. All 14 models are tested against the actual OpenRouter API.

## Usage

1. **Open the app** in your browser
2. **Enter API key** (or click "don't have a key?" to use the public test key)
3. **Upload/capture a photo** (placeholder image loads by default)
4. **Select models**:
   - Vision model: Analyzes the photo and generates forensic description
   - Image model: Reconstructs the face from the description
   - Toggle "Use Custom ID" to enter any OpenRouter model ID
5. **Click "Run Reconstruction"**
6. **View results**: Original image, reconstructed image, and forensic description

## Verified Models

### Vision Models (Forensic Description)
- Google: Gemini 3 Flash Preview, Gemini 3 Pro Preview
- OpenAI: GPT-5 Nano, GPT-5.2 Chat, GPT-5.2, GPT-5.2 Pro
- Anthropic: Claude Haiku 4.5, Claude Sonnet 4.5, Claude Opus 4.6
- MoonshotAI: Kimi K2.5

### Image Generation Models (Face Reconstruction)
- Google: Gemini 3 Pro Image Preview, Gemini 2.5 Flash Image
- OpenAI: GPT-5 Image Mini, GPT-5 Image

All models are validated through automated integration tests. Failed models have been removed to ensure users only see working options.

## Custom Models

Want to try other models? Click "Use Custom ID" on either model selector and enter any OpenRouter model ID:

- Find models at [OpenRouter Models](https://openrouter.ai/models)
- Vision models: Look for models with image input capabilities
- Image generation models: Look for models with image output capabilities
- Format: `provider/model-name` (e.g., `meta-llama/llama-4-maverick`)

## Privacy & Security

- ✅ All processing happens in your browser
- ✅ No images or data are stored on any server
- ✅ Your API key is only sent directly to OpenRouter
- ✅ Optional local storage for API key (can be disabled)
- ✅ No tracking or analytics

## Development

### Project Structure

```
face-reconstruction/
├── src/
│   ├── components/       # React components
│   ├── api.ts           # OpenRouter API integration
│   ├── prompts.ts       # Forensic description prompts
│   └── App.tsx          # Main application
├── tests/
│   └── models.test.ts   # Integration tests
├── public/
│   ├── placeholder.png  # Default image
│   └── favicon-*.png    # Favicon set
└── vitest.config.ts     # Test configuration
```

### Adding New Models

1. Add model to `src/components/ModelSelector.tsx`
2. Run `npm test` to validate it works
3. If tests pass, the model is ready for production

## Deployment to GitHub Pages

This project is configured with GitHub Actions for automatic deployment. Every push to the `main` branch will automatically deploy to GitHub Pages.

### Initial Setup (One-time)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push
   ```

2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Under "Build and deployment", set Source to: **GitHub Actions**

3. Wait for the workflow to complete (check the Actions tab)

4. Your site will be live at: `https://abinthomasonline.github.io/forensic-sketch-ai/`

### Manual Deployment

To deploy manually without pushing:
```bash
npm run deploy
```

Then follow the same GitHub Pages settings above.

## Credits

Made with ❤️ by [abinthomasonline](https://github.com/abinthomasonline) using [Claude Code](https://code.claude.com/)

## License

MIT

---

**Note**: This app uses OpenRouter's unified API to access models from multiple providers. Model availability and capabilities may change over time. Run `npm test` to verify current model status.
