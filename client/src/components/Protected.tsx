import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "./ui/spinner";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    <Navigate to={"/login"} />;
  }
  return <>{children};</>;
};

export default Protected;
