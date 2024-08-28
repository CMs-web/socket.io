import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
      isAuthenticated: false,
      response: null,
      userin  : false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginuser.fulfilled, (state, action) => {
          state.isAuthenticated = true;
          state.response = action.payload;
          state.userin = true
      })
      .addCase(loginuser.rejected, (state) => {
          state.isAuthenticated = false;
          state.userin = false;
      })
      .addCase(registeruser.fulfilled, (state,action) => {
          state.isAuthenticated = true;
          state.response = action.payload
          state.userin = true;
      })
      .addCase(registeruser.rejected, (state) => {
          state.isAuthenticated = false;
          state.userin = false;
      });
  },
});

export const loginuser = createAsyncThunk(
  "LOGIN/USER",
  async ({email, password}, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      //    setIsAuthenticated(true);
      //    socket.auth.token = res.data.token;
        //    socket.connect();
        console.log(res.data.token)
      return res.data.token;
    } catch (err) {
      console.error(
        "Login failed",
        err.response ? err.response.data : err.message
      );
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

export const registeruser = createAsyncThunk(
  "register/USER",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
        // Return the response data so it can be stored in the Redux state if necessary
        console.log(res.data.token)
      return res.data.token;
    } catch (err) {
      console.error(
        "Registration failed",
        err.response ? err.response.data : err.message
      );
      // Use rejectWithValue to return the error in a rejected action
      return rejectWithValue(err.response ? err.response.data : err.message);
    }
  }
);

export default userSlice.reducer;
