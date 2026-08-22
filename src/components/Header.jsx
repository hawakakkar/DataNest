import { useEffect, useState } from "react";
import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { supabase } from "../Services/supabase";
import { useSearch } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";

import profile from "../assets/images/profile.jpg";

export default function Header({ setSidebarOpen }) {
  const navigate = useNavigate();

  const { search, setSearch } = useSearch();
  const { darkMode, toggleTheme } = useTheme();

  // Notifications
  const [questionsCount, setQuestionsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile
  const [showProfile, setShowProfile] = useState(false);

  // Logged User
  const [user, setUser] = useState(null);

  // Load logged user
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

  // Admin check
  const isAdmin =
    user?.email === "kkrhawa@gmail.com" ||
    user?.user_metadata?.full_name === "Bibi Hawa Abdul Shukoor";

  // -----------------------------
  // Load Notifications
  // -----------------------------
  useEffect(() => {
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function loadNotifications() {
    const { data: questionList } = await supabase
      .from("questions")
      .select("id");

    setQuestionsCount(questionList?.length || 0);

    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(data || []);
  }

  // -----------------------------
  // Search
  // -----------------------------
  async function handleSearch() {
    if (!search.trim()) return;

    navigate(`/search?q=${encodeURIComponent(search)}`);
  }

  // -----------------------------
  // Logout
  // -----------------------------
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      navigate("/login");
    }
  }

  return (
    <header
      className="
        w-full
        border-b
        border-[#4A3021]
        bg-[#F8F3EC]
        text-[#3E2A1E]
        dark:border-[#493326]
        dark:bg-[#17110D]
        dark:text-white
        px-4
        sm:px-6
        lg:px-8
        py-4
      "
    >
      <div
        className="
          flex
          w-full
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* =========================
            LEFT SIDE
        ========================== */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[14px]
              border
              border-[#E8DED3]
              bg-white
              text-[#8B5E3C]
              transition
              hover:bg-[#F1E7DD]
              dark:border-[#493326]
              dark:bg-[#30241C]
              dark:text-[#D8A778]
              dark:hover:bg-[#3A2A20]
              lg:hidden
            "
          >
            <FiMenu size={23} strokeWidth={1.8} />
          </button>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-2xl
                font-bold
                tracking-tight
                text-[#3E2A1E]
                dark:text-white
                sm:text-3xl
              "
            >
              Dashboard
            </h1>

            <p
              className="
                mt-1
                truncate
                text-xs
                font-medium
                text-[#806A59]
                dark:text-[#B9AAA0]
                sm:text-sm
              "
            >
              Welcome to DataNest AI
            </p>
          </div>
        </div>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div
          className="
            flex
            w-full
            flex-wrap
            items-center
            gap-2
            sm:gap-3
            lg:w-auto
            lg:justify-end
          "
        >
          {/* =========================
              SEARCH
          ========================== */}
          <div
            className="
              relative
              min-w-0
              flex-1
              sm:min-w-[260px]
              lg:w-[360px]
              lg:flex-none
              xl:w-[420px]
            "
          >
            <FiSearch
              onClick={handleSearch}
              size={19}
              strokeWidth={1.8}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                cursor-pointer
                text-[#8B5E3C]
                transition
                hover:text-[#6F472D]
                dark:text-[#D8A778]
                dark:hover:text-white
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Search anything..."
              className="
                h-11
                w-full
                rounded-[15px]
                border
                border-[#E8DED3]
                bg-white
                py-2.5
                pl-11
                pr-4
                text-sm
                text-[#3E2A1E]
                outline-none
                transition
                placeholder:text-[#A99D92]
                hover:border-[#D8C7B8]
                focus:border-[#B98A62]
                focus:ring-2
                focus:ring-[#D8B79A]/30
                dark:border-[#493326]
                dark:bg-[#30241C]
                dark:text-white
                dark:placeholder:text-[#9E8D80]
                dark:hover:border-[#634737]
                dark:focus:border-[#A87954]
                dark:focus:ring-[#A87954]/20
              "
            />
          </div>

          {/* =========================
    DARK MODE
========================== */}
          <button
            onClick={toggleTheme}
            className="
    flex
    h-11
    w-11
    shrink-0
    items-center
    justify-center
    rounded-[14px]
    border
    border-[#E8DED3]
    bg-white
    transition
    hover:bg-[#F1E7DD]
    dark:border-[#493326]
    dark:bg-[#30241C]
    dark:hover:bg-[#3A2A20]
  "
          >
            {darkMode ? (
              <FiSun size={21} strokeWidth={1.8} className="text-[#D8A778]" />
            ) : (
              <FiMoon size={21} strokeWidth={1.8} className="text-[#8B5E3C]" />
            )}
          </button>

          {/* =========================
              NOTIFICATIONS
          ========================== */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#E8DED3]
                bg-white
                text-[#5F5148]
                transition
                hover:bg-[#F1E7DD]
                dark:border-[#493326]
                dark:bg-[#30241C]
                dark:text-white
                dark:hover:bg-[#3A2A20]
              "
            >
              <FiBell size={21} strokeWidth={1.8} />

              {questionsCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-[18px]
                    min-w-[18px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#70472D]
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    shadow-sm
                    dark:bg-[#70472D]
                  "
                >
                  {questionsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-3
                  w-[320px]
                  max-w-[calc(100vw-24px)]
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-[#E8DED3]
                  bg-white
                  shadow-2xl
                  dark:border-[#493326]
                  dark:bg-[#30241C]
                "
              >
                <div
                  className="
                    border-b
                    border-[#E8DED3]
                    p-4
                    dark:border-[#493326]
                  "
                >
                  <h3
                    className="
                      text-base
                      font-bold
                      text-[#3E2A1E]
                      dark:text-white
                    "
                  >
                    Recent AI Questions
                  </h3>
                </div>

                {notifications.length === 0 ? (
                  <p
                    className="
                      p-4
                      text-sm
                      text-[#806A59]
                      dark:text-[#B9AAA0]
                    "
                  >
                    No questions yet.
                  </p>
                ) : (
                  <div className="max-h-80 space-y-1 overflow-y-auto p-2">
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(
                            `/search?q=${encodeURIComponent(item.query)}`,
                          );
                          setShowNotifications(false);
                        }}
                        className="
                          w-full
                          rounded-[14px]
                          p-3
                          text-left
                          transition
                          hover:bg-[#F8F4EE]
                          dark:hover:bg-[#3A2A20]
                        "
                      >
                        <p
                          className="
                            line-clamp-2
                            text-sm
                            font-medium
                            text-[#3E2A1E]
                            dark:text-white
                          "
                        >
                          {item.query}
                        </p>

                        <p
                          className="
                            mt-1.5
                            text-xs
                            text-[#A99D92]
                            dark:text-[#9E8D80]
                          "
                        >
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* =========================
              USER PROFILE
          ========================== */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="
                flex
                items-center
                gap-2
                rounded-[15px]
                border
                border-transparent
                px-2
                py-1.5
                transition
                hover:border-[#E8DED3]
                hover:bg-white
                dark:hover:border-[#493326]
                dark:hover:bg-[#30241C]
                sm:gap-3
                sm:px-2.5
              "
            >
              {/* Profile Image */}
              {isAdmin ? (
                <img
                  src={profile}
                  alt="Profile"
                  className="
                    h-10
                    w-10
                    rounded-full
                    border-2
                    border-[#70472D]
                    object-cover
                    sm:h-11
                    sm:w-11
                  "
                />
              ) : user?.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="
                    h-10
                    w-10
                    rounded-full
                    border-2
                    border-[#70472D]
                    object-cover
                    sm:h-11
                    sm:w-11
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#70472D]
                    text-sm
                    font-bold
                    text-white
                    sm:h-11
                    sm:w-11
                  "
                >
                  {(user?.user_metadata?.full_name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* User Information */}
              <div className="hidden text-left xl:block">
                <p
                  className="
                    max-w-[150px]
                    truncate
                    text-sm
                    font-semibold
                    text-[#3E2A1E]
                    dark:text-white
                  "
                >
                  {user?.user_metadata?.full_name || "User"}
                </p>

                <p
                  className="
                    max-w-[150px]
                    truncate
                    text-[11px]
                    text-[#806A59]
                    dark:text-[#A99D92]
                  "
                >
                  {user?.email}
                </p>

                {user?.user_metadata?.role === "Administrator" && (
                  <span
                    className="
                      mt-1
                      inline-block
                      rounded-lg
                      bg-[#70472D]
                      px-2
                      py-0.5
                      text-[9px]
                      font-semibold
                      text-white
                    "
                  >
                    Administrator
                  </span>
                )}
              </div>

              <FiChevronDown
                size={17}
                strokeWidth={1.8}
                className="
                  hidden
                  text-[#8B5E3C]
                  dark:text-[#D8A778]
                  xl:block
                "
              />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-3
                  w-72
                  max-w-[calc(100vw-24px)]
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-[#E8DED3]
                  bg-white
                  shadow-2xl
                  dark:border-[#493326]
                  dark:bg-[#30241C]
                "
              >
                {/* Profile Info */}
                <div
                  className="
                    border-b
                    border-[#E8DED3]
                    p-5
                    dark:border-[#493326]
                  "
                >
                  <div className="flex items-center gap-4">
                    {isAdmin ? (
                      <img
                        src={profile}
                        alt="Profile"
                        className="
                          h-12
                          w-12
                          rounded-full
                          border-2
                          border-[#70472D]
                          object-cover
                        "
                      />
                    ) : user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="
                          h-14
                          w-14
                          rounded-full
                          border-2
                          border-[#70472D]
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-full
                          bg-[#70472D]
                          text-xl
                          font-bold
                          text-white
                        "
                      >
                        {(user?.user_metadata?.full_name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          font-bold
                          text-[#3E2A1E]
                          dark:text-white
                        "
                      >
                        {user?.user_metadata?.full_name || "User"}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          text-[#806A59]
                          dark:text-[#A99D92]
                        "
                      >
                        {user?.email}
                      </p>

                      {user?.user_metadata?.role === "Administrator" && (
                        <span
                          className="
                            mt-2
                            inline-block
                            rounded-lg
                            bg-[#70472D]
                            px-2
                            py-1
                            text-[10px]
                            font-semibold
                            text-white
                          "
                        >
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* My Profile */}
                <button
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/profile");
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-left
                    text-[#3E2A1E]
                    transition
                    hover:bg-[#F8F4EE]
                    dark:text-white
                    dark:hover:bg-[#3A2A20]
                  "
                >
                  <FiUser
                    size={18}
                    strokeWidth={1.8}
                    className="text-[#8B5E3C] dark:text-[#D8A778]"
                  />
                  My Profile
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    px-5
                    py-4
                    text-left
                    text-[#8B5E3C]
                    transition
                    hover:bg-[#F8F4EE]
                    dark:text-red-400
                    dark:hover:bg-[#3A2A20]
                  "
                >
                  <FiLogOut size={18} strokeWidth={1.8} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
