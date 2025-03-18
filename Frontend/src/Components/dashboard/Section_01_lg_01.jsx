import React, { useEffect, useState } from "react";
import icon from "../../assets/icons/router.png";
import { useNavigate } from "react-router-dom";

const Section_01_lg_01 = ({ gateways, loading, error }) => {
  const navigate = useNavigate();
  const activeGateways = gateways.filter((gw) => gw.status === "Active").length;

  const handleRedirect = () => {
    navigate("/gateway-page");
  };

  return (
    <div
      className="rounded-2xl shadow-lg bg-white h-full flex flex-col cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-200"
      onClick={handleRedirect}
    >
      {/* Header */}
      <div className="flex justify-between items-center h-1/5 px-6 py-3">
        <div className="flex flex-col justify-evenly items-start">
          <div className="text-xl font-semibold">Gateways</div>

          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full mt-1"></div>
          ) : (
            <div className="text-xl">
              {error ? "0" : activeGateways}{" "}
              <span className="text-sm text-gray-500">active gateways</span>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-14 h-14" />
        </div>
      </div>

      {/* Gateway Data */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {loading && (
          <div className="text-center text-lg text-gray-500 h-full flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
        {error && (
          <div className="text-center text-lg text-red-500 h-full flex justify-center items-center">
            Error: {error}
          </div>
        )}
        {!loading && !error && gateways.length === 0 && (
          <div className="text-center text-gray-500 h-full flex justify-center items-center">
            No gateways found
          </div>
        )}
        {!loading &&
          !error &&
          gateways.map((gateway, index) => (
            <div key={index} className="bg-white p-3 rounded-lg mb-2 shadow-md">
              <div className="flex justify-between items-center">
                <div className="font-semibold">{gateway.gatewayName}</div>

                <div
                  className={`text-sm font-semibold ${
                    gateway.status === "Active"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {gateway.status}{" "}
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      gateway.status === "Active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                </div>
              </div>
              <div className="text-gray-600 text-sm">
                {gateway.lat} , {gateway.lng}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Section_01_lg_01;
