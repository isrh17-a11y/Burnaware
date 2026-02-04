## ✅ Backend API Integration Complete!

I've successfully integrated axios to connect your frontend with the backend API:

### Changes Made:

1. **Installed axios** for HTTP requests
2. **Updated API Client** ([lib/api.ts](file:///Users/israahhanfa/burnaware/frontend/lib/api.ts)):
   - Replaced fetch with axios
   - Added data transformation to match backend schema
   - Converts daily work hours → weekly hours
   - Maps frontend fields to backend fields

3. **Updated Assessment Form** ([app/assessment/page.tsx](file:///Users/israahhanfa/burnaware/frontend/app/assessment/page.tsx)):
   - Gets user ID from localStorage
   - Passes user ID to API call
   - Improved error handling with console logs

4. **Updated Dashboard** ([app/dashboard/page.tsx](file:///Users/israahhanfa/burnaware/frontend/app/dashboard/page.tsx)):
   - Loads real burnout score from API response
   - Displays risk level from backend
   - Added error handling for data parsing

### How It Works:

**Assessment Form → Backend:**

```
POST http://localhost:8000/api/predictions?user_id={userId}
```

**Data Transformation:**

- `work_hours` (daily) → `work_hours_per_week` (×7)
- `sleep_hours` → `sleep_hours_per_day`
- `stress_level` → `stress_level`
- `stress_level` → `job_satisfaction` (inverse: 10 - stress)
- `work_life_balance` → `work_life_balance`
- `physical_activity` → `physical_activity_hours`
- `social_support` → `social_support`

**Backend Response:**

```json
{
  "burnout_score": 45.5,
  "risk_level": "medium",
  "recommendations": ["..."],
  "created_at": "2026-02-02T..."
}
```

### Test It Now:

1. Go to http://localhost:3000
2. Login/Register with any email
3. Take the assessment
4. See your **real burnout score** on the dashboard! 🎉

The score is now calculated by your backend ML model and displayed on the dashboard with proper color coding and risk levels.
