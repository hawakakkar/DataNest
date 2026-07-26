import { useEffect, useState } from "react";
import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { supabase } from "../Services/supabase";
import { useSearch } from "../context/SearchContext";
import profile from "../assets/images/profile.jpg";

export default function Header({ setSidebarOpen }) {
  const [questionsCount, setQuestionsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  const { search, setSearch } = useSearch();

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
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    setNotifications(data || []);
  }

  async function handleSearch() {
    if (!search.trim()) return;

    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .or(`title.ilike.%${search}%,file_name.ilike.%${search}%`)
      .limit(1);

    if (docs?.length > 0) {
      navigate(`/documents?search=${encodeURIComponent(search)}`);
      return;
    }

    const { data: questions } = await supabase
      .from("questions")
      .select("*")
      .or(`query.ilike.%${search}%,answer.ilike.%${search}%`)
      .limit(1);

    if (questions?.length > 0) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      return;
    }

    alert("No results found.");
  }

  return (
    <header
      className="
        bg-white
        border-b
        border-[#ECE6DE]
        px-4
        md:px-8
        py-4
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            lg:hidden
            w-11
            h-11
            rounded-xl
            bg-[#F8F6F2]
            hover:bg-[#EFE7DE]
            transition
            flex
            items-center
            justify-center
          "
        >
          <FiMenu size={24} className="text-[#8B5E3C]" />
        </button>

        <div>
          <h1
            className="text-3xl font-bold text-[#5A3F2A]
           px-4 md:px-8"
          >
            Dashboard
          </h1>

          <p className="text-[#72685F] text-sm mt-1 px-4 md:px-8">
            Welcome to DataNest AI
          </p>
        </div>
      </div>

      {/* Right */}
      <div
        className="
          flex
          flex-col
          md:flex-row
          items-stretch
          md:items-center
          gap-4
          w-full
          lg:w-auto
        "
      >
        {/* Search */}
        <div className="relative w-full md:w-[420px]">
          <FiSearch
            onClick={handleSearch}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#8B5E3C]
              cursor-pointer
            "
            size={20}
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
            placeholder="Search documents..."
            className="
              w-full
              border
              border-[#ECE6DE]
              rounded-2xl
              py-3
              pl-12
              pr-4
              bg-[#F8F6F2]
              text-[#2F2A27]
              placeholder:text-[#9B938C]
              focus:outline-none
              focus:ring-2
              focus:ring-[#8B5E3C]
            "
          />
        </div>

        {/* Notifications */}
        <div className="relative self-end md:self-auto">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              relative
              w-12
              h-12
              rounded-xl
              hover:bg-[#F4EEE8]
              transition
              flex
              items-center
              justify-center
            "
          >
            <FiBell size={24} className="text-[#2F2A27]" />

            {questionsCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-[#8B5E3C]
                  text-white
                  text-[10px]
                  min-w-[18px]
                  h-[18px]
                  px-1
                  rounded-full
                  flex
                  items-center
                  justify-center
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
                mt-3
                w-[320px]
                max-w-[90vw]
                bg-white
                rounded-3xl
                shadow-2xl
                border
                border-[#ECE6DE]
                p-4
                z-50
              "
            >
              <h3 className="font-bold text-[#2F2A27] text-lg mb-4">
                Recent AI Questions
              </h3>

              {notifications.length === 0 ? (
                <p className="text-sm text-[#72685F]">No questions yet.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(item.query)}`);
                        setShowNotifications(false);
                      }}
                      className="
                        w-full
                        text-left
                        p-3
                        rounded-2xl
                        hover:bg-[#F8F6F2]
                        transition
                      "
                    >
                      <p className="text-sm font-medium line-clamp-2 text-[#2F2A27]">
                        {item.query}
                      </p>

                      <p className="text-xs text-[#9B938C] mt-2">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* User Profile */}
        <div className="relative self-end md:self-auto">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="
              flex
              items-center
              gap-3
              px-3
              py-2
              rounded-2xl
              hover:bg-[#F8F6F2]
              transition
            "
          >
            <img
              src={profile}
              alt="Profile"
              className="
                w-11
                h-11
                rounded-full
                object-cover
                border-2
                border-[#8B5E3C]
              "
            />

            <div className="hidden md:block text-left">
              <p className="font-semibold text-[#2F2A27]">
                Bibi Hawa Abdul Shukoor
              </p>

              <p className="text-xs text-[#72685F]">Administrator</p>
            </div>

            <FiChevronDown
              size={18}
              className="hidden md:block text-[#8B5E3C]"
            />
          </button>

          {showProfile && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-72
                max-w-[90vw]
                bg-white
                rounded-3xl
                shadow-2xl
                border
                border-[#ECE6DE]
                overflow-hidden
                z-50
              "
            >
              {/* Header */}
              <div className="p-5 border-b border-[#ECE6DE]">
                <div className="flex gap-4 items-center">
                  <img
                    src={profile}
                    alt="Profile"
                    className="
                      w-14
                      h-14
                      rounded-full
                      object-cover
                      border-2
                      border-[#8B5E3C]
                    "
                  />

                  <div>
                    <p className="font-bold text-[#2F2A27]">
                      Bibi Hawa Abdul Shukoor
                    </p>

                    <p className="text-sm text-[#72685F]">Administrator</p>
                  </div>
                </div>
              </div>

              {/* Menu */}

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-[#F8F6F2]
                  transition
                  text-[#2F2A27]
                "
              >
                <FiUser size={18} />
                My Profile
              </button>

              <button
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-[#F8F6F2]
                  transition
                  text-[#8B5E3C]
                "
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
