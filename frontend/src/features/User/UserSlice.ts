import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../hooks";

const initialState: User | null = {
    name:'',
    email:'',
    userId:''
  }
export const UserSlice = createSlice({
    name:"userInfo",
    initialState,
    reducers:{
        setUserDetails: (state, action: PayloadAction<User>) => {
            state.email = action.payload.email
            state.name = action.payload.name
            state.userId = action.payload.userId
        },
    }
})

export const {setUserDetails} = UserSlice.actions;

export default UserSlice.reducer;