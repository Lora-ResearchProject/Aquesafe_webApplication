import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataPipeLinePage from "../Pages/DataPipeLinePage";
import { checkLoraStatus } from "../services/loraStatusService";

vi.mock("../services/loraStatusService", () => ({
  checkLoraStatus: vi.fn(),
}));

vi.mock("../Components/dashboard/LoraMessageForm", () => ({
  default: ({ onSubmit }) => (
    <button onClick={() => onSubmit({ id: "123|test" })}>Mock Submit</button>
  ),
}));

describe("DataPipeLinePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pipeline steps and form", () => {
    render(<DataPipeLinePage />);
    expect(screen.getByText("Data Pipeline Test Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Pipeline Processing Steps")).toBeInTheDocument();
    expect(screen.getByText("Mock Submit")).toBeInTheDocument();
  });

  it("handles and displays successful pipeline result", async () => {
    checkLoraStatus.mockResolvedValue({
      compression: true,
      checksum: true,
      encryption: true,
      decryption: true,
      verified: true,
      decompression: true,
      endToEnd: true,
      decompressed: { id: "123|test", m: 5 },
      intermediate: {
        compressed: "abc123",
        withChecksum: "abc456",
        encrypted: "abc789",
        decrypted: "abc456",
        verified: "abc123",
      },
      insights: {
        originalSize: 42,
        compressedSize: 21,
        compressionRatio: "50.00%",
        finalEncryptedSize: 35,
      },
    });

    render(<DataPipeLinePage />);
    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(screen.getByText("Send payload")).toBeInTheDocument();
      expect(screen.getByText("Validation Summary")).toBeInTheDocument();
      expect(screen.getByText("Original Size:")).toBeInTheDocument();
    });
  });

  it("shows error if pipeline fails", async () => {
    checkLoraStatus.mockResolvedValue({ error: "Decryption failed" });

    render(<DataPipeLinePage />);
    fireEvent.click(screen.getByText("Mock Submit"));

    await waitFor(() => {
      expect(screen.getByText(/error: decryption failed/i)).toBeInTheDocument();
    });
  });
});
