import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GatewayPage from "../Pages/GatewayPage";
import * as gatewayService from "../services/gatewayService";

vi.mock("../services/gatewayService", () => ({
  fetchGateways: vi.fn(),
  deleteGateway: vi.fn(),
  updateGateway: vi.fn(),
  createGateway: vi.fn(),
}));

vi.mock("../utils/auth", () => ({
  getUserRole: () => "admin",
}));

vi.mock("../Components/weather/WeatherFinder", () => ({
  default: () => <span>Weather</span>,
}));

vi.mock("../Components/gateway/GatewayForm", () => ({
  default: ({ initialData, onSubmit }) => (
    <div>
      <p>Mock Form: {initialData.gatewayId}</p>
      <button onClick={() => onSubmit({ ...initialData, gatewayName: "Updated" })}>Submit</button>
    </div>
  ),
}));

vi.mock("../Components/gateway/GatewayPopup", () => ({
  default: ({ isOpen, onClose, children }) => isOpen ? <div>{children}</div> : null,
}));

describe("GatewayPage", () => {
  beforeEach(() => vi.clearAllMocks());

  const mockGateways = [
    { _id: "1", gatewayId: "101", gatewayName: "Main Gate", lat: "7.5", lng: "80.1", status: "Active" },
  ];

  it("renders loading state", () => {
    gatewayService.fetchGateways.mockReturnValue(new Promise(() => {}));
    render(<GatewayPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays fetched gateways and allows delete", async () => {
    gatewayService.fetchGateways.mockResolvedValue(mockGateways);
    gatewayService.deleteGateway.mockResolvedValue();
    window.confirm = vi.fn(() => true);

    render(<GatewayPage />);

    await waitFor(() => {
      expect(screen.getByText("Main Gate")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Delete"));
    await waitFor(() => {
      expect(gatewayService.deleteGateway).toHaveBeenCalledWith("1");
    });
  });

  it("opens modal to create a new gateway", async () => {
    gatewayService.fetchGateways.mockResolvedValue(mockGateways);
    gatewayService.createGateway.mockResolvedValue({ _id: "2", gatewayId: "102", gatewayName: "New Gateway" });

    render(<GatewayPage />);

    await waitFor(() => screen.getByText("Add New Gateway"));
    fireEvent.click(screen.getByText("Add New Gateway"));

    await waitFor(() => {
      expect(screen.getByText("Mock Form: 102")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(gatewayService.createGateway).toHaveBeenCalled();
    });
  });
});