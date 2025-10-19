# Vacation Interview Bot

AI-powered interview application that conducts intelligent, dynamic conversations with users. Perfect for market research, customer feedback, vacation planning, and any industry that needs structured interviews.

## Features

- 🤖 **Dynamic AI Questions**: Questions adapt based on user responses using OpenAI GPT
- 📊 **Real-Time Monitoring**: Watch interviews as they happen from the admin dashboard
- 📝 **Smart Summaries**: Automatically extract key insights and structured data
- 🔗 **Shareable Links**: Generate unique links for each interview
- 🎯 **Multi-Industry**: Works for any interview topic - vacation planning, job interviews, customer feedback, etc.
- 🔒 **Secure**: Built-in authentication and user management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, tRPC
- **Database**: Couchbase (NoSQL document database)
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Render.com

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher)
2. **pnpm** package manager
3. **Couchbase Cloud** account (free tier available)
4. **OpenAI API** account with API key
5. **GitHub** account
6. **Render.com** account

## Setup Instructions

### 1. Couchbase Setup

1. Go to [cloud.couchbase.com](https://cloud.couchbase.com)
2. Sign up for a free account
3. Create a new cluster:
   - Click **"Create Cluster"**
   - Choose **Free tier** (Capella Free Tier)
   - Select a cloud provider and region
4. Create a bucket:
   - Name: `vacation-interview-bot`
5. Create database credentials:
   - Go to **"Connect"** tab
   - Create **Database Access** credentials
   - Save the **username** and **password**
6. Get connection string:
   - Copy the **connection string** (looks like `couchbases://cb.xxxxx.cloud.couchbase.com`)

### 2. OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-...`)
6. Add billing information and credits (minimum $5 recommended)

**Note**: You'll configure the OpenAI API key through the admin panel after deployment, not as an environment variable.

### 3. GitHub Repository Setup

1. Create a new repository on GitHub:
   - Name: `vacation-interview-bot`
   - Make it **Private** or **Public**
   - Don't initialize with README
2. Push the code to GitHub:

```bash
cd vacation-interview-bot
git remote add origin https://github.com/YOUR_USERNAME/vacation-interview-bot.git
git branch -M main
git push -u origin main
```

### 4. Render.com Deployment

1. Go to [render.com](https://render.com)
2. Sign up or log in
3. Connect your GitHub account:
   - Go to **Account Settings** → **GitHub**
   - Authorize Render
4. Create a new **Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect your `vacation-interview-bot` repository
5. Configure the service:
   - **Name**: `vacation-interview-bot`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start`
   - **Plan**: Free tier
6. Add **Environment Variables**:

```
COUCHBASE_CONNECTION_STRING=couchbases://cb.xxxxx.cloud.couchbase.com
COUCHBASE_USERNAME=your_username
COUCHBASE_PASSWORD=your_password
COUCHBASE_BUCKET=vacation-interview-bot
NODE_ENV=production
```

7. Click **"Create Web Service"**
8. Wait for deployment to complete (5-10 minutes)
9. You'll get a URL like: `https://vacation-interview-bot.onrender.com`

### 5. First-Time Setup

1. Open your deployed application
2. Click **"Login"** and authenticate
3. Go to **Dashboard**
4. Click **"Settings"** and enter your OpenAI API key
5. Click **"Create Interview"** to create your first interview

## Local Development

To run the application locally:

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/vacation-interview-bot.git
cd vacation-interview-bot
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Add your Couchbase credentials to `.env`:
```
COUCHBASE_CONNECTION_STRING=couchbases://cb.xxxxx.cloud.couchbase.com
COUCHBASE_USERNAME=your_username
COUCHBASE_PASSWORD=your_password
COUCHBASE_BUCKET=vacation-interview-bot
```

5. Start the development server:
```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage Guide

### For Admins

1. **Configure OpenAI API Key**:
   - Go to Dashboard → Settings
   - Enter your OpenAI API key
   - Click Save

2. **Create an Interview**:
   - Click "Create Interview"
   - Enter interview title (e.g., "Vacation Planning Interview")
   - Enter interview prompt (e.g., "Interview a person about their next vacation. Understand where they want to go, what activities they like, food preferences, and budget.")
   - Select number of questions (5, 10, 15, or 20)
   - Click Create

3. **Share the Interview**:
   - Click "Copy Link" on the interview card
   - Share the link via email, SMS, or any channel

4. **View Responses**:
   - Click "View Responses" on any interview
   - See all sessions in real-time
   - Click on a session to see the full conversation
   - View AI-generated summaries and insights

### For Interviewees

1. Open the interview link shared by the admin
2. (Optional) Enter your name and email
3. Click "Start Interview"
4. Answer questions one by one
5. Click "Submit Answer" after each response
6. Complete all questions or click "Complete Early"
7. View your summary at the end

## Cost Estimates

- **Couchbase**: Free tier (up to 50GB)
- **Render.com**: Free tier (with some limitations) or $7/month for production
- **OpenAI API**: ~$0.01-0.05 per interview (varies based on conversation length)

## Troubleshooting

### Couchbase Connection Issues

If you see "Couchbase connection string not provided" in logs:
- Make sure environment variables are set correctly on Render.com
- Restart the service after adding environment variables

### OpenAI API Errors

If you get "Please configure your OpenAI API key first":
- Log in to the admin dashboard
- Go to Settings and enter your API key
- Make sure your OpenAI account has credits

### Interview Not Loading

If the interview link shows "Interview not found":
- Make sure the interview status is "active"
- Check that the link is correct
- Verify Couchbase connection is working

## Architecture

```
┌─────────────────┐
│   React App     │  (Frontend - TypeScript, Tailwind)
└────────┬────────┘
         │
         │ tRPC API
         │
┌────────▼────────┐
│  Express Server │  (Backend - Node.js)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│Couch │  │OpenAI │
│base  │  │  API  │
└──────┘  └───────┘
```

## Project Structure

```
vacation-interview-bot/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Node.js app
│   ├── _core/            # Core server functionality
│   ├── couchbase.ts      # Couchbase connection
│   ├── db-operations.ts  # Database operations
│   ├── models.ts         # Data models
│   ├── openai-service.ts # OpenAI integration
│   └── interview-router.ts # API routes
├── drizzle/              # Database migrations (legacy)
└── shared/               # Shared types and constants
```

## Environment Variables

### Required for Deployment

- `COUCHBASE_CONNECTION_STRING`: Couchbase cluster connection string
- `COUCHBASE_USERNAME`: Couchbase database username
- `COUCHBASE_PASSWORD`: Couchbase database password
- `COUCHBASE_BUCKET`: Couchbase bucket name (default: `vacation-interview-bot`)
- `NODE_ENV`: Set to `production` for deployment

### Auto-Injected (No Configuration Needed)

These are automatically provided by the template:
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- Various `VITE_*` variables for frontend

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Render.com logs for error messages
3. Verify all environment variables are set correctly
4. Ensure Couchbase cluster is running and accessible

## License

MIT License - feel free to use this for any purpose.

## Credits

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Couchbase](https://www.couchbase.com/)
- [OpenAI](https://openai.com/)

