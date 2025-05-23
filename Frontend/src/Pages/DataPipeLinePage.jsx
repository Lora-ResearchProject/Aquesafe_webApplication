import React, { useState } from "react";
import { checkLoraStatus } from "../services/loraStatusService";
import Spinner from "../Components/UI/Spinner";
import LoraMessageForm from "../Components/dashboard/LoraMessageForm";
import {
  HiArrowTurnDownRight,
  HiArrowTurnRightUp,
  HiArrowSmallRight,
} from "react-icons/hi2";

const StatusBox = ({ label, status }) => (
  <div className="flex flex-col items-center text-xs font-medium">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white ${
        status === true
          ? "bg-green-500"
          : status === false
          ? "bg-red-500"
          : "bg-gray-300"
      }`}
    >
      {status === true ? "✓" : status === false ? "×" : "?"}
    </div>
    <span className="text-gray-700 text-[11px] text-center">{label}</span>
  </div>
);

const DataPipeLinePage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await checkLoraStatus(payload);

      if (result.error) {
        throw new Error(result.error);
      }

      setStatus(result);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "An unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-4 mx-auto p-6 h-full">
      {/* Left Section - Flow & Results */}
      <div className="w-3/4 pr-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Data Pipeline Test Dashboard
        </h2>

        {/* Flow Steps Visualization */}
        <div className="mb-6">
          <h4 className="font-semibold text-sm text-gray-600 mb-2 text-center">
            Pipeline Processing Steps
          </h4>
          <div className="grid grid-cols-11 gap-4 bg-gray-50 p-4 rounded-md text-center">
            <StatusBox label="Compress" status={status?.compression} />
            <div className="flex items-center justify-center">
              <HiArrowSmallRight size={25} className="text-gray-500" />
            </div>
            <StatusBox label="Checksum" status={status?.checksum} />
            <div className="flex items-center justify-center">
              <HiArrowSmallRight size={25} className="text-gray-500" />
            </div>
            <StatusBox label="Encrypt" status={status?.encryption} />
            <div className="flex items-center justify-center">
              <HiArrowSmallRight size={25} className="text-gray-500" />
            </div>
            <StatusBox label="Decrypt" status={status?.decryption} />
            <div className="flex items-center justify-center">
              <HiArrowSmallRight size={25} className="text-gray-500" />
            </div>
            <StatusBox label="Verify" status={status?.verified} />
            <div className="flex items-center justify-center">
              <HiArrowSmallRight size={25} className="text-gray-500" />
            </div>
            <StatusBox label="Decompress" status={status?.decompression} />
          </div>
        </div>

        {loading && (
          <div className="mt-6 text-center">
            <Spinner />
          </div>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center">Error: {error}</p>
        )}

        {status && !status.error && (
          <div className="mt-8 space-y-6">
            <div className="flex justify-evenly items-center">
              <div className="p-4 bg-white rounded shadow border">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">
                  Send payload
                </h4>
                <pre className="text-xs bg-gray-50 p-3 rounded text-gray-800 overflow-auto max-h-40">
                  {JSON.stringify(status.decompressed, null, 2)}
                </pre>
              </div>
              <StatusBox label="End-to-End" status={status?.endToEnd} />
              <div className="p-4 bg-white rounded shadow border">
                <h4 className="text-sm font-semibold mb-2 text-gray-700">
                  Received payload
                </h4>
                <pre className="text-xs bg-gray-50 p-3 rounded text-gray-800 overflow-auto max-h-40">
                  {JSON.stringify(status.decompressed, null, 2)}
                </pre>
              </div>
            </div>
            <div className="flex justify-evenly items-center">
              <div>
                <div className="flex justify-evenly items-center mb-3">
                  <HiArrowTurnDownRight size={25} />
                  <h4 className="text-base font-semibold text-gray-700 mb-2 text-center">
                    Intermediate Buffers (Hex)
                  </h4>
                  <HiArrowTurnRightUp size={25} />
                </div>
                <div className="bg-white p-4 rounded border text-xs overflow-auto max-h-60 text-center ">
                  {Object.entries(status.intermediate || {}).map(
                    ([label, hex]) => (
                      <div key={label} className="mb-2">
                        <strong>{label}:</strong>{" "}
                        <code className="break-words">{hex}</code>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              <h3 className="text-base font-semibold text-gray-700 mb-2">
                Validation Summary
              </h3>

              <div className="p-4 bg-white rounded shadow border">
                {/* <h4 className="text-sm font-semibold mb-2 text-gray-700">
                    Compression Insights
                  </h4> */}
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Original Size:</strong>{" "}
                    {status.insights.originalSize} bytes
                  </li>
                  <li>
                    <strong>Compressed Size:</strong>{" "}
                    {status.insights.compressedSize} bytes
                  </li>
                  <li>
                    <strong>Compression Ratio:</strong>{" "}
                    {status.insights.compressionRatio}
                  </li>
                  <li>
                    <strong>Encrypted Size:</strong>{" "}
                    {status.insights.finalEncryptedSize} bytes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Section - Template and Inputs */}
      <div className="w-1/4 bg-slate-50 rounded p-3 shadow-md">
        <LoraMessageForm onSubmit={handleSubmit} disabled={loading} />
      </div>
    </div>
  );
};

export default DataPipeLinePage;
