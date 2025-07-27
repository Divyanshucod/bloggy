
import {
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {type AppDispatch } from "../store";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { fetchMe } from "../features/User/UserSlice";
export const useAuth = ()=>{
    const dispatch = useAppDispatch();
    const {isloading,hasData} = useSelector((state:RootState) => state.UserSlice);
    useEffect(() => {
       async function fetchData(){
           await dispatch(fetchMe());
        }
        if(!hasData){
        fetchData()
      }
    }, []); 
    return {isloading};
}

export const useAppDispatch = () => useDispatch<AppDispatch>();




export const useElementInView = (options:any) => {
  const [isInView, setIsInView] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [options]);

  return [targetRef, isInView];
};

