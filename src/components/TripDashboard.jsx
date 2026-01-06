export default function TripDashboard({ tripData }) {
  const travelData = tripData?.travel_data ?? tripData ?? {};
  const cardColors = [
    "bg-[#81b29a]",
    "bg-[#3d405b]",
    "bg-[#e07a5f]",
    "bg-[#f2cc8f]",
    "bg-[#9e2a2b]",
    "bg-[#0f4c5c]",
    "bg-[#bc4749]",
  ];

  const buildPlaceLink = (title, location) => {
    const query = [title, location].filter(Boolean).join(" ");
    if (!query.trim()) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const renderBudgetCard = () => {
    if (!travelData?.budget_breakdown) return null;

    const budget = travelData.budget_breakdown;
    return (
      <div className="card h-96 rounded-3xl bg-white">
        <div className="card-color bg-[#3d405b] h-1/2 w-full rounded-t-3xl flex items-center justify-center">
          <h2 className="text-white text-xl font-bold">Budget Breakdown</h2>
        </div>
        <div className="card-content p-4">
          <div className="space-y-2">
            <p><span className="font-semibold">Flights:</span> {budget.flights}</p>
            <p><span className="font-semibold">Accommodation:</span> {budget.accommodation}</p>
            <p><span className="font-semibold">Food:</span> {budget.food}</p>
            <p><span className="font-semibold">Activities:</span> {budget.activities}</p>
            <p><span className="font-semibold">Transport:</span> {budget.transport}</p>
            <hr className="my-2" />
            <p className="font-bold text-lg"><span className="font-semibold">Total:</span> {budget.total_estimated}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderDayCards = (day) => {
    if (!day?.activities) return [];

    return day.activities.map((activity, index) => {
      const title = activity.activity || activity.name || "Activity";
      const location = activity.location || "";
      const link = buildPlaceLink(title, location);
      return (
        <a
          key={index}
          href={link || undefined}
          target={link ? "_blank" : undefined}
          rel={link ? "noreferrer" : undefined}
          className={`block card rounded-3xl drop-shadow-md bg-white overflow-hidden transition transform ${link ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer" : ""}`}
        >
          <div className={`card-color ${cardColors[index % cardColors.length]} h-24 w-full flex items-center justify-center`}>
            <h3 className="text-white text-lg font-bold text-center px-4">{title}</h3>
          </div>
          <div className="card-content p-4 space-y-2 text-sm text-gray-700">
            {activity.time && (
              <p>
                <span className="font-semibold">Time:</span> {activity.time}
              </p>
            )}
            {location && (
              <p>
                <span className="font-semibold">Location:</span> {location}
              </p>
            )}
            {activity.duration && (
              <p>
                <span className="font-semibold">Duration:</span> {activity.duration}
              </p>
            )}
            {activity.cost_estimate && (
              <p>
                <span className="font-semibold">Cost:</span> {activity.cost_estimate}
              </p>
            )}
          </div>
        </a>
      );
    });
  };

  const renderAllDaySections = () => {
    if (!travelData?.itinerary) return null;

    const entries = Object.entries(travelData.itinerary).sort(([a], [b]) => a.localeCompare(b));

    return entries.map(([dayKey, day], idx) => {
      const dayLabel = dayKey.replace("_", " ").toUpperCase();
      const dayCards = renderDayCards(day);

      return (
        <div key={dayKey || idx} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">{dayLabel}</h2>
            {day?.date && <p className="text-sm text-gray-500">{day.date}</p>}
          </div>
          {dayCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">{dayCards}</div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <p className="text-gray-500">No activities found for this day.</p>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="w-2/3 h-screen bg-white p-6 overflow-y-scroll">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Trip Dashboard</h1>
      {tripData ? (
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-14 items-start">
            {renderBudgetCard()}
            <div className="col-span-2 space-y-8">
              {renderAllDaySections() || (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-gray-500">No itinerary days found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500 text-lg">Start a conversation to see your trip details here!</p>
        </div>
      )}
    </div>
  );
}
