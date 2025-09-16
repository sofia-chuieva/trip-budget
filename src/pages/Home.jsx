import TripForm from "../components/TripForm";
import TripDashboard from "../components/TripDashboard";

export default function Home() {
  return (
    <div className="flex">
      <TripForm />
      <TripDashboard />
    </div>
  );
}
