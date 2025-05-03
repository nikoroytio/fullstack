import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from '../services/users'

export const initializeUsers = createAsyncThunk(
  'users/initialize',
  async () => {
    const users = await userService.getAll()
    return users
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    users: []
  },
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload
    },
    clearUser(state) {
      state.currentUser = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer 