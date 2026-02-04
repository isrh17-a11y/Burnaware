# BurnAware Backend API

FastAPI-based backend for the BurnAware burnout prediction application.

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── routes/                 # API route handlers
│   ├── user_routes.py     # User authentication & management
│   ├── prediction_routes.py  # Burnout prediction endpoints
│   └── chatbot_routes.py  # Chatbot interaction endpoints
├── models/                 # Database models (SQLAlchemy)
│   ├── user.py
│   ├── prediction.py
│   └── chat_history.py
├── schemas/                # Pydantic schemas for validation
│   ├── user.py
│   ├── prediction.py
│   └── chatbot.py
├── services/               # Business logic layer
│   ├── database.py        # Database configuration
│   ├── user_service.py
│   ├── prediction_service.py
│   └── chatbot_service.py
├── ml/                     # Machine learning components
│   ├── predictor.py       # Burnout prediction model
│   └── trainer.py         # Model training script
└── chatbot/                # Chatbot logic
    └── bot.py             # Mental health chatbot
```

## Setup Instructions

1. **Create a virtual environment:**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize the database:**

   ```bash
   python -c "from services.database import init_db; init_db()"
   ```

5. **Run the development server:**

   ```bash
   python main.py
   # Or use uvicorn directly:
   uvicorn main:app --reload
   ```

6. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

### Users

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/users/{user_id}` - Get user by ID

### Predictions

- `POST /api/predictions/` - Create burnout prediction
- `GET /api/predictions/user/{user_id}` - Get user's predictions
- `GET /api/predictions/{prediction_id}` - Get specific prediction

### Chatbot

- `POST /api/chatbot/chat` - Send message to chatbot
- `GET /api/chatbot/history/{user_id}` - Get chat history
- `DELETE /api/chatbot/history/{chat_id}` - Delete chat message

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```

### Type Checking

```bash
mypy .
```

## Next Steps

1. Implement JWT authentication
2. Add comprehensive error handling
3. Create unit and integration tests
4. Train ML model with real data
5. Enhance chatbot with NLP capabilities
6. Add logging and monitoring
7. Set up CI/CD pipeline

## License

MIT
