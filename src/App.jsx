import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import Profile from "./pages/Profile";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" />}
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" />}
        />

        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/mybooks"
          element={token ? <MyBooks /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={token ? <Profile /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const styles = {
  app: {
    minHeight: "100vh",
    background:
  "radial-gradient(circle at top, #1a2740 0%, #0b1020 40%, #070b14 100%)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  },
};