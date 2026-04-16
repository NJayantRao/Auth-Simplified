import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import Protected from "./components/Protected";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  const { user, isInitialized, getUser } = useAuth();

  // Initialize user on app mount
  useEffect(() => {
    getUser();
  }, []);

  console.log("User:", user);
  console.log("Is Initialized:", isInitialized);
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
      <Route
        path="/forgot-password"
        element={user ? <Navigate to={"/dashboard"} /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={user ? <Navigate to={"/dashboard"} /> : <ResetPassword />}
      />
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
