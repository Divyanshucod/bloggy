import { configureStore } from '@reduxjs/toolkit'
import  UserSlice  from './features/User/UserSlice'
import ThemeSlice  from './features/Theme/ThemeSlice'
import BlogSlice from './features/Blogs/BlogSlice'
import  PreviewSlice from './features/Preview/PreviewSlice'
import  CommentSlice  from './features/comment/CommentSlice'

export const store = configureStore({
  reducer: {
    UserSlice,
    ThemeSlice,
    BlogSlice,
    PreviewSlice,
    CommentSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch