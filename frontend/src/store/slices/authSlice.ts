import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface User {
  id: string
  name: string | null
  age: number | null
  username: string | null
  email: string
  gender: string | null
  is_admin: boolean
  created_at: string
}

interface AuthState {
  user: User | null
  access_token: string | null
  loading: boolean
  error: string | null
  signupSuccess: boolean
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  access_token: localStorage.getItem('token'),
  loading: false,
  error: null,
  signupSuccess: false,
}

// -------------------- LOGIN --------------------
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      })
      return response.data
    } catch (error: unknown) {
      console.log('Login error:', error)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.message || 'Login failed'
        return rejectWithValue(message)
      }
      return rejectWithValue('Login failed')
    }
  }
)

// -------------------- SIGNUP --------------------
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    { name, username, email, password, age, gender }: 
    { name: string; email: string; password: string; username: string; age: number; gender: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
        username,
        age,
        gender,
      })
      return response.data // usually { message: "User created successfully" }
    } catch (error: unknown) {
      console.log('Signup error:', error)
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.detail || error.message || 'Signup failed'
        return rejectWithValue(message)
      }
      return rejectWithValue('Signup failed')
    }
  }
)

// -------------------- FETCH USER --------------------
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        return thunkAPI.rejectWithValue("No access token found")
      }

      const response = await axios.get(`${API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Fetched user:', response.data)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user")
      }
      return thunkAPI.rejectWithValue("Failed to fetch user")
    }
  }
)

// -------------------- SLICE --------------------
export const authslice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.access_token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      toast.success('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
    resetSignupSuccess: (state) => {
      state.signupSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.access_token = action.payload.access_token
        state.error = null
        localStorage.setItem('user', JSON.stringify(action.payload.user))
        localStorage.setItem('token', action.payload.access_token)
        toast.success('Logged in successfully')
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Login failed'
        toast.error(state.error)
      })

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true
        state.error = null
        state.signupSuccess = false
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false
        state.error = null
        state.signupSuccess = true
        toast.success('Account created successfully! Please log in.')
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string || 'Signup failed'
        state.signupSuccess = false
        toast.error(state.error)
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout, clearError, resetSignupSuccess } = authslice.actions
export default authslice.reducer
