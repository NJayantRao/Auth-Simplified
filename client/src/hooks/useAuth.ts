import { useAuthContext } from "@/context/AuthContext";
import apiInstance from "@/services/auth.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } = useAuthContext();

  type RegisterData = {
    name: string;
    email: string;
    password: string;
  };

  type LoginData = {
    email: string;
    password: string;
  };
  const navigate = useNavigate();
  const register = async ({ name, email, password }: RegisterData) => {
    try {
      setIsLoading(true);
      const res = await apiInstance.post("/auth/register", {
        name,
        email,
        password,
      });
      //   console.log(res);

      toast.success(res.data?.message || "Register successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async ({ email, password }: LoginData) => {
    try {
      setIsLoading(true);
      const res = await apiInstance.post("/auth/login", {
        email,
        password,
      });
      // console.log(res);
      toast.success(res.data?.message || "Login successfully");
      navigate("/dashboard");
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
      setUser(null)
      toast.success(res.data?.message || "Logout successfully");
      navigate("/");
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
      setUser(res?.data?.data)
    } catch (error: any) {
       if (error?.response?.status === 401) {
      setUser(null); 
      return;
       }
      console.log(error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch user data",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async () => {
    try {
      const res = await apiInstance.post("/users/profile");
      console.log(res);

    } catch (error: any) {
      console.log(error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Failed to fetch user data",
      );
    }
  };

  return { user, isLoading, register, login, logout, getUser, verifyEmail };
};
