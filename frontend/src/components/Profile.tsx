import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import axios from "axios";
import { BACKED_URL_LOCAL } from "../config";
import { handleError } from "../helperFunctions";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

interface UserProfileType {
  id: string;
  name: string;
  bio: string;
  email: string;
  followers: number;
  totalBlogs: number;
  meFollowing: boolean;
}

const UserProfile = ({
  setProfileOpen,
  isProfileOpen,
  authorId,
}: {
  setProfileOpen: (prev: any) => void;
  isProfileOpen: boolean;
  authorId: string;
}) => {
  const { id } = useSelector((state: RootState) => state.UserSlice).user;
  const [user, setUser] = useState<UserProfileType>({
    id: "",
    name: "Loading...",
    bio: "Loading...",
    email: "Loading...",
    followers: 0,
    totalBlogs: 0,
    meFollowing: false,
  });
  async function handleFollow_Unfollow() {
    try {
      const res = await axios.put(
        `${BACKED_URL_LOCAL}api/v1/user/${
          user.meFollowing ? "unfollow" : "follow"
        }`,
        { follow: authorId },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (error) {
      handleError(error);
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${BACKED_URL_LOCAL}api/v1/user/user-details/${authorId}`,
          { withCredentials: true }
        );
        setUser(res.data.userDetails);
      } catch (error) {
        handleError(error);
      }
    };
    if (isProfileOpen) {
      fetchUserData();
    }
  }, [isProfileOpen]);

  return (
    <div className="absolute top-14 right-2 w-full max-w-sm bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 transition-all">
      {/* Close Button */}
      <button
        onClick={() => setProfileOpen((prev) => !prev)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Profile Header */}
      <h2 className="text-xl dark:text-white mb-3">Author</h2>
      <div className="flex items-center gap-4 mb-4">
        <Avatar user={user.name} />
        <div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name}
          </div>
          <div className="text-sm text-gray-900 dark:text-gray-500">
            {user.email}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.followers} followers • {user.totalBlogs} blogs
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="relative bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {!user.bio || user.bio.length == 0 ? "No bio added yet." : user.bio}
        </p>
      </div>
      {/* Follow Button */}
      {id !== user?.id && (
        <div className="mt-4">
          <button
            className={`w-full py-2 px-4 rounded-md ${
              user.meFollowing
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
            onClick={handleFollow_Unfollow}
          >
            {user.meFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
