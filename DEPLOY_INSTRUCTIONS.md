# Deployment Instructions

Since the GitHub CLI (`gh`) is not installed, please follow these manual steps to connect your local project to GitHub.

## 1. Create the Repository
1. Log in to [GitHub.com](https://github.com).
2. Click the **+** icon in the top right and select **New repository**.
3. Name the repository: `edagent-visualizer`.
4. Click **Create repository**.

## 2. Push Your Code
Copy the commands from the section **"…or push an existing repository from the command line"** shown on the GitHub page. They will look like this (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/edagent-visualizer.git
git branch -M main
git push -u origin main
```

Run these commands in your terminal.

## 3. Deploy to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. You should see your new `edagent-visualizer` repository in the list (Import from GitHub).
4. Click **Import** and then **Deploy**.
