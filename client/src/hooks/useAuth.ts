import { useAuthContext } from "@/context/AuthContext";
import apiInstance from "@/services/auth.api";
import toast from "react-hot-toast";

export const useAuth = () => {
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
  } = useAuthContext();

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};
  const register = async ({name,email,password}:RegisterData) => {
    try {
      setIsLoading(true);
      const res = await apiInstance.post("/auth/register", {
        name,
        email,
        password,
      });
    //   console.log(res);
          toast.success(res.data?.message || "Register successfully");

    } catch (error: any) {
      console.log(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({email,password}:LoginData) => {
    try {
      setIsLoading(true);
      const res = await apiInstance.post("/auth/login", {
        email,
        password,
      });
      console.log(res);
      toast.success(res.data?.message || "Login successfully");
    } catch (error: any) {
      console.log(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const res = await apiInstance.post("/auth/logout");
      // console.log(res);
      toast.success(res.data?.message || "Logout successfully");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }

  };

  const getUser = async () => {
    try {
      setIsLoading(true);
      const res = await apiInstance.get("/users/profile");
      setUser(res.data);
    } catch (error: any) {
      console.log(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  return {user, isLoading, register, login, logout, getUser };
};
