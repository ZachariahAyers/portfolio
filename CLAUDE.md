# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered portfolio website for Zachariah Ayers featuring an interactive AI assistant named "Arlo". Built with React, Vite, and TailwindCSS, integrated with Google Gemini API through AWS Lambda endpoints.

## Commands

### Development
```bash
npm run dev          # Start development server on port 5173
npm run build        # Create production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint checks
```

### Working with the codebase
- Always run `npm run lint` after making changes to ensure code quality
- The project uses Vite, so hot module replacement is available during development
- Environment variables are loaded from `.env` (API_ENDPOINT must be set)

## Architecture

### Core Application Flow
1. **Entry Point**: `main.jsx` → Sets up providers and renders AppRouter
2. **Routing**: `AppRouter.jsx` → Defines routes for chat, dashboard, experiments
3. **Main Interface**: `App.jsx` → Chat interface with Gemini API integration
4. **Error Handling**: `ErrorBoundary.jsx` → Catches and reports errors to Lambda

### API Integration Pattern
```javascript
// All API calls go through config/api.js for sanitization
const response = await fetch(`${API_ENDPOINT}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: sanitizeInput(userMessage),
    conversationHistory 
  })
});
```

### Component Organization
- **components/**: Reusable UI components (Button, Card, Modal, etc.)
- **components/dashboard/**: Case study specific components
- **components/experiments/**: Interactive experiments like SpaceInvaders
- **hooks/**: Custom React hooks (useTheme, useTypewriter, useWebVitals)
- **utils/**: Utility functions (resumeGenerator.js for PDF creation)

### State Management
- Local state with useState/useReducer
- Theme state managed via ThemeProvider context
- No global state management library - data passed via props

### Security Considerations
- Input sanitization in `config/api.js` using regex patterns
- XSS protection headers required on Lambda endpoints
- Rate limiting (50 messages/day) implemented server-side
- Prompt injection protection in system prompts

### Styling Approach
- TailwindCSS for utility-first styling
- Dark mode support via `dark:` variants
- Consistent color scheme using CSS variables
- Responsive design with mobile-first approach

### Key Dependencies
- **framer-motion**: Animation library for smooth transitions
- **lucide-react**: Icon library
- **react-markdown**: Rendering AI responses with code highlighting
- **jspdf & html2canvas**: PDF generation for resumes
- **@radix-ui/react-tooltip**: Accessible tooltip components

## Important Patterns

### Error Reporting
Errors are automatically reported to Lambda endpoint:
```javascript
// ErrorBoundary sends error details to /report-error endpoint
const errorInfo = {
  message: error.toString(),
  stack: error.stack,
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString()
};
```

### AI Message Formatting
The chat system uses specific markers for features:
- `[GENERATE_RESUME]` - Triggers resume generation
- `[START_INTERVIEW]` - Initiates mock interview mode
- Code blocks are rendered with syntax highlighting

### Performance Optimizations
- Manual chunk splitting in vite.config.js
- Lazy loading for experiments and dashboard routes
- Terser minification in production builds
- Code splitting for vendor dependencies

## Development Notes

- No test files currently exist - consider adding tests when implementing new features
- The project uses ESLint but no TypeScript - be careful with prop types
- Mobile menu component exists but may need z-index adjustments (see recent commits)
- When modifying the chat interface, maintain the personality of "Arlo" as defined in App.jsx