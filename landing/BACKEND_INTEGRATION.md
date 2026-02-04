# Backend Integration Testing Guide

## Quick Test

The landing page is now connected to the backend API. Here's how to test:

### 1. Ensure Backend is Running

The backend should auto-reload with the CORS changes. If not, restart it:

```bash
cd /Users/israahhanfa/burnaware/backend
source venv/bin/activate
python main.py
```

### 2. Test Registration

1. Open http://localhost:5173
2. Click "Get Started" button
3. Click "Sign up free" to switch to registration mode
4. Fill in the form:
   - Email: test@example.com
   - Username: testuser (min 3 characters)
   - Password: password123 (min 8 characters)
   - Full Name: Test User (optional)
5. Click "Create Account"
6. You should see a green success message

### 3. Test Login

1. After successful registration, the form switches to login mode
2. Enter your credentials
3. Click "Sign In"
4. On success, you'll be redirected to `/dashboard`

## Changes Made

1. **API Client** (`/landing/src/api.js`):
   - Fixed API base URL: `http://localhost:8000/api` (removed `/v1`)
   - Added registration and login functions
   - Includes localStorage utilities for user data

2. **Backend CORS** (`/backend/main.py`):
   - Added `http://localhost:5173` to allowed origins
   - Now accepts requests from both frontend (3000) and landing page (5173)

3. **LoginDrawer** (`/landing/src/components/LoginDrawer.jsx`):
   - Toggle between login and registration modes
   - Real API integration
   - Error and success message display
   - Form validation

## Troubleshooting

- **404 Error**: Make sure backend is running on port 8000
- **CORS Error**: Backend needs to be restarted to pick up CORS changes
- **500 Error**: Check backend logs for database or validation errors
