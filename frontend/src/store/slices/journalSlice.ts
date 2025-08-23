import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface JournalEntry {
  title: string;
  content: string;
  tags: string[];
  entryDate?: string;
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  author_name?: string;
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  entries: [],
  loading: false,
  error: null
};

// =================== ASYNC THUNKS =================== //

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entry: JournalEntry, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) return rejectWithValue("No access token found");

      const response = await axios.post(
        `${API_URL}/api/journals`,
        { ...entry, entryDate: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      toast.success('Journal entry created successfully!');
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to create journal entry.');
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getJournal = createAsyncThunk(
  'journal/getEntry',
  async (journal_id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/journals/${journal_id}`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateJournal = createAsyncThunk(
  'journal/updateEntry',
  async ({ journal_id, entry }: { journal_id: string; entry: JournalEntry }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("No access token found");

      const response = await axios.put(
        `${API_URL}/api/journals/${journal_id}`,
        { ...entry, entryDate: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      toast.success('Journal entry updated successfully!');
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to update journal entry.');
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteJournal = createAsyncThunk(
  'journal/deleteEntry',
  async (journal_id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("No access token found");

      const response = await axios.delete(`${API_URL}/api/journals/${journal_id}`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      toast.success('Journal entry deleted successfully!');
      return { journal_id }; // return ID so we can remove it from state
    } catch (error: unknown) {
      toast.error('Failed to delete journal entry.');
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const listJournals = createAsyncThunk(
  'journal/listEntries',
  async (
    { skip = 0, limit = 10, q = '' }: { skip?: number; limit?: number; q?: string } = {}, // <-- default {}
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API_URL}/api/journals`, {
        params: { skip, limit, q },
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue('An unknown error occurred');
    }
  }
);


// =================== SLICE =================== //

export const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.entries.push(action.payload);
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET
      .addCase(getJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournal.fulfilled, (state, action) => {
        state.loading = false;
        // optional: replace or add entry
        const index = state.entries.findIndex(e => e.title === action.payload.title);
        if (index >= 0) state.entries[index] = action.payload;
        else state.entries.push(action.payload);
      })
      .addCase(getJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updateJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index >= 0) state.entries[index] = action.payload;
      })
      .addCase(updateJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // DELETE
      .addCase(deleteJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = state.entries.filter(e => e.id !== action.payload.journal_id);
      })
      .addCase(deleteJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LIST
      .addCase(listJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(listJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetError } = journalSlice.actions;
export default journalSlice.reducer;
