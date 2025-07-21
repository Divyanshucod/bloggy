import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Blog from "./pages/Blog";
import { Blogs } from "./pages/Blogs";
import { AppBar } from "./components/AppBar";
import { BlogCreate } from "./pages/BlogCreate";
import { MyBlogs } from "./pages/MyBlogs";

import { ThemeProvider } from "./components/ThemeProvider";
import { Home } from "./pages/Home";
import { Protector } from "./components/Protector";
import { ToastContainer } from "react-toastify";
import { CommentCard } from "./components/CommentCard";
import { CommentSection } from "./components/CommentSection";


function App() {
  return (
    <ThemeProvider> 
          <AppBar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/blog/user/myblogs" element={
          <Protector>
          <MyBlogs/>
          </Protector>
          }/>
        <Route path="/blog/:id" element={
          <Protector>
          <Blog />
          </Protector>
          } />
        <Route path="/blogs" element={<Protector>
         <Blogs /></Protector>} />
        <Route path="/blog/create" element={
         <Protector> <BlogCreate /></Protector>
          } />
        <Route path="/" element={<Protector><Home/></Protector>}/>
        <Route path="/comment" element={<CommentSection/>}/>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" 
      />
    </ThemeProvider>
  );
}

export default App;
