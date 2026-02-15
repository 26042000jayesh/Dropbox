import { Routes, Route } from "react-router-dom";

function LoginPage() {
  return <h2>Login Page</h2>;
}

function SignupPage() {
  return <h2>Signup Page</h2>;
}

function HomePage() {
  return <h2>Home Page</h2>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
