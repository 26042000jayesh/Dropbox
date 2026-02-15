import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import FileViewerPage from "./pages/FileViewerPage";


function ProtectedRoute({ children }) {
  const token = useSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/view/:file_id" element={<ProtectedRoute><FileViewerPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
