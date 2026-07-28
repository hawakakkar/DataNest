import profile from "../assets/images/profile.jpg";
import { useTheme } from "../context/ThemeContext";
import { FiUser, FiMail, FiShield, FiDatabase } from "react-icons/fi";

export default function Profile() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#F8F6F2] text-[#2F2A27]"
      }`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-3xl shadow-xl p-10 ${
          darkMode ? "bg-[#1E1E1E]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-6">
          <img
            src={profile}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-[#8B5E3C] object-cover"
          />

          <div>
            <h1 className="text-4xl font-bold">Bibi Hawa Abdul Shukoor</h1>

            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Administrator
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="border rounded-2xl p-6">
            <FiUser className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Full Name</h3>
            <p>Bibi Hawa Abdul Shukoor</p>
          </div>

          <div className="border rounded-2xl p-6">
            <FiMail className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Email</h3>
            <p>datanest24@gmail.com</p>
          </div>

          <div className="border rounded-2xl p-6">
            <FiShield className="text-[#8B5E3C] mb-2" size={22} />
            <h3 className="font-semibold">Role</h3>
            <p>Administrator</p>
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
