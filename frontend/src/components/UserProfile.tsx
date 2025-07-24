import { useState } from "react";
import { X, Pen, Eye, EyeOff } from "lucide-react";
import { Avatar } from "./Avatar";

export default function UserProfilePage() {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  const [passwordData, setPasswordData] = useState({ old: "", new: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const user = {
        name: "John Doe",
        avatar: "https://via.placeholder.com/150",
        followers: ["User1", "User2", "User3"],
        following: ["User4", "User5"],
        blogCount: 10,
    };
    function onUpdateBio(updatedBio: string) {
        // Simulate an API call to update the bio
        console.log("Updating bio:", updatedBio);

        // Here you would typically make an API call, e.g., using fetch or axios
        // Example:
        // fetch('/api/updateBio', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ bio: updatedBio }),
        // })
        // .then(response => response.json())
        // .then(data => console.log("Bio updated successfully:", data))
        // .catch(error => console.error("Error updating bio:", error));

        // For now, just log success
        alert("Bio updated successfully!");
    }

  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl mt-6 pt-15">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">Your profile page</p>
        </div>
        <button onClick={() => window.history.back()}>
          <X className="w-5 h-5 text-gray-500 dark:text-gray-300 hover:text-red-500" />
        </button>
      </div>

      {/* Avatar and Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
         <Avatar user={user.name}/>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user?.followers.length || []}</div>
            <button onClick={() => setShowFollowers(true)} className="text-sm text-blue-500 hover:underline">Followers</button>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user?.following.length || []}</div>
            <button onClick={() => setShowFollowing(true)} className="text-sm text-blue-500 hover:underline">Following</button>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user?.blogCount || []}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Blogs</div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Bio</h2>
          <button onClick={() => setEditingBio(!editingBio)}><Pen className="w-4 h-4 text-gray-500 dark:text-gray-300" /></button>
        </div>
        {editingBio ? (
          <div className="mt-2">
            <textarea
              className="w-full border dark:bg-gray-800 dark:text-white p-2 rounded-lg text-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <button
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              onClick={() => {
                onUpdateBio(bio);
                setEditingBio(false);
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{bio || "No bio added yet."}</p>
        )}
      </div>

      {/* Password Update */}
      <div className="mt-6">
        <button
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showPasswordForm ? "Cancel Password Update" : "Update Password"}
        </button>

        {showPasswordForm && (
          <div className="mt-3 space-y-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
              value={passwordData.old}
              onChange={(e) => setPasswordData({ ...passwordData, old: e.target.value })}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:text-white"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-500 flex items-center gap-1">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} Show Passwords
            </button>
            <button
              onClick={() => onUpdatePassword(passwordData.old, passwordData.new)}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Update
            </button>
          </div>
        )}
      </div>

      {/* Followers List Card */}
      {showFollowers && (
        <ListCard
          title="Followers"
          items={user?.followers || []}
          onClose={() => setShowFollowers(false)}
        />
      )}

      {/* Following List Card */}
      {showFollowing && (
        <ListCard
          title="Following"
          items={user?.following || []}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </div>
  );
}

// Separate Reusable Component
function ListCard({ title, items, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 dark:text-white hover:text-red-500">
          <X size={20} />
        </button>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-300">No {title.toLowerCase()} yet.</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((user) => (
              <li key={user.id} className="flex items-center gap-3">
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
