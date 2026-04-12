import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <AuthContextProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </AuthContextProvider>
  </BrowserRouter>

);
