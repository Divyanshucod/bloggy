import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import axios from "axios";
import { BACKED_URL_LOCAL } from "../../config";

export interface commentType {
        id: string,
        comment: string,
        createdAt: string,
        commentor: string,
        reactionsCnt: { like:number, dislike:number },
        currentUserReactions: string
}
interface CommentState {
    comment:string,
    comments:commentType[] ,
    pageNo:number,
    isLoading:"idle" | "pending" | "succeeded",
    isCreatingComment:"idle" | "pending" | "succeeded",
}
const initialState:CommentState = {
    comment:'',
    comments:[],
    pageNo:1,
    isLoading:"idle",
    isCreatingComment:'idle'
} 
export const fetchComments = createAsyncThunk('comment/fetchComments',async ({blogId}:{blogId: string}, thunkAPI)=>{
    const state = thunkAPI.getState() as RootState;
    try {
        const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/blog/comments/${blogId}/${state.CommentSlice.pageNo-1}`,{withCredentials:true})
        return response.data.comments;
    } catch (err:any) {
        return thunkAPI.rejectWithValue(
            err?.response?.data?.message || "Something went wrong"
          );
    }

})
export const createComment = createAsyncThunk('comment/createComment',async ({blogId}:{blogId:string}, thunkAPI)=>{
    const state = thunkAPI.getState() as RootState;
    try {
        const response = await axios.post(`${BACKED_URL_LOCAL}api/v1/blog/comment`,{postId:blogId,comment:state.CommentSlice.comment},{withCredentials:true})
        return response.data.message;
    } catch (err:any) {
        return thunkAPI.rejectWithValue(
            err?.response?.data?.message || "Something went wrong"
          );
    }

})
export const CommentSlice = createSlice({
    name:"comment",
    initialState,
    reducers:{
        setComment: (state,action)=> {
            state.comment = action.payload
        },
        setCustomPage: (state,action) => {
            state.pageNo = action.payload
        },
        setIncrementPage: (state) => {
            state.pageNo = state.pageNo+1;
        },
        setDecrementPage: (state) => {
            state.pageNo = state.pageNo-1;
        }
    },
    extraReducers:(builder) => {
        builder.addCase(fetchComments.fulfilled,(state,action)=>{
            state.comments = action.payload;
            state.isLoading = "succeeded";
        })
        builder.addCase(createComment.fulfilled,(state)=>{
            state.comment = ''
            state.isCreatingComment= "succeeded";
        })
        builder.addCase(fetchComments.pending,(state)=>{
            state.isLoading = 'pending'
        })
        builder.addCase(createComment.pending,(state)=>{
            state.isCreatingComment = 'pending'
        })
        builder.addCase(fetchComments.rejected,(state)=>{
            state.isLoading = 'idle';
        })
        builder.addCase(createComment.rejected,(state)=>{
            state.isCreatingComment = 'idle';
        })
    }
})

export const {setComment,setCustomPage,setDecrementPage,setIncrementPage} = CommentSlice.actions

export default CommentSlice.reducer;