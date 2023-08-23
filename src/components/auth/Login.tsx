import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Banner, { BannerTypesEnum } from "../../services/Banner";
import { useAuth } from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import { AxiosError } from "axios";

interface Errors {
  email: { isError: boolean; message?: string };
  password: { isError: boolean; message?: string };
}

const LoginForm = () => {
  const { setupCookie } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isLoading, data, error, makeApiCall } = useApi<{
    token: string;
  }>();
  const [errorObject, setErrorObject] = useState<Errors>({
    email: { isError: true, message: "Please enter email" },
    password: { isError: true, message: "Please enter password" },
  });

  useEffect(() => {
    if (!isLoading && data) {
      setupCookie(data.token);
      navigate("/dashboard");
    }
  }, [isLoading, data]);
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeApiCall("/auth/login", {
        method: "POST",
        data: {
          email,
          password,
        },
      });
    } catch (error) {
      return (
        <Banner
          type={BannerTypesEnum.ERROR}
          message={(error as Error).message}
        />
      );
    }
  };

  const isSubmitDisabled = useMemo((): boolean => {
    return (
      Object.values(errorObject).some((field) => field.isError) ||
      email === "" ||
      password === ""
    );
  }, [errorObject, email, password]);

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    setErrorObject((prevErrors) => ({
      ...prevErrors,
      email: {
        isError: value === "",
        message: value === "" ? `Please enter email` : "",
      },
    }));
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    setErrorObject((prevErrors) => ({
      ...prevErrors,
      password: {
        isError: value === "",
        message: value === "" ? `Please enter password` : "",
      },
    }));
  };
  if (error) {
    const responseData = (error as AxiosError).response?.data;
    const errorMessage = responseData as { message: string };
    return (
      <Banner type={BannerTypesEnum.ERROR} message={errorMessage.message} />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              data-testid="login-email"
              type="email"
              value={email}
              onChange={onChangeEmail}
              className="block w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
            {errorObject.email.isError && (
              <div>{errorObject.email.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              value={password}
              data-testid="login-password"
              onChange={onChangePassword}
              className="block w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
          </div>
          {errorObject.password.isError && (
            <div>{errorObject.password.message}</div>
          )}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-2 rounded hover:bg-blue-600 ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
