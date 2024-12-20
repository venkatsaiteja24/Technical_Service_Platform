import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Retrieve token and user from localStorage, if available
const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

// Async action for user signup
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://technical-service-platform.vercel.app/api/auth/signup', userData);
      return response.data; // Return user data on successful signup
    } catch (error) {
      // Return error message or default message if not available
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Async action for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://technical-service-platform.vercel.app/api/auth/login', loginData);
      return response.data; // Return user data on successful login
    } catch (error) {
      // Return error message or default message if not available
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async action for updating user profile
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put('https://technical-service-platform.vercel.app/api/auth/update', userData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data; // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// Create a slice for auth
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser, // Initialize with user from localStorage, if available
    token: savedToken, // Initialize with token from localStorage, if available
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null; // Clear user state
      state.token = null; // Clear token state
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('user'); // Remove user data from localStorage on logout
    },
  },
  extraReducers: (builder) => {
    // Handle signup actions
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true; // Set loading to true
        state.error = null; // Clear any previous errors
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false
        state.user = action.payload.user; // Set user data from response
        state.token = action.payload.token; // Set token from response
        localStorage.setItem('token', action.payload.token); // Store token in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user in localStorage
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false
        state.error = action.payload; // Set error message
      });

    // Handle login actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true; // Set loading to true
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false
        state.user = action.payload.user; // Set user data from response
        state.token = action.payload.token; // Set token from response
        localStorage.setItem('token', action.payload.token); // Store token in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user in localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; // Set loading to false
        state.error = action.payload; // Set error message
      });

    // Handle update user actions
     builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Update the user state with the returned data
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Update user in localStorage
      })
      .addCase(updateUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      });


  },
});

// Export logout action and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
