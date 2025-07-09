import { createSlice } from "@reduxjs/toolkit";

export const PreviewSlice = createSlice({
    name:"theme",
    initialState:{
        value:true,
        isForUpdateBlog:true,
    },
    reducers:{
        setPreview: (state,action)=> {
            state.value = action.payload
            state.isForUpdateBlog = action.payload;
        },
        togglePreviewButton: state => {
            state.value = !state.value
        }
    }
})

export const {setPreview,togglePreviewButton} = PreviewSlice.actions

export default PreviewSlice.reducer;