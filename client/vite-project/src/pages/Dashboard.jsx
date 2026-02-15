import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [trips, setTrips] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const createTrip = async () => {
    await axios.post("http://localhost:5000/api/trips", {
      title,
      date,
      location,
      createdBy: user.name,
    });
    loadTrips();
  };

  const loadTrips = async () => {
    const res = await axios.get("http://localhost:5000/api/trips");
    setTrips(res.data);
  };

  const rsvp = async (tripId, status) => {
    await axios.post(`http://localhost:5000/api/trips/${tripId}/rsvp`, {
      userId: user._id,
      status,
    });

    loadTrips();
  };
  useEffect(() => {
    loadTrips();
  }, []);

  return (
    <div>
      <h2>Create Trip</h2>
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input
        placeholder="Location"
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={createTrip}>Create</button>

      <h2>Upcoming Trips</h2>
      {trips.map((trip) => (
        <div
          key={trip._id}
          style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}
        >
          <strong>{trip.title}</strong> - {trip.location} - {trip.date}
          <div>
            <button onClick={() => rsvp(trip._id, "Yes")}>Yes</button>
            <button onClick={() => rsvp(trip._id, "No")}>No</button>
            <button onClick={() => rsvp(trip._id, "Maybe")}>Maybe</button>
          </div>
          <p>Participants: {trip.participants.length}</p>
        </div>
      ))}
    </div>
  );
}
