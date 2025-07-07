import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKED_URL_LOCAL } from "../../config";

 interface User {
  id: string;
  name: string;
  email: string;
}
type userP = User | null;
interface userProps {
  user:userP,
  isloading:'idle'|'pending'|'success'|'fail'
  hasData:boolean
}
const initialState = {
  user:null,
  isloading:'idle',
  hasData:false
} satisfies userProps as userProps;
export const fetchMe = createAsyncThunk('user/fetchme',async ()=>{
  const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/me`,{withCredentials:true});
  const userData = (response.data.userDetails as User);
  return userData;
})

export const UserSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    clearUserDetails: (state) => {
      state.user = null
      state.isloading = 'idle'
      state.hasData=false
    },
  },
  extraReducers:(builder)=>{
      builder.addCase(fetchMe.fulfilled,(state,action)=>{
        state.user = action.payload
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        state.hasData = true,
        state.isloading = 'success'
      })
      builder.addCase(fetchMe.pending,(state,)=>{
        state.isloading = 'pending'
      })
      builder.addCase(fetchMe.rejected,(state,)=>{
        state.isloading = 'fail'
      })
  }
});

export const { clearUserDetails } = UserSlice.actions;

export default UserSlice.reducer;