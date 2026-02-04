# Testing the BurnAware Integration

## Quick Test Guide

### 1. **Start Both Servers**

**Backend** (should already be running):

```bash
cd /Users/israahhanfa/burnaware/backend
source venv/bin/activate
python main.py
# Running on http://localhost:8000
```

**Frontend** (should already be running):

```bash
cd /Users/israahhanfa/burnaware/frontend
npm run dev
# Running on http://localhost:3000
```

### 2. **Test the Flow**

1. **Open the app**: http://localhost:3000
2. **Register/Login**: Use any email (e.g., `test@example.com`) and password
3. **Take Assessment**:
   - Navigate to assessment page
   - Fill out the 6-question form
   - Submit the assessment
4. **View Dashboard**:
   - You should see the real burnout score from the backend
   - The score card will display the calculated risk level
   - Check browser console for API response logs

### 3. **What to Check**

✅ Assessment form submits successfully  
✅ Dashboard displays the burnout score from backend  
✅ Risk level is color-coded correctly  
✅ No console errors

### 4. **API Endpoint Being Used**

```
POST http://localhost:8000/api/predictions?user_id={userId}
```

**Request Body:**

```json
{
  "work_hours_per_week": 56,
  "sleep_hours_per_day": 7,
  "stress_level": 6,
  "job_satisfaction": 4,
  "work_life_balance": 5,
  "physical_activity_hours": 3,
  "social_support": 8
}
```

**Response:**

```json
{
  "id": 1,
  "user_id": 1,
  "burnout_score": 45.5,
  "risk_level": "medium",
  "recommendations": ["Take breaks", "Exercise more"],
  "created_at": "2026-02-02T22:51:00"
}
```

## Troubleshooting

If you encounter errors:

1. **CORS Error**: Make sure backend allows `http://localhost:3000`
2. **404 Error**: Check that backend routes are properly registered
3. **User ID Error**: The app creates a mock user with ID from localStorage

## Notes

- The frontend transforms daily work hours to weekly (multiplies by 7)
- Job satisfaction is calculated as inverse of stress level
- User authentication is simplified (no JWT tokens yet)
