# Deployment Guide

This guide will walk you through deploying the Vacation Interview Bot to Render.com with Couchbase as the database.

## Quick Checklist

Before deploying, make sure you have:

- [ ] Couchbase Cloud cluster created
- [ ] Couchbase bucket created (`vacation-interview-bot`)
- [ ] Couchbase credentials (username, password, connection string)
- [ ] OpenAI API key (you'll configure this after deployment)
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Render.com account created

## Step-by-Step Deployment

### Step 1: Prepare Couchbase (10 minutes)

1. **Create Couchbase Cloud Account**
   - Go to https://cloud.couchbase.com
   - Sign up for free account
   - Verify your email

2. **Create a Cluster**
   - Click "Create Cluster"
   - Select "Free Tier" (Capella Free Tier)
   - Choose cloud provider: AWS, Google Cloud, or Azure
   - Choose region closest to your Render.com deployment
   - Click "Create Cluster"
   - Wait 5-10 minutes for cluster to be ready

3. **Create a Bucket**
   - Once cluster is ready, go to "Data Tools" → "Buckets"
   - Click "Create Bucket"
   - Name: `vacation-interview-bot`
   - Memory Quota: Use default (100 MB is fine for free tier)
   - Click "Create"

4. **Create Database Access Credentials**
   - Go to "Connect" tab
   - Click "Database Access"
   - Click "Create Database Access"
   - Username: Choose a username (e.g., `admin`)
   - Password: Generate a strong password
   - Permissions: Select "All Buckets" with "Read/Write"
   - Click "Create"
   - **IMPORTANT**: Save the username and password securely

5. **Get Connection String**
   - In the "Connect" tab, find the connection string
   - It looks like: `couchbases://cb.xxxxx.cloud.couchbase.com`
   - Copy this string

### Step 2: Prepare GitHub Repository (5 minutes)

1. **Create GitHub Repository**
   ```bash
   # On GitHub.com
   # Click "New repository"
   # Name: vacation-interview-bot
   # Choose Private or Public
   # Don't initialize with README (we already have one)
   # Click "Create repository"
   ```

2. **Push Code to GitHub**
   ```bash
   cd /path/to/vacation-interview-bot
   
   # If not already initialized
   git init
   git add .
   git commit -m "Initial commit"
   
   # Add remote and push
   git remote add origin https://github.com/YOUR_USERNAME/vacation-interview-bot.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Render.com (15 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (recommended)
   - This will automatically connect your GitHub account

2. **Create New Web Service**
   - Click "New +" in the top right
   - Select "Web Service"
   - Connect your `vacation-interview-bot` repository
   - If you don't see it, click "Configure account" to grant access

3. **Configure Service Settings**
   - **Name**: `vacation-interview-bot` (or your preferred name)
   - **Region**: Choose closest to your Couchbase cluster region
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start`
   - **Plan**: Free (or paid if you need always-on)

4. **Add Environment Variables**
   
   Click "Advanced" and add these environment variables:

   ```
   COUCHBASE_CONNECTION_STRING=couchbases://cb.xxxxx.cloud.couchbase.com
   COUCHBASE_USERNAME=your_username_here
   COUCHBASE_PASSWORD=your_password_here
   COUCHBASE_BUCKET=vacation-interview-bot
   NODE_ENV=production
   ```

   **Replace with your actual values from Step 1!**

5. **Create Web Service**
   - Click "Create Web Service"
   - Render will start building and deploying
   - This takes 5-10 minutes
   - Watch the logs for any errors

6. **Verify Deployment**
   - Once deployed, you'll see "Live" status
   - Click on the URL (e.g., `https://vacation-interview-bot.onrender.com`)
   - You should see the home page

### Step 4: Configure OpenAI API (5 minutes)

1. **Get OpenAI API Key**
   - Go to https://platform.openai.com
   - Sign up or log in
   - Go to "API Keys" section
   - Click "Create new secret key"
   - Copy the key (starts with `sk-...`)
   - **IMPORTANT**: Save this key securely, you can only see it once

2. **Add Credits to OpenAI Account**
   - Go to "Settings" → "Billing"
   - Add payment method
   - Add credits (minimum $5 recommended)
   - Each interview costs approximately $0.01-0.05

3. **Configure in Application**
   - Open your deployed application
   - Click "Login" (use the OAuth provider)
   - Go to "Dashboard"
   - Click "Settings" button
   - Enter your OpenAI API key
   - Click "Save"

### Step 5: Test the Application (10 minutes)

1. **Create First Interview**
   - Click "Create Interview"
   - Title: `Test Vacation Interview`
   - Prompt: `Interview a person about their dream vacation. Ask about destination preferences, activities they enjoy, food preferences, budget, and travel dates.`
   - Questions: 5 (for testing)
   - Click "Create Interview"

2. **Test Interview Link**
   - Click "Copy Link" on the interview card
   - Open the link in an incognito/private window
   - Fill in name (optional)
   - Click "Start Interview"
   - Answer a few questions
   - Click "Complete Early" or finish all questions

3. **View Responses**
   - Go back to admin dashboard
   - Click "View Responses" on the interview
   - You should see your test session
   - Click on the session to see the conversation
   - Verify the summary was generated

## Troubleshooting

### Build Fails on Render

**Error**: `pnpm: command not found`
- **Solution**: Make sure build command is exactly: `pnpm install && pnpm run build`

**Error**: TypeScript compilation errors
- **Solution**: Check the logs for specific errors, usually missing dependencies

### Application Loads but Shows Errors

**Error**: "Couchbase connection string not provided"
- **Solution**: 
  1. Go to Render dashboard
  2. Click on your service
  3. Go to "Environment" tab
  4. Verify all environment variables are set
  5. Click "Manual Deploy" → "Clear build cache & deploy"

**Error**: "Interview configuration error"
- **Solution**: Make sure you've configured the OpenAI API key in the admin settings

### Couchbase Connection Fails

**Error**: Connection timeout or authentication failed
- **Solution**:
  1. Verify connection string is correct (starts with `couchbases://`)
  2. Verify username and password are correct
  3. Check that database access credentials have "All Buckets" permission
  4. Verify bucket name is exactly `vacation-interview-bot`
  5. Check Couchbase cluster is running (not paused)

### OpenAI API Errors

**Error**: "Insufficient quota" or "Rate limit exceeded"
- **Solution**: Add more credits to your OpenAI account

**Error**: "Invalid API key"
- **Solution**: Generate a new API key and update in admin settings

### Free Tier Limitations

**Render.com Free Tier**:
- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- **Solution**: Upgrade to paid plan ($7/month) for always-on service

**Couchbase Free Tier**:
- 50GB storage limit
- 1 cluster only
- Should be sufficient for thousands of interviews

## Updating the Application

When you make changes to the code:

1. **Commit and Push**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Automatic Deployment**
   - Render automatically detects the push
   - Rebuilds and redeploys the application
   - Takes 5-10 minutes

3. **Manual Deployment**
   - Go to Render dashboard
   - Click "Manual Deploy"
   - Select "Clear build cache & deploy" if needed

## Monitoring and Logs

### View Logs on Render
- Go to your service on Render
- Click "Logs" tab
- See real-time logs
- Look for errors or warnings

### Check Couchbase Status
- Go to Couchbase Cloud dashboard
- Click on your cluster
- View "Monitoring" tab
- Check query performance and storage usage

### Monitor OpenAI Usage
- Go to OpenAI platform
- Click "Usage" tab
- Monitor API calls and costs

## Security Best Practices

1. **Never commit secrets to Git**
   - API keys should only be in Render environment variables
   - Don't put them in code or `.env` files that get committed

2. **Use strong passwords**
   - Couchbase password should be strong and unique
   - Store credentials in a password manager

3. **Limit access**
   - Only give admin access to trusted users
   - Interviewees don't need accounts (they use shareable links)

4. **Regular updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities

## Cost Optimization

### Reduce OpenAI Costs
- Use `gpt-4o-mini` model (already configured, cheapest option)
- Set reasonable question limits (10-15 questions)
- Monitor usage regularly

### Reduce Render Costs
- Use free tier for testing
- Upgrade to paid plan only when needed for production
- Consider using a custom domain (included in paid plans)

### Couchbase Optimization
- Free tier is sufficient for most use cases
- Clean up old interview sessions periodically if needed
- Monitor storage usage

## Next Steps

After successful deployment:

1. **Create production interviews** for your actual use case
2. **Share interview links** with your target audience
3. **Monitor responses** in real-time from the admin dashboard
4. **Analyze insights** from the AI-generated summaries
5. **Iterate and improve** your interview prompts based on results

## Support Resources

- **Render.com Docs**: https://render.com/docs
- **Couchbase Docs**: https://docs.couchbase.com
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Application README**: See README.md in the project root

## Backup and Recovery

### Backup Couchbase Data
- Couchbase Cloud automatically backs up data
- You can export data from the Couchbase console if needed

### Backup Application Code
- Code is stored in GitHub (already backed up)
- Keep your `.env` variables documented separately

### Disaster Recovery
- If Render service fails: Redeploy from GitHub
- If Couchbase fails: Contact Couchbase support (free tier has support)
- If data is lost: Couchbase has automatic backups (check retention policy)

---

**Congratulations!** 🎉 Your AI-powered interview bot is now live and ready to use!

