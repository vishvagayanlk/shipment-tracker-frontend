import { FC } from "react";
import LoginForm from "./auth/Login";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const Protected: FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <LoginForm />;
};

export default Protected;
