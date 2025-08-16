# HearU API Testing with Bruno

This Bruno collection contains comprehensive tests for the HearU API endpoints.

## Setup

1. **Start the HearU Backend Server**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

2. **Open Bruno**
   - Open Bruno application
   - Import this collection (`HearU_api` folder)
   - Select the "Local" environment

3. **Environment Variables**
   The collection uses the following variables (configured in `environments/Local.bru`):
   - `baseUrl`: http://localhost:8000
   - `authToken`: (automatically set during login)
   - `userId`: (automatically set during registration)
   - `sessionId`: (automatically set during session creation)

## Test Execution Order

### Authentication Flow
1. **Create Default Admin** - Creates the default admin user
2. **Register User** - Registers a new test user
3. **Login User** - Logs in and stores the auth token
4. **Get Me** - Retrieves current user profile
5. **List Users (Admin)** - Lists users (may fail if not admin)
6. **Logout User** - Logs out the current user

### Chat Flow
1. **Create Session** - Creates a new chat session
2. **Send Message** - Sends a message and gets AI response
3. **Get Session History** - Retrieves chat history
4. **Agent Chat** - Uses the agent endpoint (creates session if needed)
5. **Agent Chat Existing Session** - Uses agent endpoint with existing session
6. **Delete Session** - Deletes the chat session

### Error Cases
- **Auth Error Cases** - Tests invalid login credentials
- **Unauthorized Access** - Tests access without authentication
- **Chat Error Cases** - Tests non-existent session access

## API Endpoints Covered

### Health
- `GET /` - Health check

### Authentication (`/api`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `GET /admin/users` - List users (admin only)
- `POST /setup/create-default-admin` - Create default admin

### Chat (`/api/chat`)
- `POST /session` - Create chat session
- `GET /{session_id}` - Get chat history
- `POST /{session_id}/message` - Send message
- `DELETE /{session_id}` - Delete session
- `POST /agent` - Agent chat endpoint

## Running Tests

1. **Manual Execution**: Click on individual requests or folders to run them
2. **Collection Runner**: Use Bruno's collection runner to execute all tests in sequence
3. **Environment**: Make sure "Local" environment is selected

## Notes

- Tests automatically store authentication tokens and IDs for chained requests
- Some tests may fail if the backend is not running or database is not initialized
- Admin-only endpoints may return 403 if the test user is not an admin
- Chat tests require the Gemini API key to be properly configured in the backend

## Troubleshooting

- **401 Unauthorized**: Make sure to run the login test first to set the auth token
- **404 Not Found**: Ensure the backend server is running on port 8000
- **500 Internal Server Error**: Check backend logs for database or API key issues
