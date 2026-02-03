# Japanese Writing Self-Test

A Windows desktop application for self-testing your progress in the Japanese writing system (hiragana, katakana, and kanji).

## Features

- **Mark learned characters**: Indicate which hiragana, katakana, and kanji you have already learned. Progress is saved automatically and persists between sessions (stored in your user data folder when run as Electron, or in browser localStorage when run in the browser).
- **Choose syllabary**: Test one or more writing systems—hiragana, katakana, kanji, or any combination (e.g. hiragana + kanji).
- **Two test modes**:
  1. **Character mode**: A character (kana or kanji) is shown at random from your learned set. You self-check whether you know its reading, then press **Next** for the next character or **Stop** to finish.
  2. **Pronunciation mode**: A pronunciation (e.g. "ka", "bo") and its syllabary type are shown. You self-check whether you know how to write that character, then press **Next** or **Stop**.

## Requirements

- Node.js 18+
- Windows (primary target; Electron can run on macOS/Linux too)

## Setup and run

```bash
# Install dependencies
npm install

# Development: run Vite + Electron with hot reload
npm run electron:dev

# Production: build and run the packaged app
npm run build
npm run electron

# Create Windows installer
npm run dist
```

The built installer will be in `dist-electron/`.

## Data storage

When running as the Electron app, your learned characters are stored in:

- **Windows**: `%APPDATA%/japanese-writing-self-test/learned-characters.json`

You can back up or restore this file to keep your progress across reinstalls.

## Tech stack

- **Electron** – desktop shell
- **React** + **Vite** – UI
- **CSS** – styling (dark theme, Noto Sans JP for Japanese)
