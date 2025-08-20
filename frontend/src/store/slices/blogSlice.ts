import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import type { RootState } from "../store";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BlogPost {
  title: string;
  content: string;
  tags: string[];
}

export interface initialState {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

const initialState: initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const createBlogPost = createAsyncThunk(
  'blog/createPost',
  async (blogPost: BlogPost, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/blogs`, blogPost);
      toast.success('Blog post created successfully!');
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to create blog post.');
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const listBlogs = createAsyncThunk(
  'blog/listBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs?skip=0&limit=10`);
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to fetch blog posts.');
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const listUserBlogs = createAsyncThunk(
  "blog/listUserBlogs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const username = state.auth.user?.username;

      if (!username) {
        return rejectWithValue("Username not found in auth state");
      }

      const response = await axios.get(`${API_URL}/api/blogs?skip=0&limit=50`, {
        headers: {
          author_name: username, // backend expects this
        },
      });

      return response.data;
    } catch (error: unknown) {
      toast.error("Failed to fetch user blog posts.");
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const getBlogPost = createAsyncThunk(
  'blog/getPost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/blogs/${postId}`);
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to fetch blog post.');
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  'blog/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/blogs/${postId}`);
      toast.success('Blog post deleted successfully!');
      return postId;
    } catch (error: unknown) {
      toast.error('Failed to delete blog post.');
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  'blog/updatePost',
  async ({ postId, blogPost }: { postId: string; blogPost: BlogPost }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/blogs/${postId}`, blogPost);
      toast.success('Blog post updated successfully!');
      return response.data;
    } catch (error: unknown) {
      toast.error('Failed to update blog post.');
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const blogSlice = createSlice(
  {
    name: 'blog',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
      builder
        .addCase(createBlogPost.pending, (state) => {
          state.loading = true;
        })
        .addCase(createBlogPost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts.push(action.payload);
        })
        .addCase(createBlogPost.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to create blog post.';
        })
        .addCase(listBlogs.pending, (state) => {
          state.loading = true;
        })
        .addCase(listBlogs.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload;
        })
        .addCase(listBlogs.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to fetch blog posts.';
        })
        .addCase(getBlogPost.pending, (state) => {
          state.loading = true;
        })
        .addCase(getBlogPost.fulfilled, (state, action) => {
          state.loading = false;
          const post = state.posts.find((p) => p.id === action.payload.id);
          if (post) {
            Object.assign(post, action.payload);
          }
        })
        .addCase(getBlogPost.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to fetch blog post.';
        })
        .addCase(deleteBlogPost.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteBlogPost.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = state.posts.filter((p) => p.id !== action.payload);
        })
        .addCase(deleteBlogPost.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to delete blog post.';
        })
        .addCase(updateBlogPost.pending, (state) => {
          state.loading = true;
        })
        .addCase(updateBlogPost.fulfilled, (state, action) => {
          state.loading = false;
          const post = state.posts.find((p) => p.id === action.payload.id);
          if (post) {
            Object.assign(post, action.payload);
          }
        })
        .addCase(updateBlogPost.rejected, (state, action) => {
          state.loading = false;
          state.error = (action.payload as string) || 'Failed to update blog post.';
        });
    },
  }
);