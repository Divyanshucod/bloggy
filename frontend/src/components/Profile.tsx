import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar } from './Avatar';

interface UserProfileType {
  name: string;
  bio: string;
  followers: number;
  totalBlogs: number;
}

const UserProfile = ({ setProfileOpen, isProfileOpen }: { setProfileOpen: (prev: any) => void; isProfileOpen: boolean }) => {
  const [user, setUser] = useState<UserProfileType>({
    name: 'John Doe',
    bio: 'A passionate blogger and tech enthusiast.',
    followers: 120,
    totalBlogs: 45,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const fetchedUser = {
        name: 'John Doe',
        bio: 'A passionate blogger and tech enthusiast.',
        followers: 120,
        totalBlogs: 45,
        id: '12345', // Example ID
      };
      setUser(fetchedUser);
    };
    if (isProfileOpen) {
      fetchUserData();
    }
  }, [isProfileOpen]);

  return (
    <div className="absolute top-14 right-2 w-full max-w-sm bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20 transition-all">
      {/* Close Button */}
      <button
        onClick={() => setProfileOpen(prev => !prev)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar user={user.name} />
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h2>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user.followers} followers • {user.totalBlogs} blogs
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="relative bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          {user.bio || 'No bio added yet.'}
        </p>
      </div>
      <div className="mt-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">More Info</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc pl-6">
            <li>Member since: Jan 2023</li>
            <li>Recent activity: Active 2 days ago</li>
          </ul>
        </div>
    </div>
  );
};

export default UserProfile;
