
import {
  createContext,
  useEffect,
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

