import { useState } from "react";
import TripForm from "../components/TripForm";
import TripDashboard from "../components/TripDashboard";

export default function Home() {
  const [tripData, setTripData] = useState(null);

  const handleTripDataUpdate = (data) => {
    setTripData(data);
  };

  return (
    <div className="flex">
      <TripForm onTripDataUpdate={handleTripDataUpdate} />
      <TripDashboard tripData={tripData} />
    </div>
  );
}
