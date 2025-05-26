import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "../Pages/ForgotPasswordPage";
import { forgotPassword } from "../services/authService";
import { MemoryRouter } from "react-router-dom";

vi.mock("../services/authService", () => ({
  forgotPassword: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and button", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows success message on successful submission", async () => {
    forgotPassword.mockResolvedValue({ message: "Reset link sent successfully!" });

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(/reset link sent successfully!/i)).toBeInTheDocument();
    });
  });

  it("shows error message on failure", async () => {
    forgotPassword.mockRejectedValue(new Error("Something went wrong"));

    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
