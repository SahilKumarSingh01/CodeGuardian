import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Callback from "./pages/Callback.jsx";
import Explore from "./pages/Explore.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import About from "./pages/About.jsx";
import Docs from "./pages/Docs.jsx";
import SoftwareUpload from './pages/SoftwareUpload.jsx'
import MyUploads from './pages/MyUploads.jsx';
// import Login from "./pages/Login.jsx";
// import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          {/* Global wrapper with gradient + text colors */}
          <div
            className="
              min-h-screen 
              flex flex-col
              bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100
              dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
              text-slate-800 dark:text-slate-100
            "
          >
            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              style={{ marginTop: "4rem" }}
            />

            {/* Common Header */}
            <Header />

            {/* Page content */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/google/callback" element={<Callback strategy="google" />}/>
                <Route path="/upload-new" element={<SoftwareUpload/>}/>
                <Route path="/about" element={<About />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/my-uploads" element={<MyUploads/>}/>
                <Route path="/explore" element={<Explore/>}/>
              </Routes>
            </main>

            {/* Common Footer */}
            <Footer />
          </div>

        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
