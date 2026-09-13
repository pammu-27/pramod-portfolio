import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/public/Login";
import AdsLanding from "./pages/public/AdsLanding";
import PublicGate from "./components/public/PublicGate";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Profile from "./pages/admin/Profile";
import Projects from "./pages/admin/Projects";
import Skills from "./pages/admin/Skills";
import Experience from "./pages/admin/Experience";
import Education from "./pages/admin/Education";
import Certifications from "./pages/admin/Certifications";
import Messages from "./pages/admin/Messages";
import Ads from "./pages/admin/Ads";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================
            PUBLIC PORTFOLIO
        ======================================== */}

        <Route
          path="/"
          element={<PublicGate />}
        />


        {/* ========================================
            STANDALONE ADVERTISING PAGE
        ======================================== */}

        <Route
          path="/ads"
          element={<AdsLanding />}
        />


        {/* ========================================
            ADMIN LOGIN
        ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ========================================
            PROTECTED ADMIN AREA
        ======================================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* Dashboard */}
            <Route
              index
              element={<AdminDashboard />}
            />

            {/* Profile */}
            <Route
              path="profile"
              element={<Profile />}
            />

            {/* Projects */}
            <Route
              path="projects"
              element={<Projects />}
            />

            {/* Skills */}
            <Route
              path="skills"
              element={<Skills />}
            />

            {/* Experience */}
            <Route
              path="experience"
              element={<Experience />}
            />

            {/* Education */}
            <Route
              path="education"
              element={<Education />}
            />

            {/* Certifications */}
            <Route
              path="certifications"
              element={<Certifications />}
            />

            {/* Messages */}
            <Route
              path="messages"
              element={<Messages />}
            />

            {/* Advertisements */}
            <Route
              path="ads"
              element={<Ads />}
            />

            {/* Settings */}
            <Route
              path="settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* ========================================
            FALLBACK
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;