# RoadGuard AI Deployment Guide

This guide will help you deploy the RoadGuard AI application.
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## Prerequisites
- A GitHub account with the [roadguard-AI](https://github.com/krishhna07/roadguard-AI) repository.
- Accounts on [Vercel](https://vercel.com/) and [Render](https://render.com/).
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

---

## 1. Database (MongoDB Atlas)
1.  Log in to MongoDB Atlas and create a Cluster (free tier is fine).
2.  Create a Database User (Network Access -> Add IP Address -> Allow Access from Anywhere `0.0.0.0/0` for easiest setup, or specifically allow Render IPs).
3.  Get your **Connection String** (UR):
    - Format: `mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?appName=Cluster0`
    - **Keep this safe!** You will need it for the Backend deployment.

---

## 2. Backend Deployment (Render)
1.  Go to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository `roadguard-AI`.
4.  Configure the service:
    - **Name**: `roadguard-backend` (or similar)
    - **Region**: Closest to you (e.g., Singapore, Frankfurt)
    - **Branch**: `main`
    - **Root Directory**: `backend` (Important!)
    - **Runtime**: `Python 3`
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `gunicorn app:app`
5.  **Environment Variables** (Scroll down to "Advanced"):
    - Key: `MONGO_URI`
    - Value: Paste your MongoDB Connection String from Step 1.
    - Key: `PYTHON_VERSION`
    - Value: `3.10.0` (Recommended)
6.  Click **Create Web Service**.
7.  Wait for deployment to finish. Copy the **Service URL** (e.g., `https://roadguard-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import the `roadguard-AI` repository.
4.  Configure the project:
    - **Framework Preset**: Vite (should be auto-detected).
    - **Root Directory**: `./` (Default, leave as is).
    - **Build Command**: `npm run build` (Default).
    - **Output Directory**: `dist` (Default).
5.  **Environment Variables**:
    - Key: `VITE_BACKEND_URL`
    - Value: The **Render Service URL** from Step 2 (no trailing slash, e.g., `https://roadguard-backend.onrender.com`).
6.  Click **Deploy**.

---

## 4. Verification
1.  Open your Vercel App URL.
2.  Try logging in (Default: `user@gmail.com` / `password123`).
3.  Upload an image to test the connection to the backend.

## Troubleshooting
- **Backend Error**: Check Render logs. If it says "Module not found", ensure `requirements.txt` is correct.
- **Network Error**: Ensure `VITE_BACKEND_URL` in Vercel is correct (https, no trailing slash).
- **Database Error**: Ensure MongoDB IP Access List includes `0.0.0.0/0` (Allow Anywhere).
