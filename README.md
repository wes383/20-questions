# 20 Questions AI Game

An AI-powered 20 questions guessing game built with Google Gemini API for intelligent question-answering interactions.

## Overview

This is a web-based game built with React and TypeScript where players try to guess what the AI is thinking by asking up to 20 yes/no questions. The game uses Google Gemini AI to understand player questions and provide intelligent responses.

### Key Features

- Daily Word: Different answer each day, playable once per day
- AI-Powered: Uses Google Gemini 2.5 Flash model for intelligent Q&A
- Hint System: Get a hint after 10 guesses

## Installation and Setup

### Prerequisites

- Node.js (16.x or higher recommended)
- npm or another package manager

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:5173` (default port).

### Production Build

```bash
npm run build
```

Build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## How to Use

### Get an API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key

### Configure the Game

1. Open the game and click the "Settings" button in the top-left corner
2. Paste your Gemini API key in the settings panel

### Rules

1. The AI thinks of an item
2. You have up to 20 attempts to guess it by asking yes/no questions
3. You can ask questions (e.g., "Is it an animal?") or make direct guesses (e.g., "Is it a dolphin?")
4. The AI will respond with "Yes", "No", or "Maybe"
5. After 10 guesses, you can click "Get a Hint" for one hint
6. The game ends when you guess correctly or run out of 20 attempts
7. You can only play once per day; a new answer is available the next day