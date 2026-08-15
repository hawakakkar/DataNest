import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8F6F2] dark:bg-[#17110D] transition-colors duration-300">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className="
          flex-1
          flex
          flex-col
          min-w-0
          lg:ml-64
          bg-[#F8F6F2]
          dark:bg-[#30241C]
          transition-colors
          duration-300
        "
      >
        <Header setSidebarOpen={setSidebarOpen} />

        <main
          className="
            flex-1
            p-4
            md:p-6
            lg:p-8
            bg-[#F8F3EC]
            dark:bg-[#0F0B08]
            transition-colors
            duration-300
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
