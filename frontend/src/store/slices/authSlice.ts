import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface User {
  id: number
  name: string
  age: number
  username: string
  email: string
  gender: string
  created_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
}


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/api/login`, {
      email,
      password,
    })
    return response.data
  }
)

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name, age, gender }: { email: string; password: string; name: string; age: number; gender: string }) => {
    const response = await axios.post(`${API_URL}/api/register`, {
      email,
      password,
      name,
      age,
      gender,
    })
    return response.data
  }
)

export const authslice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            toast.success('Logged out successfully')
        },
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
                toast.success('Logged in successfully')
            })
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Login failed'
                toast.error(action.error.message || 'Login failed')
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
                toast.success('Signed up successfully')
            })
            .addCase(signup.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Signup failed'
                toast.error(action.error.message || 'Signup failed')
            })
    }
})

export const { logout, clearError } = authslice.actions
export default authslice.reducer
