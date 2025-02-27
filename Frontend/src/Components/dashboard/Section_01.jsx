import React from "react";
import Section_01_sm_01 from "./Section_01_sm_01";
import Section_01_sm_02 from "./Section_01_sm_02";
import Section_01_lg_01 from "./Section_01_lg_01";

const section01 = ({ vesselCount, chatCount, gatwayData, loading, error }) => {
  return (
    <div className="w-full h-full flex gap-8">
      <div className="flex flex-col flex-1 gap-8">
        <Section_01_sm_01
          vesselCount={vesselCount}
          loading={loading}
          error={error}
        />
        <Section_01_sm_02
          chatCount={chatCount}
          loading={loading}
          error={error}
        />
      </div>

      <div className="flex-1">
        <Section_01_lg_01
          gateways={gatwayData}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default section01;
