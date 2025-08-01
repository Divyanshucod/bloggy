import { type CustomElementType } from "@dev0000007/medium-web";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios, { AxiosError } from "axios";
import { BACKED_URL } from "../../config";
import type { RootState } from "../../store";
import { initialValue, initialValueFullBlog } from "../../helperFunctions";
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
export type likeDislikeType = "LIKE" | "DISLIKE" | "NONE";
export type reactionType = "HEART" | "SMILE" | "ANNOYED" | "IDEA" | "NONE";
export interface authorDetails {
  id: string;
  publishedDate: string;
  authorOrNot: false;
  published: true;
  authorId: string;
  author: {
    name: string;
  };
}
export interface BlogType {
  content: CustomElementType[];
  tags: string[];
  title: string;
}
export type extras = {
  commentsCnt: number;
  reactions: {
    like: number;
    dislike: number;
    reaction: number;
  };
  currentUserReactions: {
    likeDislike: likeDislikeType;
    reaction: reactionType;
  };
};

interface CreateBlogProps {
  filteredBlogPages: number;
  filteredBlogs: {
    totalBlogs: number;
    blogs:{post:Blogs}[];
  };
  Blog: BlogType & extras;
  BlogToCreate: BlogType;
  isloading: "idle" | "pending" | "succeeded";
  isPublishing_drafting: "idle" | "pending" | "succeeded";
  isUpdating: "idle" | "pending" | "succeeded";
  UserBlogs: {
    totalBlogs: number;
    blogs: Blogs[];
  };
  AllBlogs: {
    totalBlogs: number;
    blogs: Blogs[];
  };
  hasUserBlogFetched: boolean;
  hasAllBlogFetched: boolean;
  userBlogsPage: number;
  allBlogPages: number;
  FilteredBlogPages: number;
  authorDetails: authorDetails;
}
const initialState = {
  filteredBlogPages: 1,
  filteredBlogs: {
    blogs: [],
    totalBlogs: 0,
  },
  Blog: initialValueFullBlog,
  BlogToCreate: initialValue,
  isPublishing_drafting: "idle",
  isloading: "idle",
  isUpdating: "idle",
  UserBlogs: {
    blogs: [],
    totalBlogs: 0,
  },
  AllBlogs: {
    blogs: [],
    totalBlogs: 0,
  },
  hasAllBlogFetched: false,
  hasUserBlogFetched: false,
  userBlogsPage: 1,
  allBlogPages: 1,
  FilteredBlogPages: 1,
  authorDetails: {
    id: "",
    publishedDate: "2025-06-21T15:08:03.091+00:00",
    authorOrNot: false,
    authorId: "",
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
        `${BACKED_URL}api/v1/blog`,
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
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const fetchUserBlogs = createAsyncThunk(
  "blog/userBlogs",
  async (_arg, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
      const response = await axios.get(
        `${BACKED_URL}api/v1/blog/user/${
          state.BlogSlice?.userBlogsPage - 1
        }`,
        {
          withCredentials: true,
        }
      );
      return response.data.Posts;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async ({ blogId }: { blogId: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const dispatch = thunkAPI.dispatch;
      const response = await axios.get(
        `${BACKED_URL}api/v1/blog/${blogId}`,
        {
          withCredentials: true,
        }
      );

      const user_details = {
        id: response.data.blog.id,
        publishedDate: response.data.blog.publishedDate,
        author: response.data.blog.author,
        authorOrNot: response.data.blog.authorId === state.UserSlice.user?.id,
        published: response.data.blog.published,
        authorId: response.data.blog.authorId,
      };
      dispatch(BlogSlice.actions.setAuthorDetails(user_details));
      const {
        content,
        title,
        tags,
        reactions,
        commentsCnt,
        currentUserReactions,
      } = response.data.blog;
      return {
        content,
        title,
        tags,
        reactions,
        commentsCnt,
        currentUserReactions,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const fetchFilteredBlogs = createAsyncThunk(
  "blogs/fetchFilteredBlogs",
  async ({ filter }: { filter: string }, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
      const response = await axios.get(
        `${BACKED_URL}api/v1/blog/filter/${filter}/${
          state.BlogSlice?.FilteredBlogPages - 1
        }`,
        { withCredentials: true }
      );
      return response.data.filterBlogs;
    } catch (err:any) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAllBlogs",
  async (_arg, thunkAPI) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
      const response = await axios.get(
        `${BACKED_URL}api/v1/blog/bulk/${
          state.BlogSlice?.allBlogPages - 1
        }`
      );
      return response.data.Posts;
    } catch (err:any) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (
    {
      blogId,
      published,
    }: {
      blogId: string;
      published: boolean;
    },
    thunkAPI
  ) => {
    try {
      const state: RootState = thunkAPI.getState() as RootState;
      const response = await axios.put(
        `${BACKED_URL}api/v1/blog`,
        { content: state.BlogSlice?.Blog, postId: blogId, published },
        { withCredentials: true }
      );
      return response.data.message;
    } catch (err:any) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"
      );
    }
  }
);
export const addBlogReaction = createAsyncThunk(
  "blog/addBlogReaction",
  async (
    {
      blogId,
      reactions,
    }: {
      blogId: string;
      reactions: { likeDislike: likeDislikeType; reaction: reactionType };
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `${BACKED_URL}api/v1/blog/blog-reaction`,
        {
          postId: blogId,
          likeDislike: reactions.likeDislike,
          reaction: reactions.reaction,
        },
        { withCredentials: true }
      );
      return response.data.message;
    } catch (err:any) {
      return thunkAPI.rejectWithValue(
        (err as AxiosError<{ message: string }>)?.response?.data?.message || "Something went wrong"

      );
    }
  }
);
export const BlogSlice = createSlice({
  name: "Blog",
  initialState: initialState,
  reducers: {
    setUserPages: (state) => {
      state.userBlogsPage += 1;
      state.hasUserBlogFetched = false;
    },
    setAllBlogPages: (state) => {
      state.allBlogPages += 1;
      state.hasAllBlogFetched = false;
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
    setCreateBlogTitle: (state, action) => {
      state.BlogToCreate.title = action.payload;
    },
    setCreateBlogTags: (state, action) => {
      state.BlogToCreate.tags = [...state.BlogToCreate.tags, action.payload];
    },
    deleteCreateBlogTags: (state, action) => {
      state.BlogToCreate.tags = state.BlogToCreate.tags.filter(
        (val) => val != action.payload
      );
    },
    setUpdateBlogTitle: (state, action) => {
      state.Blog.title = action.payload;
    },
    setUpdateBlogTags: (state, action) => {
      state.Blog.tags = [...state.Blog.tags, action.payload];
    },
    deleteUpdateBlogTags: (state, action) => {
      state.Blog.tags = state.Blog.tags.filter((val) => val != action.payload);
    },
    setCustomPageMyBlogs: (state, action) => {
      state.userBlogsPage = action.payload;
    },
    setIncrementPageMyBlogs: (state) => {
      state.userBlogsPage = state.userBlogsPage + 1;
    },
    setDecrementPageMyBlogs: (state) => {
      state.userBlogsPage = state.userBlogsPage - 1;
    },
    setCustomPageAllBlogs: (state, action) => {
      state.allBlogPages = action.payload;
    },
    setIncrementPageAllBlogs: (state) => {
      state.allBlogPages = state.allBlogPages + 1;
    },
    setDecrementPageAllBlogs: (state) => {
      state.allBlogPages = state.allBlogPages - 1;
    },
    setCustomPageFilteredBlogs: (state, action) => {
      state.filteredBlogPages = action.payload;
    },
    setIncrementPageFilteredBlogs: (state) => {
      state.filteredBlogPages = state.filteredBlogPages + 1;
    },
    setDecrementPageFilteredBlogs: (state) => {
      state.filteredBlogPages = state.filteredBlogPages - 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBlog.fulfilled, (state) => {
      state.isPublishing_drafting = "succeeded";
      state.BlogToCreate = initialValue;
    });
    builder.addCase(createBlog.pending, (state) => {
      state.isPublishing_drafting = "pending";
    });
    builder.addCase(createBlog.rejected, (state) => {
      state.isPublishing_drafting = "idle";
    });
    builder.addCase(fetchUserBlogs.fulfilled, (state, action) => {
      state.UserBlogs = action.payload;
      state.isloading = "succeeded";
    });
    builder.addCase(fetchUserBlogs.pending, (state) => {
      state.isloading = "pending";
    });
    builder.addCase(fetchUserBlogs.rejected, (state) => {
      state.isloading = "idle";
    });
    builder.addCase(fetchAllBlogs.fulfilled, (state, action) => {
      state.AllBlogs = action.payload;
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
    builder.addCase(updateBlog.fulfilled, (state) => {
      state.isUpdating = "succeeded";
    });
    builder.addCase(updateBlog.pending, (state) => {
      state.isUpdating = "pending";
    });
    builder.addCase(updateBlog.rejected, (state) => {
      state.isUpdating = "idle";
    });
    builder.addCase(fetchFilteredBlogs.fulfilled, (state, action) => {
      state.filteredBlogs = action.payload;
      state.isloading = "succeeded";
    });
    builder.addCase(fetchFilteredBlogs.pending, (state) => {
      state.isloading = "pending";
    });
    builder.addCase(fetchFilteredBlogs.rejected, (state) => {
      state.isloading = "idle";
    });
  },
});

export const {
  setAllBlogPages,
  setAuthorDetails,
  setCreateBlog,
  setUpdateBlog,
  setUserPages,
  setCreateBlogTags,
  setCreateBlogTitle,
  setUpdateBlogTags,
  setUpdateBlogTitle,
  deleteCreateBlogTags,
  deleteUpdateBlogTags,
  setCustomPageAllBlogs,
  setCustomPageMyBlogs,
  setDecrementPageAllBlogs,
  setDecrementPageMyBlogs,
  setIncrementPageAllBlogs,
  setIncrementPageMyBlogs,
  setIncrementPageFilteredBlogs,
  setDecrementPageFilteredBlogs,
  setCustomPageFilteredBlogs,
} = BlogSlice.actions;
export default BlogSlice.reducer;
