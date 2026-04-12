import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sign-in"
        element={user ? <Navigate to={"/dashboard"} /> : <SignIn />}
      />
      <Route
        path="/sign-up"
        element={user ? <Navigate to={"/dashboard"} /> : <SignUp />}
      />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
