# QueryMind - Complete Setup Guide

**AI that thinks and asks the right questions**

This guide will walk you through deploying QueryMind from scratch. Follow each step carefully.

---

## 📋 Prerequisites Checklist

Before you begin, make sure you have accounts for:

- [ ] **Couchbase Cloud** (free tier) - https://cloud.couchbase.com
- [ ] **OpenAI Platform** (API access) - https://platform.openai.com
- [ ] **GitHub** - https://github.com
- [ ] **Render.com** (free tier) - https://render.com

---

## 🗄️ Step 1: Set Up Couchbase Database (15 minutes)

### 1.1 Create Couchbase Account

1. Go to https://cloud.couchbase.com
2. Click **"Sign Up"** and create a free account
3. Verify your email address

### 1.2 Create a Cluster

1. Click **"Create Cluster"**
2. Select **"Capella Free Tier"**
3. Choose your cloud provider (AWS, Google Cloud, or Azure)
4. Select a region (choose one close to where you'll deploy on Render)
5. Give your cluster a name (e.g., `querymind-cluster`)
6. Click **"Create Cluster"**
7. Wait 5-10 minutes for the cluster to be ready

### 1.3 Create a Bucket

1. Once the cluster is ready, go to **"Data Tools"** → **"Buckets"**
2. Click **"Create Bucket"**
3. Enter bucket name: `vacation-interview-bot`
4. Leave other settings as default
5. Click **"Create"**

### 1.4 Create Database Credentials

1. Go to **"Connect"** tab in your cluster
2. Click **"Database Access"**
3. Click **"Create Database Access"**
4. Fill in:
   - **Username**: Choose a username (e.g., `querymind_admin`)
   - **Password**: Generate a strong password (save this!)
   - **Permissions**: Select **"All Buckets"** with **"Read/Write"**
5. Click **"Create"**

### 1.5 Get Connection String

1. In the **"Connect"** tab, find your connection string
2. It looks like: `couchbases://cb.xxxxx.cloud.couchbase.com`
3. **Copy this string** - you'll need it later

### ✅ What You Should Have Now:
- Connection string (e.g., `couchbases://cb.xxxxx.cloud.couchbase.com`)
- Username (e.g., `querymind_admin`)
- Password (the one you generated)
- Bucket name: `vacation-interview-bot`

---

## 🤖 Step 2: Set Up OpenAI API (10 minutes)

### 2.1 Create OpenAI Account

1. Go to https://platform.openai.com
2. Sign up or log in
3. **Note**: This is separate from ChatGPT subscription

### 2.2 Generate API Key

1. Go to **"API Keys"** section: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Give it a name (e.g., `QueryMind Production`)
4. **Copy the key** (starts with `sk-...`)
5. **IMPORTANT**: Save this key securely - you can only see it once!

### 2.3 Add Billing and Credits

1. Go to **"Settings"** → **"Billing"**
2. Click **"Add payment method"**
3. Add your credit card
4. Add credits (minimum $5 recommended)
5. **Cost estimate**: Each interview costs approximately $0.01-0.05

### ✅ What You Should Have Now:
- OpenAI API key (starts with `sk-...`)
- Billing set up with at least $5 in credits

---

## 📦 Step 3: Push Code to GitHub (5 minutes)

### 3.1 Create GitHub Repository

1. Go to https://github.com
2. Click **"New repository"**
3. Repository name: `querymind` (or your preferred name)
4. Choose **Private** or **Public**
5. **Do NOT** initialize with README (we already have one)
6. Click **"Create repository"**

### 3.2 Push Code

You'll receive the code from me. Once you have it:

```bash
cd /path/to/vacation-interview-bot

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - QueryMind application"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/querymind.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### ✅ What You Should Have Now:
- GitHub repository with all the code

---

## 🚀 Step 4: Deploy to Render.com (20 minutes)

### 4.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended - easier integration)
4. Authorize Render to access your GitHub account

### 4.2 Create Web Service

1. Click **"New +"** in the top right
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - If you don't see it, click **"Configure account"** to grant access
   - Select your `querymind` repository
4. Click **"Connect"**

### 4.3 Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `querymind` (or your preferred name)
- **Region**: Choose same region as your Couchbase cluster if possible
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Environment**: `Node`

**Build & Deploy:**
- **Build Command**: `pnpm install && pnpm run build`
- **Start Command**: `pnpm run start`

**Plan:**
- Select **"Free"** to start (you can upgrade later)

### 4.4 Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
COUCHBASE_CONNECTION_STRING=couchbases://cb.xxxxx.cloud.couchbase.com
COUCHBASE_USERNAME=querymind_admin
COUCHBASE_PASSWORD=your_password_here
COUCHBASE_BUCKET=vacation-interview-bot
NODE_ENV=production
```

**Replace with your actual values from Step 1!**

### 4.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. This takes 5-10 minutes
4. Watch the logs for any errors

### 4.6 Get Your URL

1. Once deployed, you'll see **"Live"** status
2. Your URL will be something like: `https://querymind.onrender.com`
3. Click on it to open your application

### ✅ What You Should Have Now:
- Live application URL
- Application successfully deployed

---

## ⚙️ Step 5: Configure OpenAI API Key (5 minutes)

### 5.1 Log In

1. Open your deployed application URL
2. Click **"Get Started"** or **"Login"**
3. Authenticate using the OAuth provider

### 5.2 Configure API Key

1. You'll be redirected to the dashboard
2. Click **"Settings"** button
3. Enter your OpenAI API key (from Step 2)
4. Click **"Save Configuration"**
5. You should see a success message

### ✅ What You Should Have Now:
- Logged in to your application
- OpenAI API key configured

---

## 🎉 Step 6: Test Your Application (10 minutes)

### 6.1 Create Your First Interview

1. In the dashboard, click **"Create Interview"**
2. Fill in:
   - **Title**: `Product Feedback Survey`
   - **Prompt**: `Interview customers about their experience with our product. Ask about features they use, problems they face, and improvements they'd like to see.`
   - **Questions**: `5` (for testing)
3. Click **"Create Interview"**

### 6.2 Test the Interview

1. Click **"Copy Link"** on your new interview
2. Open the link in an **incognito/private browser window**
3. (Optional) Enter your name and email
4. Click **"Start Interview"**
5. Answer the questions
6. Complete the interview or click **"Complete Early"**

### 6.3 View Responses

1. Go back to the admin dashboard
2. Click **"View Responses"** on your interview
3. You should see your test session
4. Click on it to see the full conversation
5. Check the AI-generated summary

### ✅ Success Indicators:
- ✅ Interview created successfully
- ✅ Interview link works
- ✅ Questions are generated dynamically
- ✅ Responses are saved
- ✅ Summary is generated
- ✅ Real-time updates work

---

## 🔧 Troubleshooting

### Issue: "Couchbase not initialized"

**Solution:**
1. Go to Render dashboard
2. Click on your service
3. Go to **"Environment"** tab
4. Verify all environment variables are set correctly
5. Check for typos in connection string, username, password
6. Click **"Manual Deploy"** → **"Clear build cache & deploy"**

### Issue: "Please configure your OpenAI API key first"

**Solution:**
1. Make sure you've logged into the admin dashboard
2. Click **"Settings"**
3. Enter your OpenAI API key
4. Make sure your OpenAI account has credits

### Issue: Interview link shows "Interview not found"

**Solution:**
1. Check that the interview status is "active" in the dashboard
2. Verify Couchbase connection is working
3. Check Render logs for errors

### Issue: Questions not generating

**Solution:**
1. Check OpenAI API key is configured correctly
2. Verify your OpenAI account has credits
3. Check Render logs for API errors

### Issue: Render service keeps spinning down (Free tier)

**Note:** This is expected behavior on the free tier. The service spins down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds.

**Solution:** Upgrade to paid plan ($7/month) for always-on service.

---

## 💰 Cost Breakdown

### Couchbase Cloud
- **Free Tier**: 50GB storage, 1 cluster
- **Cost**: $0/month
- **Sufficient for**: Thousands of interviews

### Render.com
- **Free Tier**: 750 hours/month, spins down after inactivity
- **Paid Tier**: $7/month, always-on
- **Recommendation**: Start with free, upgrade when needed

### OpenAI API
- **Model**: GPT-4o-mini (most cost-effective)
- **Cost per interview**: $0.01-0.05
- **$5 credit**: ~100-500 interviews
- **$20 credit**: ~400-2000 interviews

### Total Monthly Cost
- **Minimum**: $0 (free tiers + pay-per-use OpenAI)
- **Recommended**: $7 (Render paid) + OpenAI usage
- **Example**: $7 + $20 OpenAI = $27/month for ~400-2000 interviews

---

## 🔐 Security Best Practices

1. **Never commit secrets to Git**
   - API keys should only be in Render environment variables
   - Don't put them in code or `.env` files

2. **Use strong passwords**
   - Couchbase password should be strong and unique
   - Store credentials in a password manager

3. **Limit access**
   - Only give admin access to trusted users
   - Interviewees don't need accounts (they use shareable links)

4. **Regular updates**
   - Keep dependencies updated
   - Monitor for security vulnerabilities

5. **Monitor usage**
   - Check OpenAI usage regularly
   - Set up billing alerts

---

## 📊 Monitoring and Maintenance

### View Logs on Render
1. Go to your service on Render
2. Click **"Logs"** tab
3. See real-time logs
4. Look for errors or warnings

### Check Couchbase Status
1. Go to Couchbase Cloud dashboard
2. Click on your cluster
3. View **"Monitoring"** tab
4. Check query performance and storage usage

### Monitor OpenAI Usage
1. Go to OpenAI platform
2. Click **"Usage"** tab
3. Monitor API calls and costs
4. Set up billing alerts

---

## 🔄 Updating the Application

When you make changes to the code:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Automatic deployment:**
   - Render automatically detects the push
   - Rebuilds and redeploys the application
   - Takes 5-10 minutes

3. **Manual deployment (if needed):**
   - Go to Render dashboard
   - Click **"Manual Deploy"**
   - Select **"Clear build cache & deploy"** if needed

---

## 🎯 Next Steps

After successful deployment:

1. **Customize branding** (optional)
   - Update app title and logo through Render environment variables
   - Modify colors in the code if needed

2. **Create production interviews**
   - Define your actual interview topics
   - Test thoroughly before sharing with real users

3. **Share interview links**
   - Email, SMS, social media, or any channel
   - No login required for interviewees

4. **Monitor and analyze**
   - Watch responses in real-time
   - Review AI-generated summaries
   - Extract insights from structured data

5. **Scale as needed**
   - Upgrade Render plan for always-on service
   - Add more OpenAI credits as usage grows
   - Monitor Couchbase storage

---

## 📞 Support Resources

- **Render.com Docs**: https://render.com/docs
- **Couchbase Docs**: https://docs.couchbase.com
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Application README**: See README.md in the project

---

## ✅ Final Checklist

Before going live with real users:

- [ ] Couchbase cluster is running
- [ ] Database credentials are correct
- [ ] OpenAI API key is configured
- [ ] Application is deployed on Render
- [ ] Test interview completed successfully
- [ ] Real-time updates are working
- [ ] Summary generation is working
- [ ] Billing is set up for OpenAI
- [ ] Environment variables are secured
- [ ] Logs show no errors

---

**Congratulations! 🎉 Your QueryMind application is now live!**

**AI that thinks and asks the right questions**

