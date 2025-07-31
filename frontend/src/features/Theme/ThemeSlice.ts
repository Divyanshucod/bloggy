import { createSlice } from "@reduxjs/toolkit";

const value = localStorage.getItem("theme") || "dark";
export const ThemeSlice = createSlice({
  name: "theme",
  initialState: {
    value: value,
  },
  reducers: {
    toggleTheme: (state) => {
      state.value = state.value === "dark" ? "" : "dark";
      localStorage.setItem("theme", state.value);
    },
  },
});

export const { toggleTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
