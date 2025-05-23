import React, { useState, useEffect } from "react";
import { generateId } from "../../utils/idGenerator";

const templates = {
  "Location": { l: "80.1232|13.3243" },
  "SOS": { l: "80.1232|13.3243", s: 1 },
  "Chat": { m: 4 },
  "Chat Special": { l: "80.1232|13.3243", m: 0 },
  "Weather Request": { l: "80.1232|13.3243", wr: 1 },
  "Weather Sender": { w: 60 },
  "Fishing Hotspots": { l: "80.1232|13.3243", f: 1 },
};

const LoraMessageForm = ({ onSubmit, disabled }) => {
  const [templateName, setTemplateName] = useState("");
  const [formData, setFormData] = useState({});
  const [idPrefix, setIdPrefix] = useState("123");
  const [messageId, setMessageId] = useState(generateId());
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [lastSubmittedId, setLastSubmittedId] = useState(null);

  useEffect(() => {
    if (templateName) {
      const template = templates[templateName];
      setFormData({ ...template });
      setMessageId(generateId());
      if ("l" in template) {
        const [parsedLat, parsedLon] = template.l.split("|");
        setLat(parsedLat);
        setLon(parsedLon);
      } else {
        setLat("");
        setLon("");
      }
    }
  }, [templateName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullId = `${idPrefix}|${messageId}`;
    if (fullId === lastSubmittedId)
      return alert("Duplicate message ID. Refresh to send again.");

    const payload = { id: fullId, ...formData };
    if (lat && lon) payload.l = `${lat}|${lon}`;

    ["m", "w", "s", "f"].forEach((key) => {
      if (payload[key] !== undefined && payload[key] !== "") {
        payload[key] = Number(payload[key]);
      }
    });
    onSubmit(payload);
    setLastSubmittedId(fullId);
  };

  const refreshMessageId = () => {
    setMessageId(generateId());
    setLastSubmittedId(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 h-full flex flex-col justify-between pt-5"
    >
         <div className="space-y-5">
      <div>
        <label className="block font-semibold text-sm text-gray-700">
          Select Template
        </label>
        <select
          className="border rounded px-3 py-2 text-sm mt-1 w-full"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        >
          <option value="">-- Choose a Template --</option>
          {Object.keys(templates).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
     
        <div>
          <label className="block font-medium text-sm text-gray-700">
            Device ID (3 digits)
          </label>
          <input
            type="text"
            maxLength={3}
            value={idPrefix}
            onChange={(e) => setIdPrefix(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm w-full"
          />
        </div>

        <div>
          <label className="block font-medium text-sm text-gray-700">
            Message ID
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={messageId}
              readOnly
              className="border px-3 py-2 rounded-md text-sm w-full bg-gray-100 text-gray-600"
            />
            <button
              type="button"
              onClick={refreshMessageId}
              className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        {"l" in formData && (
          <div>
            <label className="block font-medium text-sm text-gray-700">
              Latitude
            </label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full mb-2"
            />
            <label className="block font-medium text-sm text-gray-700">
              Longitude
            </label>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm w-full"
            />
          </div>
        )}

        {["m", "w", "f"].map((field) =>
          field in formData ? (
            <div key={field}>
              <label className="block font-medium text-sm text-gray-700">
                {field.toUpperCase()}
              </label>
              <input
                type="number"
                name={field}
                min={0}
                max={field === "m" ? 99 : field === "w" ? 100 : 4}
                value={formData[field]}
                onChange={handleChange}
                className="border px-3 py-2 rounded-md text-sm w-full"
              />
            </div>
          ) : null
        )}

        {["s", "wr"].map((field) =>
          field in formData ? (
            <div key={field}>
              <label className="block font-medium text-sm text-gray-700">
                {field.toUpperCase()}
              </label>
              <input
                key={field}
                type="number"
                name={field}
                value={formData[field]}
                className="border px-3 py-2 rounded-md text-sm w-full text-gray-400"
                disabled
              />
            </div>
          ) : null
        )}
      </div>
      <div>
        <div className="my-5">
          <label className="block font-semibold text-sm text-gray-700 mb-1">
            Current Payload
          </label>
          <pre className="bg-white border text-xs p-3 rounded overflow-x-auto text-gray-800 max-h-52">
            {JSON.stringify(
              {
                id: `${idPrefix}|${messageId}`,
                ...(lat && lon ? { l: `${lat}|${lon}` } : {}),
                ...["m", "w", "f", "s", "wr"].reduce((acc, key) => {
                  if (formData[key] !== undefined) acc[key] = formData[key];
                  return acc;
                }, {}),
              },
              null,
              2
            )}
          </pre>
        </div>

        <button
          type="submit"
          disabled={disabled || templateName === ""}
          className={`px-4 py-2 my-2 rounded text-sm w-full transition-colors duration-150 ${
            disabled || templateName === ""
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {disabled ? "Testing..." : "Run Test"}
        </button>
      </div>
    </form>
  );
};

export default LoraMessageForm;
