import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import {ToastContainer} from 'react-toastify'
import {AuthProvider} from'./context/AuthContext.jsx';

import Home from "./pages/Home.jsx";
import Callback from "./pages/Callback.jsx";
// import Explore from "./pages/Explore.jsx";
import About from "./pages/About.jsx";
// import Login from "./pages/Login.jsx";
// import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000} // Close after 3 seconds
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Options: "light", "dark", "colored"
          style={{ marginTop: '4rem' }} // adjust based on your navbar height

        />
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/explore" element={<Explore />} /> */}
            <Route path='/auth/google/callback' element={<Callback strategy="google" />} />

            <Route path="/about" element={<About />} />
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
