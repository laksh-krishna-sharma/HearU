# Voice Session Response API

This document describes the new FastAPI endpoints for storing and retrieving response data from the `/api/eve/voice/end` endpoint.

## Overview

The Voice Session Response API allows users to:
- **CREATE**: Store response data from voice session end operations
- **READ**: Retrieve stored voice session response data
- **UPDATE**: Modify existing voice session response records
- **DELETE**: Remove voice session response records

## Database Schema

The API uses a new table `voice_session_responses` with the following structure:

```sql
CREATE TABLE voice_session_responses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    summary TEXT,
    notes_journal_id VARCHAR(36),
    notes_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## API Endpoints

### Base URL: `/api/voice-session-responses`

All endpoints require authentication via Bearer token.

### 1. Create Voice Session Response
**POST** `/api/voice-session-responses/`

Creates a new voice session response record.

**Request Body:**
```json
{
    "session_id": "string",
    "status": "string",
    "summary": "string (optional)",
    "notes_journal_id": "string (optional)",
    "notes_content": "string (optional)"
}
```

**Response:**
```json
{
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "string",
    "status": "string",
    "summary": "string",
    "notes_journal_id": "string",
    "notes_content": "string",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": null
}
```

### 2. List All Voice Session Responses
**GET** `/api/voice-session-responses/`

Retrieves all voice session responses for the authenticated user.

**Response:**
```json
{
    "responses": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "session_id": "string",
            "status": "string",
            "summary": "string",
            "notes_journal_id": "string",
            "notes_content": "string",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": null
        }
    ]
}
```

### 3. Get Specific Voice Session Response
**GET** `/api/voice-session-responses/{response_id}`

Retrieves a specific voice session response by ID.

**Response:**
```json
{
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "string",
    "status": "string",
    "summary": "string",
    "notes_journal_id": "string",
    "notes_content": "string",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": null
}
```

### 4. Get Voice Session Responses by Session ID
**GET** `/api/voice-session-responses/session/{session_id}`

Retrieves all voice session responses for a specific session.

**Response:**
```json
{
    "responses": [
        {
            "id": "uuid",
            "user_id": "uuid",
            "session_id": "string",
            "status": "string",
            "summary": "string",
            "notes_journal_id": "string",
            "notes_content": "string",
            "created_at": "2024-01-01T12:00:00Z",
            "updated_at": null
        }
    ]
}
```

### 5. Update Voice Session Response
**PUT** `/api/voice-session-responses/{response_id}`

Updates an existing voice session response.

**Request Body:**
```json
{
    "status": "string (optional)",
    "summary": "string (optional)",
    "notes_journal_id": "string (optional)",
    "notes_content": "string (optional)"
}
```

**Response:**
```json
{
    "id": "uuid",
    "user_id": "uuid",
    "session_id": "string",
    "status": "string",
    "summary": "string",
    "notes_journal_id": "string",
    "notes_content": "string",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:30:00Z"
}
```

### 6. Delete Voice Session Response
**DELETE** `/api/voice-session-responses/{response_id}`

Deletes a voice session response.

**Response:**
```json
{
    "status": "deleted"
}
```

## Usage Example

Here's how to use the API to store data from `/api/eve/voice/end`:

### Step 1: End a Voice Session
```python
# Call the existing endpoint
response = await client.post("/api/eve/voice/end", json={
    "session_id": "session-123",
    "save_summary": True
})

voice_end_data = response.json()
# Returns: {
#     "session_id": "session-123",
#     "status": "ended",
#     "summary": "Session summary...",
#     "notes_journal_id": "journal-456",
#     "notes_content": "1. Note one\n2. Note two"
# }
```

### Step 2: Store the Response Data
```python
# Store the response data using the new API
store_response = await client.post("/api/voice-session-responses/", json={
    "session_id": voice_end_data["session_id"],
    "status": voice_end_data["status"],
    "summary": voice_end_data["summary"],
    "notes_journal_id": voice_end_data["notes_journal_id"],
    "notes_content": voice_end_data["notes_content"]
})

stored_data = store_response.json()
print(f"Stored with ID: {stored_data['id']}")
```

### Step 3: Retrieve Stored Data
```python
# Get all stored responses
all_responses = await client.get("/api/voice-session-responses/")

# Get specific response
specific_response = await client.get(f"/api/voice-session-responses/{stored_data['id']}")

# Get responses for a specific session
session_responses = await client.get(f"/api/voice-session-responses/session/session-123")
```

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

- **401 Unauthorized**: Invalid or missing authentication token
- **404 Not Found**: Voice session response not found
- **422 Unprocessable Entity**: Invalid request data

## Files Created

The following files were created to implement this API:

1. **Models:**
   - `app/models/voice_session_response.py` - Database model

2. **Schemas:**
   - `app/routes/voice_session_response/schema/voice_session_response.py` - Request/response schemas

3. **Services:**
   - `app/services/voice_session_response/voice_session_response.py` - Business logic

4. **Routes:**
   - `app/routes/voice_session_response/voice_session_response.py` - API endpoints

5. **Updated Files:**
   - `app/main.py` - Added router registration
   - `app/models/__init__.py` - Added model import

## Testing

A test script is provided at `tmp_rovodev_test_voice_session_api.py` that demonstrates all API functionality.

To run the test:
1. Start the FastAPI server: `uvicorn app.main:app --reload`
2. Run the test script: `python tmp_rovodev_test_voice_session_api.py`

## Database Migration

After implementing these changes, run the database migration to create the new table:

```python
# The table will be automatically created when the app starts
# due to the init_models() call in the lifespan function
```

Or manually create the table if needed:

```sql
CREATE TABLE voice_session_responses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    session_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    summary TEXT,
    notes_journal_id VARCHAR(36),
    notes_content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX ix_voice_session_responses_user_id ON voice_session_responses(user_id);
CREATE INDEX ix_voice_session_responses_session_id ON voice_session_responses(session_id);
```