import { render, fireEvent } from "@testing-library/react";
import axios, { AxiosError } from "axios";
import LoginForm from "./Login";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vitest } from "vitest";
import { AuthProvider } from "../../services/AuthProvider";

const mockMakeApiCall = vitest.fn();
// Mock the useApi hook and provide the mockMakeApiCall function

describe("LoginForm", () => {
  afterEach(() => {
    vitest.clearAllMocks();
  });
  it("renders the login form", () => {
    vitest.mock("./useApi", () => ({
      __esModule: true,
      default: vitest.fn(() => ({
        isLoading: false,
        error: undefined,
        data: undefined,
        makeApiCall: mockMakeApiCall,
      })),
    }));
    const { getByTestId, getByRole } = render(
      <AuthProvider>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(getByTestId("login-email")).toBeDefined();
    expect(getByTestId("login-password")).toBeDefined();
    expect(getByRole("button", { name: "Login" })).toBeDefined();
  });

  it("submits the form and redirects on successful login", async () => {
    vitest.mock("./useApi", () => ({
      __esModule: true,
      default: vitest.fn(() => ({
        isLoading: false,
        data: { token: "mockToken" },
        error: undefined,
        makeApiCall: mockMakeApiCall,
      })),
    }));
    const { getByTestId } = render(
      <AuthProvider>
        <MemoryRouter></MemoryRouter>
      </AuthProvider>,
    );
    const emailField = getByTestId("login-email");
    fireEvent.change(emailField, {
      target: { value: "test@example.com" },
    });
    const passwordField = getByTestId("login-password");
    fireEvent.change(passwordField, {
      target: { value: "password" },
    });
  });
});
