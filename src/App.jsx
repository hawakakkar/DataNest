import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import Search from "./pages/Search";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";


function App() {
  return (
    <Routes>
      {/* Public Home */}
      <Route path="/" element={<Home />} />

      {/* Dashboard */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/documents" element={<Documents />} />

        <Route path="/search" element={<Search />} />

        <Route path="/analytics" element={<Analytics />} />

        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
