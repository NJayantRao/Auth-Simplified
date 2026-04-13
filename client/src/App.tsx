import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import Protected from "./components/Protected";
import { useEffect } from "react";

const App = () => {
  const { user, getUser } = useAuth();
  console.log(user);

  useEffect(() => {
    if (!user) {
      getUser();
      console.log("hitted");
    }
  }, [user]);

  console.log(user);
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
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
