# Regrouping with Hundreds

> **Grade 2 Singapore MOE Mathematics · Lesson 5.3**  
> An interactive lesson for adding and subtracting 3-digit numbers with regrouping.

## What is this?

A React/Vite single-page application that teaches regrouping (carrying and borrowing) with hundreds through a five-phase learning journey:

| Phase | Description |
|---|---|
| 🔮 **Wonder** | Hook question to spark curiosity |
| 📖 **Story** | Narrative context with Oliver & Ruby at the biscuit factory |
| 🧪 **Simulate** | Three interactive base-10 block manipulation stations |
| 🎮 **Play** | 10 worlds × 10 questions with XP, streaks, and star ratings |
| 📝 **Reflect** | Open-ended consolidation prompt |

## Tech Stack

- **React 19** with hooks
- **Vite 8** (build tool)
- **ElevenLabs** pre-recorded narration (120 MP3s) with Web Speech API fallback
- **localStorage** for session persistence (24-hour TTL)
- No external state management — pure React `useState`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build & Preview

```bash
npm run build
npm run preview
```

## Deployment

This app is deployed on **Vercel**. The `vercel.json` includes a catch-all SPA rewrite so direct URL access never 404s.

### Deploy to Vercel

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

## Project Structure

```
src/
  components/
    phases/          # WonderPhase, StoryPhase, SimulatePhase, PlayPhase, ReflectPhase
    shared/          # Base10Block, ColumnLayout, Mascot, NumberPad, etc.
  data/
    questionBank.js  # 100 hand-authored questions across 10 types
    storyContent.js
  hooks/
    useAudio.js
    useLocalStorage.js
  utils/
    audioManager.js  # ElevenLabs → Web Speech fallback chain
    audioMap.js      # Pre-recorded audio file registry
    badgeEngine.js
    scoring.js
    narration.js
public/
  assets/
    audio/           # 120 pre-recorded MP3s
    *.png            # Scene images
```

## Audio

All narration lines are pre-recorded and mapped in `src/utils/audioMap.js`. The audio manager falls back to the browser's Web Speech API if a file is missing.

To regenerate audio files, set your ElevenLabs API key and run:

```bash
node scripts/gen_question_audio.cjs
```

## License

© Intellia Education. All rights reserved.
