# Gemini API Setup Instructions

## Getting Your API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (it starts with "AIza...")

## Local Development

1. Update `.env.local` file:
   ```
   VITE_GEMINI_API_KEY=AIza...your-actual-key-here
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

## AWS Amplify Deployment

1. In AWS Amplify Console:
   - Go to your app
   - Click "Environment variables" in the left sidebar
   - Add new variable:
     - Key: `VITE_GEMINI_API_KEY`
     - Value: Your Gemini API key

2. Redeploy your app

## Cost Control Features

Your app includes aggressive cost controls:

- **Daily Message Limit**: 50 messages/day (extremely conservative)
- **Rate Limiting**: 
  - 10 messages per hour per user
  - 3-second cooldown between messages
- **Token Optimization**:
  - Profile data reduced from 8,000 to ~800 tokens
  - Conversation history limited to last 5 exchanges
  - Responses capped at 150 tokens
  - User input truncated at 200 characters

## Expected Costs

With these controls:
- **Daily Cost**: $0 (stays within free tier)
- **Monthly Cost**: $0
- **Only costs if**: You manually increase the 50 message limit

## Monitoring Usage

- Check the footer: "Messages Sent Today: X/50"
- Yellow warning appears at 40+ messages
- Automatic cutoff at 50 to stay safe

## Emergency Controls

If you ever need to disable the AI:
1. Remove the API key from environment variables
2. The app will show "trouble connecting" messages
3. Users can still use the contact form