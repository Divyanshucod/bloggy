import { useEffect, useState } from "react";
import { X, Pen, Eye, EyeOff } from "lucide-react";
import { Avatar } from "./Avatar";
import { handleError } from "../helperFunctions";
import axios from "axios";
import { BACKED_URL_LOCAL } from "../config";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "./Button";
import { Skeleton } from "@mui/material";
interface UserProfileType {
  id:string;
  name: string;
  bio: string | null;
  email:string;
  following:number;
  followers: number;
  totalBlogs: number;
}
export default function UserProfilePage() {
  const [showPanel, setShowPanel] = useState<"followers" | "following" | null>(
    null
  );
  const {user} = useSelector((state:RootState) => state.UserSlice)
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState('');
  const [passwordData, setPasswordData] = useState({ newPassword: "", oldPassword: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isFetchingUserDeatils,setIsFetchingUserDetails] = useState(false)
  const [isFetchingList,setIsFetchingList] = useState(false)
  const [followers_following,setFollowers_following] = useState({
     followers:[],
     following:[]
  })
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails,setUserDetails] = useState<UserProfileType>({
    id:'',
    name:'Jon Tomer',
    email:'jon123@gmail.com',
    bio:'H1! everyone jon here, i am a full stack developer nice to meet you.',
    followers:0,
    following:0,
    totalBlogs:0,
  })

  async function updateBio() {
     try {
        const res = await axios.put(`${BACKED_URL_LOCAL}api/v1/user/user-details`,{bio},{withCredentials:true})
        toast.success(res.data.message)
        setBio('')
     } catch (error) {
       handleError(error)
     }
  }
  async function updatePassword() {
    try {
       const res = await axios.put(`${BACKED_URL_LOCAL}api/v1/user/user-details`,{password:passwordData},{withCredentials:true})
       toast.success(res.data.message)
       setPasswordData({oldPassword:'',newPassword:''})
    } catch (error) {
      handleError(error)
    }
 }
  async function getFollowers_Following() {
     try {
       setIsFetchingList(true)
       const res = await axios.get(`${BACKED_URL_LOCAL}api/v1/user/followers_following`,{withCredentials:true})
       setFollowers_following({followers:res.data.followers,following:res.data.following});
       setIsFetchingList(false)
     } catch (error) {
        handleError(error)
     }
  }
  useEffect(()=>{
     async function fetchUserDetails(){
        try {
           setIsFetchingUserDetails(true)
           const res = await axios.get(`${BACKED_URL_LOCAL}api/v1/user/user-details/${user?.id}`,{withCredentials:true})
           setUserDetails(res.data.userDetails)
           setBio(res.data.userDetails?.bio || '')
           setIsFetchingUserDetails(false)
        } catch (error) {
            handleError(error)
        }
     }
     fetchUserDetails()
  },[user])
  
  return (
    <div className="min-h-screen px-4 py-6 md:px-10 bg-white dark:bg-gray-950 transition pt-15 relative">
      <div className="relative w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl mt-6">
        <div className="flex items-center gap-4 mb-6">
          {isFetchingUserDeatils ? <Skeleton variant="circular" width={30} height={30} /> :<Avatar user="Dev" />}
          <div>
           {isFetchingUserDeatils? <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> :<h1 className="text-2xl font-bold dark:text-white">{userDetails.name}</h1>} 
           {isFetchingUserDeatils? <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> :<p className="text-gray-500 text-sm ">{userDetails.email}</p>}
          </div>
        </div>

        <div className="flex gap-10 text-center mb-4">
          <div
            onClick={() => {
              setShowPanel("followers")
              getFollowers_Following()
            }}
            className="cursor-pointer"
          >
            <div className="text-lg font-semibold dark:text-white">
             {isFetchingUserDeatils ? <Skeleton variant="circular" width={10} height={10} />:userDetails.followers}
            </div>
            <div className="text-gray-600">Followers</div>
          </div>
          <div
            onClick={() => {
              setShowPanel("following")
              getFollowers_Following()
            }}
            className="cursor-pointer"
          >
            <div className="text-lg font-semibold dark:text-white">
            {isFetchingUserDeatils ? <Skeleton variant="circular" width={10} height={10} />:userDetails.following}

            </div>
            <div className="text-gray-600">Following</div>
          </div>
          <div>
            <div className="text-lg font-semibold dark:text-white">
             {isFetchingUserDeatils ? <Skeleton variant="circular" width={10} height={10} />:userDetails.totalBlogs}
              
            </div>
            <div className="text-gray-600">Blogs</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg dark:text-white">Bio</h2>
            <button onClick={() => setEditingBio(!editingBio)}>
              {editingBio ? (
                <X size={20} className="text-gray-500 cursor-pointer" />
              ) : (
                <Pen className="w-4 h-4 text-gray-500 cursor-pointer" />
              )}
            </button>
          </div>
          {editingBio ? (
            <div className="mt-2">
              <textarea
                className="w-full field-sizing-content px-3 py-2 rounded-md border resize-none border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows={1}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded cursor-pointer"
                onClick={() => {
                  updateBio();
                  setEditingBio(false);
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-1">
              {isFetchingUserDeatils ? <Skeleton variant="text" sx={{ fontSize: '1rem' }} /> : (!userDetails.bio || userDetails?.bio?.length === 0) ? 'No bio found':userDetails.bio}
            </p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showPasswordForm ? "Cancel Password Update" : "Update Password"}
          </button>

          {showPasswordForm && (
            <div className="mt-3 space-y-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, oldPassword: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500 flex items-center gap-1"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} Show
                Passwords
              </button>
              <Button onClick={() =>
                  updatePassword()
                }>
                update
              </Button>
            </div>
          )}
        </div>
      </div>

      {showPanel && (
         <div className="mt-18 fixed top-0 right-0 w-full md:w-[400px] min-h-screen bg-white dark:bg-gray-900 shadow-lg z-50 overflow-y-auto transition-all">
           {isFetchingList ? 
            <>
              <Skeleton variant="rounded" width={210} height={30} />
              <Skeleton variant="rounded" width={210} height={30} />
              <Skeleton variant="rounded" width={210} height={30} />
              <Skeleton variant="rounded" width={210} height={30} />
              </>
            :<>
            <div className="flex justify-between items-center p-4 border-b-gray-400">
           <h3 className="text-lg font-bold dark:text-white">
             {showPanel === "followers" ? "Followers" : "Following"}
           </h3>
           <button onClick={() => setShowPanel(null)}>
             <X size={20} className="text-gray-500 hover:text-red-500" />
           </button>
         </div>
         {(showPanel === 'followers' && followers_following.followers.length == 0) ?<div className="dark:text-white text-center">No followers found</div>: (showPanel === 'following' && followers_following.following.length == 0)?<div className="dark:text-white font-serif text-center">No following found</div>: <ul className="">
           {(showPanel === "followers" ? followers_following.followers : followers_following.following).map(
             (item) => (
               <li key={item.id} className="flex items-center gap-4 px-4 py-3">
                 <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                   {item.name.charAt(0)}
                 </div>
                 <div>
                   <div className="font-semibold text-gray-800 dark:text-white">
                     {item.name}
                   </div>
                   <div className="text-sm text-gray-500">{item.email}</div>
                 </div>
               </li>
             )
           )}
         </ul> }
       </>}
            </div>
      )}
      <ToastContainer/>
    </div>
  );
}
