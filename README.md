# Conversational QA Prototype

A voice-first quality assurance application for loan approval decisions, built with React, TypeScript, and modern UI components.

## Features

- **Loan Approval Form**: Interactive form for making loan decisions with comprehensive applicant data
- **Voice QA Session**: AI-powered conversational quality assurance using voice interactions
- **Quality Coach**: Intelligent coaching system with personalized recommendations
- **Audio Recording**: Built-in audio recording capabilities for voice interactions
- **Modern UI**: Beautiful, responsive interface built with shadcn/ui components
- **Animations**: Smooth transitions and animations using Framer Motion
- **Dark Mode**: Full dark mode support with theme switching

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with CSS Variables
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Audio**: Web Audio API with MediaRecorder

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd conversational-qa
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory.

### Linting

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── figma/             # Figma-imported components
│   ├── AudioRecorder.tsx  # Audio recording component
│   ├── LoanApprovalForm.tsx
│   ├── QualityCoach.tsx
│   └── VoiceQASession.tsx
├── styles/
│   └── globals.css        # Global styles and CSS variables
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## Key Components

### LoanApprovalForm
Interactive form for loan officers to input applicant data and make approval decisions. Includes validation, risk assessment, and decision rationale.

### QualityCoach
AI-powered coaching component that provides conversational QA through voice interactions. Generates personalized recommendations based on the loan decision.

### AudioRecorder
Handles voice recording functionality with permission management and audio processing.

### VoiceQASession
Manages voice-based quality assurance sessions with AI prompts and user responses.

## Configuration

### Tailwind CSS
The project uses a comprehensive design system with CSS variables for theming. Colors, spacing, and other design tokens are defined in `src/styles/globals.css`.

### TypeScript
Strict TypeScript configuration with path mapping for clean imports using the `@/` alias.

### ESLint
Configured for React and TypeScript with recommended rules and React Hooks linting.

## Browser Support

- Chrome/Edge 88+
- Firefox 89+
- Safari 14+

Note: Voice recording requires HTTPS in production environments due to browser security requirements.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Firebase config and API keys (OpenAI, ElevenLabs)

# Run development server
npm run dev
```

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication, Firestore, and Storage
3. Add your config to `.env.local`
4. Initialize Firestore with seed data: `npm run seed`

## Deploy to Firebase Hosting

```bash
npm run build
firebase deploy
```

## Voice APIs Required

- OpenAI API key (for Whisper STT + GPT-4)
- ElevenLabs API key (for realistic TTS)

## Environment Variables

Create `.env.local` with:

```
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI APIs
OPENAI_API_KEY=your_openai_key
ELEVEN_LABS_API_KEY=your_elevenlabs_key
ELEVEN_LABS_VOICE_ID=your_voice_id

# Firebase Admin (Server-side)
FIREBASE_SERVICE_ACCOUNT_KEY=your_service_account_json