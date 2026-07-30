import { useEffect, useState } from "react";
import profile from "../assets/images/profile.jpg";
import { useTheme } from "../context/ThemeContext";
import { FiUser, FiMail, FiShield, FiDatabase, FiCamera } from "react-icons/fi";
import { supabase } from "../Services/supabase";

export default function Profile() {
  const { darkMode } = useTheme();

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = user?.user_metadata?.role === "Administrator";

  const [uploading, setUploading] = useState(false);

  async function handleProfileImage(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const fileName = `${user.id}-${Date.now()}`;

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: avatarUrl,
        },
      });

      if (updateError) throw updateError;

      setUser((prev) => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          avatar_url: avatarUrl,
        },
      }));

      alert("Profile photo updated successfully.");
    } catch (err) {
      alert(err.message || "Failed to upload profile photo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={`w-full h-full p-8 ${
        darkMode ? "text-white" : "text-[#2F2A27]"
      }`}
    >
      <div
        className={`w-full max-w-6xl mx-auto rounded-3xl shadow-xl p-10 ${
          darkMode ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28">
            {isAdmin ? (
              <img
                src={profile}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-[#8B5E3C] object-cover"
              />
            ) : user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-[#8B5E3C] object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-[#8B5E3C] bg-[#8B5E3C] text-white flex items-center justify-center text-4xl font-bold">
                {(user?.user_metadata?.full_name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <input
              type="file"
              id="profile-upload"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImage}
            />

            <label
              htmlFor="profile-upload"
              className="
      absolute
      bottom-1
      right-1
      w-9
      h-9
      rounded-full
      bg-[#8B5E3C]
      border-2
      border-white
      flex
      items-center
      justify-center
      cursor-pointer
      hover:scale-110
      transition
      text-white
      shadow-lg
    "
            >
              <FiCamera size={18} />
            </label>
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {user?.user_metadata?.full_name || "User"}
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {user?.user_metadata?.role || "User"}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="border rounded-2xl p-6">
            <FiUser className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Full Name</h3>
            <p>{user?.user_metadata?.full_name || "-"}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <FiMail className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Email</h3>
            <p>{user?.email || "-"}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <FiShield className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Role</h3>
            <p>{user?.user_metadata?.role || "User"}</p>
          </div>

          <div className="border rounded-2xl p-6">
            <FiDatabase className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Status</h3>
            <p>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
