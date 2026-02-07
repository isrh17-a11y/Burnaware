# Render Cold Start Fix - Implementation Guide

## Problem

Render's free tier spins down your backend after 15 minutes of inactivity, causing **30-60 second cold starts** when the first request comes in, leading to timeout errors.

## Solutions Implemented

### ✅ Solution 1: Extended API Timeout (DONE)

**File Updated**: [`frontend/lib/api.ts`](file:///Users/israahhanfa/burnaware/frontend/lib/api.ts)

**Changes Made**:

- Increased axios timeout from default (no limit) to **90 seconds**
- This allows the frontend to wait for Render to wake up
- Handles cold starts gracefully without throwing timeout errors

```typescript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds
  // ...
});
```

**Impact**:

- ✅ First request after sleep will work (takes 30-60s)
- ✅ Subsequent requests are fast (backend stays awake for 15 min)
- ✅ No code changes needed after deployment

---

### ✅ Solution 2: Keep-Alive Service (Optional but Recommended)

Use a **free external service** to ping your backend every 10-14 minutes to keep it awake 24/7.

## 🚀 Setup Keep-Alive (Choose One Service)

### Option A: UptimeRobot (Recommended) ⭐

**Free Tier**: 50 monitors, 5-minute intervals

**Steps**:

1. Go to https://uptimerobot.com and sign up (free)
2. Click **+ Add New Monitor**
3. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: BurnAware Backend
   - **URL**: `https://burnaware.onrender.com/health-check`
   - **Monitoring Interval**: 5 minutes
4. Click **Create Monitor**
5. Done! ✅

**Result**: Your backend will be pinged every 5 minutes, keeping it awake forever.

---

### Option B: Cron-Job.org

**Free Tier**: Unlimited jobs, 1-minute minimum interval

**Steps**:

1. Go to https://cron-job.org and sign up (free)
2. Click **Create cronjob**
3. Configure:
   - **Title**: Keep BurnAware Awake
   - **Address**: `https://burnaware.onrender.com/health-check`
   - **Schedule**: Every 10 minutes
4. Save
5. Done! ✅

---

### Option C: GitHub Actions (For Developers)

**Free Tier**: 2,000 minutes/month (more than enough)

**Steps**:

1. Create `.github/workflows/keep-alive.yml` in your repo:

```yaml
name: Keep Backend Awake

on:
  schedule:
    - cron: "*/10 * * * *" # Every 10 minutes
  workflow_dispatch: # Allow manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: |
          curl -f https://burnaware.onrender.com/health-check || echo "Ping failed"
```

2. Commit and push
3. GitHub will automatically ping your backend every 10 minutes
4. Done! ✅

---

## 📊 Comparison

| Service            | Interval | Setup Time | Reliability |
| ------------------ | -------- | ---------- | ----------- |
| **UptimeRobot** ⭐ | 5 min    | 2 min      | ⭐⭐⭐⭐⭐  |
| **Cron-Job.org**   | 1 min    | 2 min      | ⭐⭐⭐⭐    |
| **GitHub Actions** | Custom   | 5 min      | ⭐⭐⭐⭐⭐  |

**Recommendation**: Use **UptimeRobot** - simplest and most reliable.

---

## How to Test

### Test Cold Start Timeout Fix:

1. **Wait for backend to sleep** (15 minutes of inactivity)
2. **Try to register/login** on your Vercel frontend
3. **Expected behavior**:
   - Request takes 30-60 seconds (you'll see loading indicator)
   - Then succeeds! ✅
4. **Previous behavior**: Timeout error after a few seconds ❌

### Verify Keep-Alive is Working:

1. Check your keep-alive service dashboard
2. Look for successful pings every 5-10 minutes
3. Your Render logs should show health check requests
4. Backend should never sleep again! 🎉

---

## Monitoring Your Backend

### Check if Backend is Awake:

```bash
curl https://burnaware.onrender.com/health-check
```

**If awake**: Responds in \u003c1 second with `{"status":"healthy","message":"Service is running"}`

**If sleeping**: Takes 30-60 seconds, then responds

---

## Cost Analysis

| Solution                 | Cost  | Pros             | Cons                      |
| ------------------------ | ----- | ---------------- | ------------------------- |
| **Extended Timeout**     | Free  | Simple, no setup | First request slow        |
| **Keep-Alive + Timeout** | Free  | Always fast      | Requires external service |
| **Render Paid Tier**     | $7/mo | No cold starts   | Costs money               |
| **Migrate to Fly.io**    | Free  | No cold starts   | Migration effort          |

---

## What Was Done

✅ Extended API timeout to 90 seconds  
✅ Created this implementation guide  
✅ Documented 3 free keep-alive options

## Next Steps for You

1. **Deploy the timeout fix**: Commit and push (I'll help)
2. **Set up UptimeRobot**: Takes 2 minutes (optional but recommended)
3. **Test**: Try registering after backend sleeps

---

## Files Modified

- [`frontend/lib/api.ts`](file:///Users/israahhanfa/burnaware/frontend/lib/api.ts) - Added 90s timeout

## Recommended Action

**Set up UptimeRobot now (2 minutes)**: https://uptimerobot.com

This will keep your backend awake 24/7 for free, giving your users instant response times! 🚀
