import { type CustomElementType } from "@dev0000007/medium-web";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { BACKED_URL_LOCAL } from "../../config";
import type { RootState } from "../../store";
import { initialValue } from "../../helperFunctions";
interface Blogs {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  published: boolean;
  author: {
    name: string;
  };
}
// 2025-06-21T15:08:03.091+00:00
interface authorDetails {
  id: string;
  publishedDate: string;
  authorOrNot: false;
  published: true;
  author: {
    name: string;
  };
}
export interface BlogType {
  content : CustomElementType[],
  tags: string[],
  title:string
}
interface CreateBlogProps {
  Blog: BlogType,
  BlogToCreate: BlogType,
  isloading: "idle" | "pending" | "succeeded" | "idle";
  isPublishing_drafting:"idle" | "pending" | "succeeded";
  isUpdating:"idle" | "pending" | "succeeded";
  UserBlogs: Blogs[];
  AllBlogs: Blogs[];
  hasUserBlogFetched:boolean,
  hasAllBlogFetched:boolean,
  userBlogsPage: number;
  isMoreUserBlogs: boolean;
  isMoreAllBlogs: boolean;
  allBlogPages: number;
  authorDetails: authorDetails;
}
const initialState = {
  Blog: initialValue,
  BlogToCreate: initialValue,
  isPublishing_drafting:'idle',
  isloading: "idle",
  isUpdating:"idle",
  UserBlogs: [],
  AllBlogs: [],
  hasAllBlogFetched:false,
  hasUserBlogFetched:false,
  userBlogsPage: 0,
  allBlogPages: 0,
  isMoreUserBlogs: true,
  isMoreAllBlogs: true,
  authorDetails: {
    id: "",
    publishedDate: "2025-06-21T15:08:03.091+00:00",
    authorOrNot: false,
    published: true,
    author: {
      name: "Dev",
    },
  },
} satisfies CreateBlogProps as CreateBlogProps;

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async ({ createDraft }: { createDraft: boolean }, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;

      const response = await axios.post(
        `${BACKED_URL_LOCAL}api/v1/blog`,
        {
          content: state.BlogSlice.BlogToCreate,
          published: createDraft,
        },
        {
          withCredentials: true,
        }
      );

      return response.data.message;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const fetchUserBlogs = createAsyncThunk("blog/userBlogs", async (_arg, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
    const response = await axios.get(
      `${BACKED_URL_LOCAL}api/v1/blog/user/${state.BlogSlice?.userBlogsPage}`,
      {
        withCredentials: true,
      }
    );
    return response.data.posts;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  });
export const fetchBlogById = createAsyncThunk("blog/fetchBlogById", async ({ blogId }: { blogId: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
    const dispatch = thunkAPI.dispatch;
    const response = await axios.get(
      `${BACKED_URL_LOCAL}api/v1/blog/${blogId}`,
      {
        withCredentials: true,
      }
    );
    const user_details = {
      id: response.data.post.id,
      publishedDate: response.data.post.id,
      author: response.data.post.author,
      authorOrNot: response.data.post.authorId === state.UserSlice.user?.id,
      published: response.data.post.published,
    };
    dispatch(BlogSlice.actions.setAuthorDetails(user_details));
    return response.data.post.blogJson;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Something went wrong"
      );
    }
  });
export const fetchAllBlogs = createAsyncThunk("blog/fetchAllBlogs", async (_arg, thunkAPI) => {
     try {
      const state: RootState = thunkAPI.getState() as RootState;
      const response = await axios.get(
        `${BACKED_URL_LOCAL}api/v1/blog/bulk/${state.BlogSlice?.allBlogPages}`
      );
      return response.data.posts;
     } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong"
      );
     }
  });
export const updateBlog = createAsyncThunk("blog/updateBlog", async ({
  blogId,
  published,
}: {
  blogId: string;
  published: boolean;
}, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
    const response = await axios.put(
      `${BACKED_URL_LOCAL}api/v1/blog`,
      { content: state.BlogSlice?.Blog, postId:blogId, published },
      { withCredentials: true }
    );
    return response.data.message;
    } catch (error) {
       return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Something went wrong!"
       )
    }
  });
export const BlogSlice = createSlice({
  name: "Blog",
  initialState: initialState,
  reducers: {
    setUserPages: (state) => {
      state.userBlogsPage += 1;
      state.hasUserBlogFetched = false
    },
    setAllBlogPages: (state) => {
      state.allBlogPages += 1;
      state.hasAllBlogFetched = false
    },
    setCreateBlog: (state, action) => {
      state.BlogToCreate.content = action.payload;
    },
    setUpdateBlog: (state, action) => {
      state.Blog.content = action.payload;
    },
    setAuthorDetails: (state, action) => {
      state.authorDetails = action.payload;
    },
    setCreateBlogTitle:(state,action) => {
      state.BlogToCreate.title = action.payload
    },
    setCreateBlogTags:(state,action) => {
      state.BlogToCreate.tags = [...state.BlogToCreate.tags,action.payload]
    },
    deleteCreateBlogTags:(state,action) => {
      state.BlogToCreate.tags = state.BlogToCreate.tags.filter(val=> val != action.payload)
    },
    setUpdateBlogTitle:(state,action) => {
      state.BlogToCreate.title = action.payload
    },
    setUpdateBlogTags:(state,action) => {
      state.BlogToCreate.tags = [...state.BlogToCreate.tags,action.payload]
    },
    deleteUpdateBlogTags:(state,action) => {
      state.BlogToCreate.tags = state.BlogToCreate.tags.filter(val=> val != action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      createBlog.fulfilled,
      (state,) => {
        state.isPublishing_drafting = "succeeded";
        state.BlogToCreate = initialValue
        state.hasAllBlogFetched = false;
        state.hasUserBlogFetched = false;
      }
    );
    builder.addCase(createBlog.pending, (state) => {
      state.isPublishing_drafting = "pending";
    });
    builder.addCase(createBlog.rejected, (state) => {
      state.isPublishing_drafting = "idle";
    });
    builder.addCase(fetchUserBlogs.fulfilled, (state, action) => {
      state.UserBlogs = [...state.UserBlogs, ...action.payload];
      state.isMoreUserBlogs = action.payload.length < 5 ? false : true;
      state.hasUserBlogFetched = true
      state.isloading = "succeeded";
    });
    builder.addCase(fetchUserBlogs.pending, (state) => {
      state.isloading = "pending";
    });
    builder.addCase(fetchUserBlogs.rejected, (state) => {
      state.isloading = "idle";
    });
    builder.addCase(fetchAllBlogs.fulfilled, (state, action) => {
      console.log(action.payload);
      
      state.AllBlogs = [...state.AllBlogs, ...action.payload];
      state.isMoreAllBlogs = action.payload.length < 5 ? false : true;
      state.hasAllBlogFetched = true
      state.isloading = "succeeded";
    });
    builder.addCase(fetchAllBlogs.pending, (state) => {
      state.isloading = "pending";
    });
    builder.addCase(fetchAllBlogs.rejected, (state) => {
      state.isloading = "idle";
    });
    builder.addCase(fetchBlogById.fulfilled, (state, action) => {
      state.Blog = action.payload;
      state.isloading = "succeeded";
    });
    builder.addCase(fetchBlogById.pending, (state) => {
      state.isloading = "pending";
    });
    builder.addCase(fetchBlogById.rejected, (state) => {
      state.isloading = "idle";
    });
    builder.addCase(
      updateBlog.fulfilled,
      (state) => {
        state.isUpdating = "succeeded";
      }
    );
    builder.addCase(
      updateBlog.pending,
      (state) => {
        state.isUpdating = "pending";
      }
    );
    builder.addCase(
      updateBlog.rejected,
      (state) => {
        state.isUpdating = "idle";
      }
    );
  },
});

export const {setAllBlogPages,setAuthorDetails,setCreateBlog,
  setUpdateBlog,
  setUserPages,
  setCreateBlogTags,
  setCreateBlogTitle,
  setUpdateBlogTags,
  setUpdateBlogTitle,
  deleteCreateBlogTags,
  deleteUpdateBlogTags
} = BlogSlice.actions
export default BlogSlice.reducer;
