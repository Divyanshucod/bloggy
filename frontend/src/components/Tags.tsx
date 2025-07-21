import { useDispatch, useSelector } from "react-redux";
import { deleteCreateBlogTags, deleteUpdateBlogTags, setCreateBlogTags, setUpdateBlogTags } from "../features/Blogs/BlogSlice";
import { useState } from "react";
import type { RootState } from "../store";
import { Check } from "lucide-react";
import CloseIcon from '@mui/icons-material/Close';
interface tagsType {
    tags: string[];
    isCreatingBlog?:boolean,
    onFocused:boolean,
    setOnFocused:React.Dispatch<React.SetStateAction<boolean>>
  }


export const Tags = (props:tagsType)=>{
    const dispatch = useDispatch()
    const {BlogToCreate} = useSelector((state:RootState)=> state.BlogSlice)
    const preview = useSelector((state:RootState) => state.PreviewSlice)
    const [tagTitle,setTagTitle] = useState('')
    function handleTagsCreation(){
        if(tagTitle.length === 0) return;
        if(props.isCreatingBlog) {
            dispatch(setCreateBlogTags(tagTitle));
        }
        else{
            dispatch(setUpdateBlogTags(tagTitle))
        }
        setTagTitle('')
    }
    
    return <div>
        <div className="">
           {BlogToCreate.tags.map(val => (
            <Tag title={val} isCreatingBlog={props.isCreatingBlog}/>
           ))}
        </div>
        {!preview.value && <div className="mb-4">
          <input
            value={tagTitle}
            onChange={(e) => setTagTitle(e.target.value)}
            placeholder="Tags..."
            onFocus={()=> props.setOnFocused(true)}
            className="w-2xl rounded-md border dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none border-transparent transition text-xl"
          />
          {props.onFocused && <button onClick={handleTagsCreation} className="bg-green-700 dark:bg-green-800 py-2 px-2 rounded-sm text-white cursor-pointer">
             <Check size={16}/>
          </button>}
        </div>}
    </div>
}

const Tag = ({ title, isCreatingBlog }: { title: string; isCreatingBlog?: boolean }) => {
  const dispatch = useDispatch();
  const preview = useSelector((state:RootState) => state.PreviewSlice)
  function handleRemoveTags() {
    if (isCreatingBlog) {
      dispatch(deleteCreateBlogTags(title));
    } else {
      dispatch(deleteUpdateBlogTags(title));
    }
  }

  return (
    <div className="relative inline-flex items-center px-3 py-1 pr-6 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-sm font-medium shadow-sm transition-all cursor-pointer">
      {title}
      {!preview.value && <button
        onClick={handleRemoveTags}
        className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-xs rounded-full bg-green-200 dark:bg-green-800 hover:bg-red-400 dark:hover:bg-red-600 text-black dark:text-white transition-all"
        aria-label={`Remove ${title}`}
      >
      <CloseIcon/>
      </button>}
    </div>
  );
};

export default Tag;
