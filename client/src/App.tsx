import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import Protected from "./components/Protected";
import NotFound from "./pages/NotFound";

const App = () => {
  const { user } = useAuth();

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
      <Route path="*" element={ <NotFound />} />
    </Routes>
  );
};

export default App;
