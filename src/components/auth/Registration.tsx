import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useApi from "../../hooks/useApi";
import Banner, { BannerTypesEnum } from "../../services/Banner";

interface Errors {
  name: { isError: boolean; message?: string };
  email: { isError: boolean; message?: string };
  password: { isError: boolean; message?: string };
  role: { isError: boolean; message?: string };
}

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const { setupCookie } = useAuth();
  const navigate = useNavigate();
  const { isLoading, data, error, makeApiCall } = useApi<{
    token: string;
  }>();
  const [errorObject, setErrorObject] = useState<Errors>({
    name: { isError: true, message: "Please enter name" },
    email: { isError: true, message: "Please enter email" },
    password: { isError: true, message: "Please enter password" },
    role: { isError: true, message: "Please enter role" },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorObject((prevErrors) => ({
      ...prevErrors,
      [name]: {
        isError: value === "",
        message: value === "" ? `Please enter ${name.toLowerCase()}` : "",
      },
    }));
  };
  useEffect(() => {
    if (!isLoading && data) {
      setupCookie(data.token);
      navigate("/dashboard");
    }
  }, [isLoading, data]);
  const isSubmitDisabled = useMemo((): boolean => {
    return (
      Object.values(errorObject).some((field) => field.isError) ||
      Object.values(formData).some((value) => value === "")
    );
  }, [error, formData]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      makeApiCall("/auth/signup", {
        method: "POST",
        data: formData,
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
  if (error) {
    const responseData = (error as AxiosError).response?.data;
    const errorMessage = responseData as { message: string };
    return (
      <Banner type={BannerTypesEnum.ERROR} message={errorMessage.message} />
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Registration</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name:</label>
            <input
              type="text"
              name="name"
              data-testid="registration-name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
            {errorObject.name.isError && <div>{errorObject.email.message}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              data-testid="registration-email"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
            {errorObject.email.isError && (
              <div>{errorObject.email.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              data-testid="registration-password"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
            {errorObject.password.isError && (
              <div>{errorObject.password.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role:</label>
            <input
              type="text"
              name="role"
              placeholder="Role"
              data-testid="registration-role"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded shadow-sm focus:ring focus:ring-blue-300"
            />
            {errorObject.role.isError && <div>{errorObject.role.message}</div>}
          </div>
          <button
            type="submit"
            data-testid="registration-button"
            className={`w-full py-2 rounded hover:bg-blue-600 ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
