import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "../Pages/ResetPasswordPage";
import * as authService from "../services/authService";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../services/authService", () => ({
  resetPassword: vi.fn(),
}));

describe("ResetPasswordPage", () => {
  const renderWithRouter = (token = "123token") => {
    window.history.pushState({}, "", `/reset-password/${token}`);
    return render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders the form inputs", () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows error if passwords do not match", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "abc12345" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "xyz99999" },
    });
    fireEvent.click(screen.getByRole("button"));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("submits successfully with matching passwords", async () => {
    authService.resetPassword.mockResolvedValue({ message: "Password reset successful" });
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "test@1234" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "test@1234" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalled();
      expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
    });
  });

  it("shows backend error if reset fails", async () => {
    authService.resetPassword.mockRejectedValue(new Error("Something went wrong"));
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "test@1234" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "test@1234" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});