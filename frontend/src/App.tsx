import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Blog from "./pages/Blog";
import { ToastContainer } from "react-toastify";
import { Blogs } from "./pages/Blogs";
import { AppBar } from "./components/AppBar";
import { BlogCreate } from "./pages/BlogCreate";
import { BlogUpdate } from "./pages/BlogUpdate";

function App() {
  const location = useLocation();
  return (
    <>
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
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/create" element={<BlogCreate />} />
        <Route path="/blog/update/:id" element={<BlogUpdate />} />
      </Routes>
    </>
  );
}

export default App;
