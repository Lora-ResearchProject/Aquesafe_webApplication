import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "../Pages/AdminDashboard";
import * as authService from "../services/authService";

vi.mock("../services/authService", () => ({
  fetchAllUsers: vi.fn(),
  createUser: vi.fn(),
  deleteUser: vi.fn(),
}));

describe("AdminDashboard Page", () => {
  const mockUsers = [
    { _id: "1", name: "Alice", email: "alice@example.com", role: "user" },
    { _id: "2", name: "Bob", email: "bob@example.com", role: "admin" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user table after loading", async () => {
    authService.fetchAllUsers.mockResolvedValue(mockUsers);
    render(<AdminDashboard />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("All Users")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  it("opens create user form and shows validation errors", async () => {
    authService.fetchAllUsers.mockResolvedValue([]);
    render(<AdminDashboard />);

    await waitFor(() => screen.getByText("Create User"));
    fireEvent.click(screen.getByText("Create User"));

    fireEvent.click(screen.getByText("Create")); // submit with empty fields

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });

  it("creates a user and closes modal", async () => {
    authService.fetchAllUsers.mockResolvedValue([]);
    authService.createUser.mockResolvedValue({ data: { _id: "3", name: "New", email: "new@example.com", role: "user" } });

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText("Create User"));
    fireEvent.click(screen.getByText("Create User"));

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "new@example.com" } });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.queryByText("Create New User")).not.toBeInTheDocument();
      expect(screen.getByText("User credentials sent to new@example.com successfully!")).toBeInTheDocument();
    });
  });

  it("deletes a user after confirmation", async () => {
    authService.fetchAllUsers.mockResolvedValue(mockUsers);
    authService.deleteUser.mockResolvedValue({});

    window.confirm = vi.fn(() => true); // mock confirm always true

    render(<AdminDashboard />);

    await waitFor(() => screen.getByText("Alice"));
    fireEvent.click(screen.getAllByText("Delete")[0]);

    await waitFor(() => {
      expect(screen.getByText("User deleted successfully!")).toBeInTheDocument();
    });
  });
});
