import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  setupCookie: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthenticated(!!cookies.token);
  }, [cookies.token]);

  const setupCookie = (token: string) => {
    setCookie("token", token, {
      sameSite: "strict",
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeCookie("token");
    setIsAuthenticated(false);
  };

  const authContextValue = {
    isAuthenticated,
    setupCookie,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
