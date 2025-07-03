import { createSlice } from "@reduxjs/toolkit";
export const ThemeSlice = createSlice({
    name:"theme",
    initialState:{
        value:''
    },
    reducers:{
        setTheme: state => {
            state.value = 'dark'
        }
    }
})

export const {setTheme} = ThemeSlice.actions;

export default ThemeSlice.reducer;