import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router";
import { Spinner } from "./ui/spinner";

const Protected = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to={"/sign-in"} />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default Protected;
