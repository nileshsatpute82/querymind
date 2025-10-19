# QueryMind Deployment Instructions

Follow these three steps to deploy your QueryMind application.

---

## 📦 Step 1: Couchbase Setup (15 minutes)

### What is Couchbase?
Couchbase is a NoSQL database that will store all your interview data (interviews, sessions, messages, summaries).

### Setup Steps:

1. **Create Account**
   - Go to: https://cloud.couchbase.com
   - Click "Sign Up" 
   - Use your email to create a free account
   - Verify your email

2. **Create Cluster**
   - Click "Create Cluster"
   - Select "Capella Free Tier" (completely free, no credit card needed)
   - Choose cloud provider: AWS, Google Cloud, or Azure (any is fine)
   - Choose region: Select one close to you (e.g., US East, Europe West, Asia Pacific)
   - Name your cluster: `querymind-cluster`
   - Click "Create Cluster"
   - **Wait 5-10 minutes** for cluster to be ready (you'll see a green checkmark)

3. **Create Bucket** (This is where data is stored)
   - Once cluster is ready, go to "Data Tools" → "Buckets"
   - Click "Create Bucket"
   - Bucket name: `interview-GPT` (keep this exact name)
   - Leave all other settings as default
   - Click "Create"

4. **Create Database Credentials**
   - Go to "Connect" tab in your cluster
   - Click "Database Access"
   - Click "Create Database Access"
   - Fill in:
     - **Username**: `querymind_admin` (or any username you prefer)
     - **Password**: Click "Generate" or create a strong password
     - **IMPORTANT**: Copy and save this password somewhere safe!
   - Under "Permissions":
     - Select "All Buckets"
     - Select "Read/Write"
   - Click "Create"

5. **Get Connection String**
   - Still in the "Connect" tab
   - Look for "Connection String"
   - It looks like: `couchbases://cb.xxxxx.cloud.couchbase.com`
   - **Copy this entire string**

### ✅ What You Need to Save:

Copy these 4 values and save them in a text file:

```
Connection String: couchbases://cb.xxxxx.cloud.couchbase.com
Username: querymind_admin
Password: [your generated password]
Bucket Name: interview-GPT
```

---

## 🐙 Step 2: GitHub Setup (5 minutes)

### What is GitHub?
GitHub stores your code and allows Render.com to automatically deploy updates.

### Setup Steps:

1. **Create GitHub Account** (if you don't have one)
   - Go to: https://github.com
   - Click "Sign up"
   - Follow the registration process

2. **Create New Repository**
   - Click the "+" icon in top right
   - Select "New repository"
   - Fill in:
     - **Repository name**: `querymind`
     - **Description**: "AI-powered interview platform"
     - **Visibility**: Choose "Private" (recommended) or "Public"
     - **DO NOT** check "Initialize this repository with a README"
   - Click "Create repository"

3. **You'll See Instructions** - Don't follow them yet!
   - GitHub will show you commands to push code
   - Keep this page open
   - I'll provide you the code to push in the next step

### ✅ What You Need to Save:

```
Your GitHub Repository URL: https://github.com/YOUR_USERNAME/querymind
```

---

## 🚀 Step 3: Render.com Deployment (20 minutes)

### What is Render.com?
Render.com hosts your application and makes it accessible on the internet.

### Setup Steps:

1. **Create Render Account**
   - Go to: https://render.com
   - Click "Get Started"
   - **Sign up with GitHub** (recommended - makes connection easier)
   - Authorize Render to access your GitHub account

2. **Create Web Service**
   - Click "New +" in top right
   - Select "Web Service"
   - Click "Connect account" if needed
   - Find and select your `querymind` repository
   - Click "Connect"

3. **Configure Service Settings**

   Fill in these fields:

   **Basic Info:**
   - **Name**: `querymind` (this will be part of your URL)
   - **Region**: Choose same region as your Couchbase cluster (e.g., Oregon for US West)
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Environment**: `Node`

   **Build & Deploy:**
   - **Build Command**: 
     ```
     pnpm install && pnpm run build
     ```
   - **Start Command**: 
     ```
     pnpm run start
     ```

   **Instance Type:**
   - Select **"Free"** (you can upgrade later)

4. **Add Environment Variables**

   Click "Advanced" button, then scroll to "Environment Variables"
   
   Add these 4 variables (click "Add Environment Variable" for each):

   ```
   Key: COUCHBASE_CONNECTION_STRING
   Value: [paste your connection string from Step 1]

   Key: COUCHBASE_USERNAME
   Value: [paste your username from Step 1]

   Key: COUCHBASE_PASSWORD
   Value: [paste your password from Step 1]

   Key: COUCHBASE_BUCKET
   Value: interview-GPT

   Key: NODE_ENV
   Value: production
   ```

   **IMPORTANT**: Make sure there are no extra spaces before or after the values!

5. **Deploy**
   - Click "Create Web Service"
   - Render will start building your application
   - This takes 5-10 minutes
   - You'll see logs scrolling - this is normal
   - Wait until you see "Live" status with a green dot

6. **Get Your Application URL**
   - Once deployed, you'll see your URL at the top
   - It looks like: `https://querymind.onrender.com`
   - Click on it to open your application

### ✅ What You'll Have:

```
Your Application URL: https://querymind.onrender.com
```

---

## ⚙️ Step 4: Configure OpenAI API Key (5 minutes)

### What is OpenAI?
OpenAI provides the AI that generates dynamic interview questions.

### Setup Steps:

1. **Create OpenAI Account**
   - Go to: https://platform.openai.com
   - Sign up (this is separate from ChatGPT)
   - Verify your email

2. **Generate API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: `QueryMind Production`
   - Click "Create"
   - **IMPORTANT**: Copy the key immediately (starts with `sk-...`)
   - You can only see it once!
   - Save it somewhere safe

3. **Add Billing**
   - Go to: https://platform.openai.com/settings/organization/billing
   - Click "Add payment method"
   - Add your credit card
   - Click "Add credits"
   - Add at least $5 (recommended $10-20)
   - **Cost**: Each interview costs about $0.01-0.05

4. **Configure in Your Application**
   - Open your deployed application URL
   - Click "Get Started" or "Login"
   - Log in with the OAuth provider
   - You'll be redirected to the dashboard
   - Click "Settings" button
   - Paste your OpenAI API key
   - Click "Save Configuration"
   - You should see "API key saved successfully"

---

## 🎉 Step 5: Test Your Application (10 minutes)

### Create Test Interview:

1. **In Dashboard**
   - Click "Create Interview"
   - Fill in:
     - **Title**: `Product Feedback Test`
     - **Prompt**: `Interview customers about their experience with our product. Ask about features they use, problems they face, and improvements they'd like to see.`
     - **Questions**: Select `5`
   - Click "Create Interview"

2. **Test the Interview**
   - Click "Copy Link" on your new interview
   - Open the link in a **new incognito/private window**
   - Enter a test name (optional)
   - Click "Start Interview"
   - Answer 2-3 questions
   - Click "Complete Early"
   - You should see a summary

3. **View Responses**
   - Go back to your admin dashboard
   - Click "View Responses"
   - You should see your test session
   - Click on it to see the conversation
   - Verify the summary was generated

### ✅ Success! Your application is live!

---

## 📝 Summary of What You Have

After completing all steps, you should have:

1. ✅ Couchbase cluster running with database
2. ✅ GitHub repository with your code
3. ✅ Render.com deployment (live URL)
4. ✅ OpenAI API key configured
5. ✅ Test interview completed successfully

---

## 🆘 Troubleshooting

### "Couchbase not initialized" error

**Problem**: Application can't connect to database

**Solution**:
1. Go to Render.com dashboard
2. Click on your service
3. Go to "Environment" tab
4. Check all 4 Couchbase variables are set correctly
5. Make sure there are no typos or extra spaces
6. Click "Manual Deploy" → "Deploy latest commit"

### "Please configure your OpenAI API key first"

**Problem**: API key not saved

**Solution**:
1. Make sure you're logged into the admin dashboard
2. Click "Settings"
3. Enter your OpenAI API key (starts with `sk-...`)
4. Click "Save"
5. Check your OpenAI account has credits

### Application is slow or not loading

**Problem**: Free tier spins down after 15 minutes of inactivity

**Solution**:
- This is normal on free tier
- First request after spin-down takes 30-60 seconds
- Upgrade to paid plan ($7/month) for always-on service

### Interview link shows "Interview not found"

**Problem**: Interview not created properly

**Solution**:
1. Check Couchbase connection is working (no errors in dashboard)
2. Try creating a new interview
3. Check Render logs for errors (Logs tab)

---

## 💰 Cost Breakdown

### Free Tier (To Start):
- **Couchbase**: $0/month (free tier, 50GB storage)
- **Render.com**: $0/month (free tier, spins down after inactivity)
- **OpenAI**: Pay per use (~$0.01-0.05 per interview)

### Recommended for Production:
- **Couchbase**: $0/month (free tier is sufficient)
- **Render.com**: $7/month (always-on, no spin-down)
- **OpenAI**: $10-20/month (depending on usage)

**Total**: $7-27/month for production use

---

## 🎯 Next Steps

Now that your application is live:

1. **Create real interviews** for your actual use cases
2. **Share interview links** with your target audience
3. **Monitor responses** in real-time
4. **Review AI summaries** for insights
5. **Iterate** on your interview prompts based on results

---

## 📞 Need Help?

If you get stuck:

1. **Check Render Logs**: Render dashboard → Your service → Logs tab
2. **Check Couchbase Status**: Couchbase dashboard → Your cluster → Monitoring
3. **Check OpenAI Usage**: OpenAI platform → Usage tab
4. **Review this guide**: Make sure you followed all steps exactly

---

**Congratulations! 🎉**

**Your QueryMind application is now live and ready to conduct intelligent interviews!**

**AI that thinks and asks the right questions** 🧠✨

