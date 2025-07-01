import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Blog from "./pages/Blog";
import { ToastContainer } from "react-toastify";
import { Blogs } from "./pages/Blogs";
import { AppBar } from "./components/AppBar";
import { BlogCreate } from "./pages/BlogCreate";
import { MyBlogs } from "./pages/MyBlogs";
import { useEffect, useState } from "react";
import { UserInfoContext, type User } from "./hooks";
import handleError from "./helperFunctions";
import axios from "axios";
import { BACKED_URL_LOCAL } from "./config";


function App() {
  const location = useLocation();
  const [user,setUser] = useState<User | null>(null)

  useEffect(()=>{
     const getUser = async ()=>{
      try {
        const response = await axios.get(`${BACKED_URL_LOCAL}api/v1/me`);
        setUser(response.data.user)
      } catch (error) {
        return handleError(error)
      }
     }
     getUser()
  },[])
  return (
    <UserInfoContext.Provider value={{user,setUser}}> 
      {location.pathname === "/signin" ||
      location.pathname === "/signup" ? null : (
        <div className="mb-14">
          <AppBar />
        </div>
      )}
      <ToastContainer />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/blog/user/myblogs" element={<MyBlogs/>}/>
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/create" element={<BlogCreate />} />
      </Routes>
    </UserInfoContext.Provider>
  );
}

export default App;
