import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProfilePage from "../Pages/ProfilePage";
import * as authService from "../services/authService";

vi.mock("../services/authService", () => ({
  fetchUserDetails: vi.fn(),
  updateUserDetails: vi.fn(),
  changePassword: vi.fn(),
}));

vi.mock("../Components/Profile/UserDetails", () => ({
  default: ({ user, onUpdate }) => (
    <div>
      <p>Mock UserDetails: {user.name}</p>
      <button onClick={() => onUpdate("Updated Name", user.email)}>Update</button>
    </div>
  ),
}));

vi.mock("../Components/Profile/ChangePassword", () => ({
  default: ({ onChangePassword }) => (
    <div>
      <p>Mock ChangePassword</p>
      <button onClick={() => onChangePassword("oldPass", "newPass")}>Change Password</button>
    </div>
  ),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    authService.fetchUserDetails.mockReturnValue(new Promise(() => {}));
    render(<ProfilePage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders user info after load", async () => {
    authService.fetchUserDetails.mockResolvedValue({ name: "John", email: "john@example.com" });
    render(<ProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Mock UserDetails: John")).toBeInTheDocument();
    });
  });

  it("calls updateUserDetails when update is triggered", async () => {
    authService.fetchUserDetails.mockResolvedValue({ name: "John", email: "john@example.com" });
    authService.updateUserDetails.mockResolvedValue({});

    render(<ProfilePage />);
    await waitFor(() => screen.getByText("Mock UserDetails: John"));

    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      expect(authService.updateUserDetails).toHaveBeenCalledWith("Updated Name", "john@example.com");
    });
  });

  it("calls changePassword when triggered", async () => {
    authService.fetchUserDetails.mockResolvedValue({ name: "John", email: "john@example.com" });
    authService.changePassword.mockResolvedValue({});

    render(<ProfilePage />);
    await waitFor(() => screen.getByText("Mock ChangePassword"));

    fireEvent.click(screen.getByText("Change Password"));
    expect(authService.changePassword).toHaveBeenCalledWith("oldPass", "newPass");
  });
});