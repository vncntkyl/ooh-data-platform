import { FaMapMarkerAlt } from "react-icons/fa";
import MapLocation from "../components/map/MapLocation";
import BillboardGraph from "../components/map/BillboardGraph";
import { useEffect, useState } from "react";
import { useService } from "../config/services";
// import SampleConversation from "./SampleConversation";

function Map() {
  const [billboards, setBillboards] = useState(null);
  const { retrieveSitesCount } = useService();
  useEffect(() => {
    const setup = async () => {
      const data = await retrieveSitesCount("demographics");
      const sampleData = data.map((region) => {
        return {
          ...region,
          digital: 5,
        };
      });
      setBillboards(sampleData);
    };
    setup();
  }, []);
  return (
    billboards && (
      <>
        <p className="text-xl font-bold text-main flex items-center gap-1">
          Billboard Sites
          <span className="text-red-500">
            <FaMapMarkerAlt />
          </span>
        </p>
        <MapLocation />
        <div className="flex items-center gap-4">
          <BillboardGraph data={billboards} title="Overall Billboards" />
        </div>
        {/* <div className="bg-white p-4 shadow flex flex-col gap-2">
        <SampleConversation />
      </div> */}
      </>
    )
  );
}

export default Map;
