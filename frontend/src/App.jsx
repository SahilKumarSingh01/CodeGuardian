import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import SoftwareUpload from './pages/SoftwareUpload.jsx';
import MyUploads from './pages/MyUploads.jsx';
import SoftwareView from "./pages/SoftwareView.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";

// Wrapper component to conditionally render Header
function Layout({ children }) {
  const location = useLocation();
  const hideHeaderRoutes = ["/ticket"]; // base path to hide header

  // Check if current route starts with any of the hideHeaderRoutes
  const hideHeader = hideHeaderRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideHeader && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div
            className="
              min-h-screen 
              flex flex-col
              bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100
              dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
              text-slate-800 dark:text-slate-100
            "
          >
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

            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/google/callback" element={<Callback strategy="google" />}/>
                <Route path="/upload-new" element={<SoftwareUpload/>}/>
                <Route path="/about" element={<About />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/my-uploads" element={<MyUploads/>}/>
                <Route path="/wishlist" element={<Wishlist/>}/>
                <Route path="/explore" element={<Explore/>}/>
                <Route path="/view/:id" element={<SoftwareView />} />
                <Route path="/ticket/:id?" element={<TicketsPage />} />
              </Routes>
            </Layout>

          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
