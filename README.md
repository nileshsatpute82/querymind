# QueryMind

**AI that thinks and asks the right questions**

QueryMind is an AI-powered interview platform that conducts intelligent, dynamic conversations. Perfect for market research, customer feedback, HR screening, product discovery, and any industry that needs smart, adaptive interviews.

---

## ✨ Features

- 🤖 **Dynamic AI Questions**: Questions adapt based on user responses using OpenAI GPT
- 📊 **Real-Time Monitoring**: Watch interviews as they happen from the admin dashboard
- 📝 **Smart Summaries**: Automatically extract key insights and structured data
- 🔗 **Shareable Links**: Generate unique links for each interview (no login required for participants)
- 🎯 **Any Industry**: Works for vacation planning, job interviews, customer feedback, or any custom topic
- 🔒 **Secure**: Built-in authentication and user management
- ⚡ **Fast**: Powered by modern web technologies

---

## 🚀 Quick Start

### For First-Time Setup

Follow the complete step-by-step guide in **[SETUP-GUIDE.md](./SETUP-GUIDE.md)**

It covers:
1. Setting up Couchbase database
2. Getting OpenAI API key
3. Pushing code to GitHub
4. Deploying to Render.com
5. Configuring the application
6. Testing your first interview

### For Developers

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/querymind.git
cd querymind

# Install dependencies
pnpm install

# Set up environment variables (see below)
# Create .env file with your Couchbase credentials

# Start development server
pnpm run dev

# Open http://localhost:3000
```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Express, tRPC 11
- **Database**: Couchbase (NoSQL document database)
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: Built-in OAuth
- **Deployment**: Render.com

---

## 📋 Environment Variables

### Required for Deployment

Add these to your Render.com environment variables:

```
COUCHBASE_CONNECTION_STRING=couchbases://cb.xxxxx.cloud.couchbase.com
COUCHBASE_USERNAME=your_username
COUCHBASE_PASSWORD=your_password
COUCHBASE_BUCKET=vacation-interview-bot
NODE_ENV=production
```

### Auto-Injected (No Configuration Needed)

These are automatically provided by the template:
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `OWNER_OPEN_ID`
- Various `VITE_*` variables for frontend

---

## 📖 How It Works

### For Admins

1. **Configure OpenAI API Key**
   - Log in to the dashboard
   - Go to Settings
   - Enter your OpenAI API key

2. **Create an Interview**
   - Click "Create Interview"
   - Enter title (e.g., "Customer Feedback Survey")
   - Enter prompt describing what you want to learn
   - Select number of questions (5, 10, 15, or 20)

3. **Share the Link**
   - Copy the unique interview link
   - Share via email, SMS, or any channel

4. **Monitor Responses**
   - View all sessions in real-time
   - See conversations as they happen
   - Review AI-generated summaries

### For Interviewees

1. Open the interview link
2. (Optional) Enter name and email
3. Click "Start Interview"
4. Answer questions one by one
5. Complete all questions or finish early
6. View summary at the end

---

## 🎨 Design System

QueryMind uses a Monday.com-inspired design system with:

- **Colors**: Coral/pink primary, purple secondary, green accent
- **Layout**: Clean, spacious cards with subtle shadows
- **Typography**: Modern, readable fonts with clear hierarchy
- **Components**: Built with shadcn/ui for consistency
- **Responsive**: Works on desktop, tablet, and mobile

---

## 📁 Project Structure

```
querymind/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   ├── InterviewDetails.tsx # Response viewer
│   │   │   └── Interview.tsx      # Interview interface
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and configurations
│   │   └── styles/        # Theme and CSS
├── server/                # Backend Node.js app
│   ├── _core/            # Core server functionality
│   ├── couchbase.ts      # Couchbase connection
│   ├── db-operations.ts  # Database operations
│   ├── models.ts         # Data models
│   ├── openai-service.ts # OpenAI integration
│   └── interview-router.ts # API routes
├── shared/               # Shared types and constants
├── README.md            # This file
└── SETUP-GUIDE.md       # Complete setup instructions
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Type checking
pnpm run typecheck

# Linting
pnpm run lint
```

### Adding New Features

1. **Database Models**: Update `server/models.ts`
2. **Database Operations**: Add functions to `server/db-operations.ts`
3. **API Routes**: Extend `server/interview-router.ts`
4. **Frontend Pages**: Create components in `client/src/pages/`
5. **UI Components**: Use shadcn/ui components from `client/src/components/ui/`

---

## 💰 Cost Estimates

### Couchbase Cloud
- **Free Tier**: 50GB storage, sufficient for thousands of interviews
- **Cost**: $0/month

### Render.com
- **Free Tier**: 750 hours/month, spins down after inactivity
- **Paid Tier**: $7/month, always-on
- **Recommendation**: Start free, upgrade when needed

### OpenAI API
- **Model**: GPT-4o-mini (most cost-effective)
- **Cost per interview**: $0.01-0.05
- **Example**: $20 credit = ~400-2000 interviews

### Total
- **Minimum**: $0 + OpenAI usage
- **Recommended**: $7/month + OpenAI usage

---

## 🐛 Troubleshooting

### Common Issues

**"Couchbase not initialized"**
- Check environment variables are set correctly on Render
- Verify connection string, username, and password
- Restart the service

**"Please configure your OpenAI API key first"**
- Log in to admin dashboard
- Go to Settings and enter your API key
- Make sure your OpenAI account has credits

**Interview link shows "Interview not found"**
- Verify interview status is "active"
- Check Couchbase connection is working
- Review Render logs for errors

**Questions not generating**
- Verify OpenAI API key is correct
- Check OpenAI account has credits
- Review Render logs for API errors

See **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** for more troubleshooting help.

---

## 🔐 Security

- Never commit API keys or secrets to Git
- Use environment variables for all sensitive data
- Keep dependencies updated
- Monitor API usage regularly
- Use strong passwords for Couchbase

---

## 📊 Monitoring

### Render Logs
- View real-time application logs
- Monitor for errors and warnings

### Couchbase Dashboard
- Check cluster health
- Monitor storage usage
- View query performance

### OpenAI Usage
- Track API calls
- Monitor costs
- Set up billing alerts

---

## 🚀 Deployment

### Render.com (Recommended)

1. Push code to GitHub
2. Connect GitHub to Render
3. Add environment variables
4. Deploy automatically

See **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** for complete instructions.

### Other Platforms

QueryMind can be deployed to any platform that supports Node.js:
- Vercel
- Railway
- Fly.io
- AWS
- Google Cloud
- Azure

Just ensure you set the required environment variables.

---

## 📝 Use Cases

QueryMind works for any industry that needs intelligent interviews:

- **Market Research**: Understand customer needs and preferences
- **Product Feedback**: Gather insights on product usage and improvements
- **HR Screening**: Conduct preliminary candidate interviews
- **Customer Support**: Collect detailed issue reports
- **User Research**: Discover user pain points and desires
- **Event Planning**: Understand attendee preferences
- **Healthcare**: Patient intake and symptom assessment
- **Education**: Student feedback and course evaluations
- **Real Estate**: Property preference discovery
- **Travel**: Vacation planning and preference gathering

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - feel free to use this for any purpose.

---

## 🙏 Credits

Built with:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tRPC](https://trpc.io/)
- [Couchbase](https://www.couchbase.com/)
- [OpenAI](https://openai.com/)

---

## 📞 Support

For setup help, see **[SETUP-GUIDE.md](./SETUP-GUIDE.md)**

For technical issues:
- Check Render logs
- Review Couchbase dashboard
- Verify OpenAI API status

---

**QueryMind - AI that thinks and asks the right questions** 🧠✨

