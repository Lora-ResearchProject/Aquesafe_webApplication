import { render, screen, waitFor } from "@testing-library/react";
import VesselPage from "../Pages/VesselPage";
import * as locationService from "../services/locationService";

vi.mock("../services/locationService", () => ({
  fetchVessels: vi.fn(),
  fetchLatestVesselLocations: vi.fn(),
}));

vi.mock("../Components/weather/WeatherFinder", () => ({
  default: ({ lat, lon }) => <span>Weather: {lat}, {lon}</span>,
}));

describe("VesselPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading initially", () => {
    locationService.fetchVessels.mockReturnValue(new Promise(() => {}));
    render(<VesselPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error message on fetch failure", async () => {
    locationService.fetchVessels.mockRejectedValue(new Error("Network error"));
    render(<VesselPage />);
    await waitFor(() => {
      expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
    });
  });

  it("renders vessel table with location and weather", async () => {
    locationService.fetchVessels.mockResolvedValue([
      { vesselId: "v1", vesselName: "Sea Hawk" },
      { vesselId: "v2", vesselName: "Blue Whale" },
    ]);

    locationService.fetchLatestVesselLocations.mockResolvedValue([
      { vesselId: "v1", lat: 7.2, lng: 80.5, dateTime: "2024-05-01T10:00:00Z" },
    ]);

    render(<VesselPage />);

    await waitFor(() => {
      expect(screen.getByText("Sea Hawk")).toBeInTheDocument();
      expect(screen.getByText("Blue Whale")).toBeInTheDocument();
      expect(screen.getByText("7.2")).toBeInTheDocument();
      expect(screen.getByText("80.5")).toBeInTheDocument();
      expect(screen.getByText("Weather: 7.2, 80.5")).toBeInTheDocument();
      expect(screen.getAllByText(/No Location|No Data/)).toHaveLength(2);
    });
  });
});