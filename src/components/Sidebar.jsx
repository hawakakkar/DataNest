import { Link, useLocation } from "react-router-dom";

import {
  FiHome,
  FiUploadCloud,
  FiFileText,
  FiMessageSquare,
  FiBarChart2,
  FiSettings,
  FiArrowLeft,
  FiX,
  FiCpu,
  FiBookOpen,
} from "react-icons/fi";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: FiHome,
    },
    {
      to: "/upload",
      label: "Upload",
      icon: FiUploadCloud,
    },
    {
      to: "/documents",
      label: "Documents",
      icon: FiFileText,
    },
    {
      to: "/ai-history",
      label: "AI History",
      icon: FiMessageSquare,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: FiBarChart2,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: FiSettings,
    },
  ];

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-[260px]
          overflow-hidden
          border-r
          border-[#E8DDD2]
          bg-[#F8F3EC]
          text-[#4A3021]
          shadow-[8px_0_30px_rgba(91,56,34,0.08)]

          dark:border-white/10
          dark:bg-[#17110D]
          dark:text-white

          transform
          transition-transform
          duration-300
          ease-in-out

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col px-4 py-5 sm:px-5">
          {/* =====================================================
              MOBILE HEADER
          ===================================================== */}

          <div
            className="
              mb-7
              flex
              items-center
              justify-between
              lg:hidden
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#70472D]
                  text-white
                  shadow-md
                "
              >
                <FiCpu size={25} />
              </div>

              <div>
                <h1
                  className="
                    text-base
                    font-bold
                    leading-none
                    text-[#4A3021]
                    dark:text-white
                  "
                >
                  DataNest AI
                </h1>

                <p
                  className="
                    mt-1
                    text-[9px]
                    text-[#9A8675]
                    dark:text-gray-500
                  "
                >
                  AI Knowledge Platform
                </p>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="
                rounded-xl
                p-2
                text-[#806A59]
                transition
                hover:bg-[#EDE3D8]
                dark:text-gray-300
                dark:hover:bg-white/10
              "
            >
              <FiX size={21} />
            </button>
          </div>

          {/* =====================================================
              LOGO
          ===================================================== */}

          <div
            className="
              mb-9
              hidden
              items-center
              gap-3
              px-2
              lg:flex
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-[12px]
                bg-[#4A3021]
                text-white
                shadow-[0_5px_15px_rgba(112,71,45,0.20)]
                dark:bg-[#4A3021]
              "
            >
              <FiCpu size={25} />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-[17px]
                  font-bold
                  tracking-tight
                  text-[#4A3021]
                  dark:text-white
                "
              >
                DataNest AI
              </h1>

              <p
                className="
                  mt-0.5
                  whitespace-nowrap
                  text-[9px]
                  font-medium
                  text-[#9A8675]
                  dark:text-gray-500
                "
              >
                AI Knowledge Platform
              </p>
            </div>
          </div>

          {/* =====================================================
              NAVIGATION
          ===================================================== */}

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group
                    flex
                    items-center
                    gap-3
                    rounded-[14px]
                    px-3.5
                    py-3
                    text-[13px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      active
                        ? `
                          bg-[#4A3021]
                          text-white
                          shadow-[0_7px_18px_rgba(112,71,45,0.22)]
                        `
                        : `
                          text-[#695548]
                          hover:bg-[#EEE5DB]
                          hover:text-[#4A3021]
                          dark:text-gray-300
                          dark:hover:bg-white/8
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`
                      shrink-0
                      transition-transform
                      duration-200
                      ${
                        active
                          ? "text-white"
                          : "text-[#806A59] group-hover:text-[#70472D] dark:text-gray-400 dark:group-hover:text-[#D8A778]"
                      }
                    `}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* =====================================================
              BOTTOM SECTION
          ===================================================== */}

          <div
            className="
              mt-5
              border-t
              border-[#E3D8CC]
              pt-4
              dark:border-white/10
            "
          >
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="
                group
                flex
                items-center
                gap-3
                rounded-[14px]
                px-3.5
                py-3
                text-[13px]
                font-medium
                text-[#695548]
                transition-all
                duration-200
                hover:bg-[#EEE5DB]
                hover:text-[#4A3021]
                dark:text-gray-300
                dark:hover:bg-white/8
                dark:hover:text-white
              "
            >
              <FiArrowLeft
                size={18}
                className="
                  text-[#806A59]
                  transition-transform
                  duration-200
                  group-hover:-translate-x-0.5
                  dark:text-gray-400
                "
              />

              <span>Back to Home</span>
            </Link>

            {/* =====================================================
                COPYRIGHT
            ===================================================== */}

            <p
              className="
                mt-5
                px-2
                text-[8px]
                leading-4
                text-[#A08D7C]
                dark:text-gray-600
              "
            >
              © 2026 DataNest AI
              <br />
              All rights reserved.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
