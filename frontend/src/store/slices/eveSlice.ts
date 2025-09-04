import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// --- INTERFACES ---

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

// FIX: Updated interface to match the full API response object.
export interface VoiceSessionResponse {
  id: string;
  user_id: string;
  session_id: string;
  status: string;
  summary: string;
  notes_journal_id: string | null; // Can be null if not linked
  notes_content: string;
  created_at: string;
  updated_at: string;
}

interface EveState {
  journalReply: JournalReply | null
  session: VoiceSession | null
  turns: VoiceTurn[]
  endSummary: VoiceEnd | null
  voiceSessionResponses: VoiceSessionResponse[]
  // Add separate state to track if we're in journal reply mode vs voice session mode
  isJournalReplyMode: boolean
  loading: boolean
  error: string | null
}

const initialState: EveState = {
  journalReply: null,
  session: null,
  turns: [],
  endSummary: null,
  voiceSessionResponses: [],
  isJournalReplyMode: false,
  loading: false,
  error: null
}

// --- ASYNC THUNKS (Unchanged) ---

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
      
      const data = response.data
      if (data.audio_path) {
        const filename = data.audio_path.split(/[/\\]/).pop()
        data.audio_path = `${API_URL}/audio/eve/${filename}`
      }
      
      return data
    } catch (error: unknown) {
      toast.error('Failed to get journal reply')
      return rejectWithValue((error as { response: { data: unknown } }).response.data)
    }
  }
)

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
      return rejectWithValue((error as { response: { data: unknown } }).response.data)
    }
  }
)

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
      return rejectWithValue((error as { response: { data: unknown } }).response.data)
    }
  }
)

export const voiceEnd = createAsyncThunk(
  'voice/end',
  async ({session_id, save_summary, journal_id}: {session_id: string; save_summary: boolean; journal_id?: string}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const payload: { session_id: string; save_summary: boolean; journal_id?: string } = { session_id, save_summary };
      if (journal_id) {
        payload.journal_id = journal_id;
      }
      
      const response = await axios.post(`${API_URL}/api/eve/voice/end`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error: unknown) {
      toast.error('Failed to end voice session')
      return rejectWithValue((error as { response: { data: unknown } }).response.data)
    }
  }
)

export const getVoiceSessionResponsesUsingJournalId = createAsyncThunk(
  'voice/getSessionResponses',
  async (journalId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/voice-session-responses/journal/${journalId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Handle both single response and array responses
      const data = response.data;
      return Array.isArray(data) ? data : [data];
    } catch (error: unknown) {
      // Don't show error toast if it's just a 404 (no responses found)
      if ((error as { response?: { status: number } })?.response?.status !== 404) {
        toast.error('Failed to get voice session responses')
      }
      return rejectWithValue((error as { response?: { data: unknown } }).response?.data || 'Failed to fetch responses')
    }
  }
)

export const deleteVoiceSessionResponse = createAsyncThunk(
  'voice/deleteSessionResponse',
  async (session_id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/voice-session-responses/${session_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // No explicit return, so payload will be undefined on success
    } catch (error: unknown) {
      toast.error('Failed to delete voice session response')
      return rejectWithValue((error as { response: { data: unknown } }).response.data)
    }
  }
)


// --- SLICE ---

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
      state.voiceSessionResponses = []
      state.isJournalReplyMode = false
    },
    clearJournalReply: (state) => {
      state.journalReply = null
      state.isJournalReplyMode = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
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
      state.isJournalReplyMode = true
      // COMPLETELY CLEAR voice session when getting journal reply - NO INTERFERENCE
      state.session = null
      state.turns = []
      state.endSummary = null
      state.error = null
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
      const sessionData = { ...action.payload }
      
      if (sessionData.greeting_audio_path) {
        const filename = sessionData.greeting_audio_path.split(/[/\\]/).pop()
        sessionData.greeting_audio_path = `${API_URL}/audio/eve/${filename}`
      }
      
      state.session = sessionData
      state.error = null
      state.isJournalReplyMode = false
      // Clear any existing journal reply when starting voice session
      state.journalReply = null
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
      // Clear session when voice session ends
      state.session = null
      state.turns = []
    })
    builder.addCase(voiceEnd.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Get Session Responses
    builder.addCase(getVoiceSessionResponsesUsingJournalId.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(getVoiceSessionResponsesUsingJournalId.fulfilled, (state, action) => {
      state.loading = false
      // FIX 4: Correctly assign the payload to the new state property.
      state.voiceSessionResponses = action.payload
    })
    builder.addCase(getVoiceSessionResponsesUsingJournalId.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Delete Session Response
    builder.addCase(deleteVoiceSessionResponse.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteVoiceSessionResponse.fulfilled, (state, action) => {
      state.loading = false
      // FIX 5: Use `action.meta.arg` to get the session_id passed to the thunk.
      // `action.payload` is undefined because the thunk doesn't return anything.
      const deletedSessionId = action.meta.arg;
      state.voiceSessionResponses = state.voiceSessionResponses.filter(
        response => response.session_id !== deletedSessionId
      )
    })
    builder.addCase(deleteVoiceSessionResponse.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  }
})

export const { resetEveState, clearJournalReply, clearError } = eveSlice.actions
export default eveSlice.reducer