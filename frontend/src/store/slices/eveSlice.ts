import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface JournalReply {
  message_id: string
  text: string
  audio_path: string
  created_at: string
  session_id: string
}

interface VoiceSession {
  session_id: string
  system_prompt: string
  is_active: boolean
  created_at: string
  greeting_message?: string
  greeting_audio_path?: string
}

interface VoiceTurn {
  user_message_id: string
  eve_message_id: string
  user_text: string
  eve_text: string
  audio_path: string
  user_audio_path: string
  created_at: string
}

interface VoiceEnd {
  session_id: string
  status: string
  summary: string
  notes_journal_id: string
  notes_content: string
}

interface EveState {
  journalReply: JournalReply | null
  session: VoiceSession | null
  turns: VoiceTurn[]
  endSummary: VoiceEnd | null
  loading: boolean
  error: string | null
}

const initialState: EveState = {
  journalReply: null,
  session: null,
  turns: [],
  endSummary: null,
  loading: false,
  error: null
}

//expected response from /api/eve/journal-reply
//audio reply based on journal entry
// { 
//   "message_id": "string",
//   "text": "string",
//   "audio_path": "string",
//   "created_at": "2025-08-27T19:10:59.964Z",
//   "session_id": "string"
// }
export const getJournalReply = createAsyncThunk(
  'journal/getReply',
  async (journal_id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/api/eve/journal-reply`, { journal_id }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Transform audio_path to proper URL if it exists
      const data = response.data
      if (data.audio_path) {
        // Extract filename from the full path and construct proper URL
        const filename = data.audio_path.split(/[/\\]/).pop()
        data.audio_path = `${API_URL}/audio/eve/${filename}`
      }
      
      return data
    } catch (error: unknown) {
      toast.error('Failed to get journal reply')
      return rejectWithValue((error as any).response.data)
    }
  }
)

// Start Voice Session for direct audio
//audio reply based solely on system prompt and direct voice command not for the editor journal
// {
//   "session_id": "string",
//   "system_prompt": "string",
//   "is_active": true,
//   "created_at": "2025-08-27T19:12:43.482Z"
// }
export const startVoiceSession = createAsyncThunk(
  'voice/startSession',
  async (system_prompt: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/api/eve/voice/start`, { system_prompt }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error: unknown) {
      toast.error('Failed to start voice session')
      return rejectWithValue((error as any).response.data)
    }
  }
)

// Voice Turn - send user audio and get eve response
// {
//   "user_message_id": "string",
//   "eve_message_id": "string",
//   "user_text": "string",
//   "eve_text": "string",
//   "audio_path": "string",
//   "user_audio_path": "string",
//   "created_at": "2025-08-27T19:14:28.594Z"
// }
export const voiceTurn = createAsyncThunk(
  'voice/turn',
  async ({session_id, audio}: {session_id: string; audio: File | Blob}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('audio', audio)
      
      const response = await axios.post(`${API_URL}/api/eve/voice/turn/${session_id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Transform audio paths to proper URLs
      const data = response.data
      if (data.audio_path) {
        const filename = data.audio_path.split(/[/\\]/).pop()
        data.audio_path = `${API_URL}/audio/eve/${filename}`
      }
      if (data.user_audio_path) {
        const filename = data.user_audio_path.split(/[/\\]/).pop()
        data.user_audio_path = `${API_URL}/audio/user/${filename}`
      }
      
      return data
    } catch (error: unknown) {
      toast.error('Failed to process voice turn')
      return rejectWithValue((error as any).response.data)
    }
  }
)

// End Voice Session save_summary=true for journal entry
// End Voice Session save_summary=false for direct voice talking
// {
//   "session_id": "string",
//   "status": "string",
//   "summary": "string",
//   "notes_journal_id": "string",
//   "notes_content": "string"
// }
export const voiceEnd = createAsyncThunk(
  'voice/end',
  async ({session_id, save_summary}: {session_id: string; save_summary: boolean}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(`${API_URL}/api/eve/voice/end`, { session_id, save_summary }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error: unknown) {
      toast.error('Failed to end voice session')
      return rejectWithValue((error as any).response.data)
    }
  }
)

export const eveSlice = createSlice({
  name: 'eve',
  initialState,
  reducers: {
    resetEveState: (state) => {
      state.journalReply = null
      state.session = null
      state.turns = []
      state.endSummary = null
      state.error = null
      state.loading = false
    }
  },
  extraReducers: (builder) => {
    // Journal Reply
    builder.addCase(getJournalReply.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getJournalReply.fulfilled, (state, action) => {
      state.loading = false
      state.journalReply = action.payload
    })
    builder.addCase(getJournalReply.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Start Session
    builder.addCase(startVoiceSession.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(startVoiceSession.fulfilled, (state, action) => {
      state.loading = false
      const sessionData = { ...action.payload } // Create a new object to ensure immutability
      
      // console.log("Raw session data from backend:", sessionData);
      
      // Transform greeting audio path if it exists
      if (sessionData.greeting_audio_path) {
        const filename = sessionData.greeting_audio_path.split(/[/\\]/).pop()
        sessionData.greeting_audio_path = `${API_URL}/audio/eve/${filename}`
        // console.log("Transformed greeting audio path:", sessionData.greeting_audio_path);
      }
      
      // Ensure we're creating a new reference for React to detect the change
      state.session = sessionData
      state.error = null // Clear any previous errors
      // console.log("Session set in state:", state.session);
    })
    builder.addCase(startVoiceSession.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Voice Turn
    builder.addCase(voiceTurn.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(voiceTurn.fulfilled, (state, action) => {
      state.loading = false
      state.turns.push(action.payload)
    })
    builder.addCase(voiceTurn.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Voice End
    builder.addCase(voiceEnd.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(voiceEnd.fulfilled, (state, action) => {
      state.loading = false
      state.endSummary = action.payload
    })
    builder.addCase(voiceEnd.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { resetEveState } = eveSlice.actions
export default eveSlice.reducer
