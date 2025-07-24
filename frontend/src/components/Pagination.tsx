import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCustomPage, setDecrementPage, setIncrementPage } from "../features/comment/CommentSlice"
import type { RootState } from "../store"
import { setCustomPageAllBlogs, setCustomPageMyBlogs, setDecrementPageAllBlogs, setDecrementPageMyBlogs, setIncrementPageAllBlogs, setIncrementPageMyBlogs } from "../features/Blogs/BlogSlice"

interface paginationProps {
    cnt:number,
    type:'blogs'|'myBlogs'|'comments',
}
export const Pagination = (props:paginationProps)=>{
    const activePage = useSelector((state:RootState) => props.type === 'comments' ? state.CommentSlice.pageNo : props.type === 'myBlogs' ? state.BlogSlice.userBlogsPage : state.BlogSlice.allBlogPages);
    const [noOfPages,setNoOfPages] = useState<number>(Math.floor(props.cnt/6))
    const [pageArray,setPageArray] = useState<number>([])
    const dispatch = useDispatch()
    
    function getPageArray(){
        const arr = [];
        const Pagediff = noOfPages-activePage+1
        const start = Pagediff >= 4 ? activePage : (Pagediff-4+activePage);
        const end = Pagediff >= 4 ? activePage+3 : noOfPages;
        console.log(start,end);
        for(let i=start;i<=end;i++){
          arr.push(i)
        }
         setPageArray(arr);
         return;
    }
    function handleDecrement(){
        if(props.type === 'comments'){
            dispatch(setDecrementPage())
        }else if(props.type === 'myBlogs'){
            dispatch(setDecrementPageMyBlogs())
        }else{
            dispatch(setDecrementPageAllBlogs())
        }
    }
    function handleIncrement(){
        if(props.type === 'comments'){
            dispatch(setIncrementPage())
        }else if(props.type === 'myBlogs'){
            dispatch(setIncrementPageMyBlogs())
        }else{
            dispatch(setIncrementPageAllBlogs())
        }
    }
    function handleCustom(val:number){
        if(props.type === 'comments'){
            dispatch(setCustomPage(val))
        }else if(props.type === 'myBlogs'){
            dispatch(setCustomPageMyBlogs(val))
        }else{
            dispatch(setCustomPageAllBlogs(val))
        }
    }
    useEffect(()=>{ 
        getPageArray()
    },[activePage])
    return <>
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6">
      <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 shadow-xl shadow-blue-200 dark:shadow-gray-900 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-300">
        {/* Previous Button */}
        <button
          onClick={handleDecrement}
          disabled={activePage === 1}
          className={`px-3 py-2 rounded-full text-sm font-medium transition duration-200 ${
            activePage === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:scale-105 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800 text-gray-700 dark:text-white shadow-sm'
          }`}
        >
          &lt;
        </button>
  
        {/* Page Numbers */}
        <div className="flex gap-2 overflow-x-hidden">
          {pageArray.map((val: number, index: number) => (
            <button
              key={index}
              onClick={() => handleCustom(val)}
              className={`px-3 py-2 rounded-full text-sm font-semibold transition duration-200 ${
                activePage === val
                  ? 'bg-blue-600 text-white dark:bg-blue-700 shadow-md scale-105'
                  : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-white hover:scale-105 hover:bg-blue-100 dark:hover:bg-blue-800 shadow-sm'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
  
        {/* Next Button */}
        <button
          onClick={handleIncrement}
          disabled={activePage === noOfPages}
          className={`px-3 py-2 rounded-full text-sm font-medium transition duration-200 ${
            activePage === noOfPages
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:scale-105 hover:bg-blue-100 dark:bg-gray-700 dark:hover:bg-blue-800 text-gray-700 dark:text-white shadow-sm'
          }`}
        >
          &gt;
        </button>
      </div>
    </div>
  </>
  
  
}