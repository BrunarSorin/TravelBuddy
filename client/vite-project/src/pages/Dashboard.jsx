import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Create Trip
  const createTrip = async () => {
    if (!title || !date || !location) return alert("Fill all fields");

    await axios.post("http://localhost:5000/api/trips", {
      title,
      date,
      location,
      createdBy: user.name,
    });

    setTitle("");
    setDate("");
    setLocation("");

    loadTrips();
    loadNotifications();
  };

  // Load Trips
  const loadTrips = async () => {
    const res = await axios.get("http://localhost:5000/api/trips");
    setTrips(res.data);
  };

  // RSVP
  const rsvp = async (tripId, status) => {
    await axios.post(`http://localhost:5000/api/trips/${tripId}/rsvp`, {
      userId: user._id,
      status,
    });

    loadTrips();
    loadNotifications();
  };

  // Load Notifications
  const loadNotifications = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/notifications/${user.name}`,
    );
    setNotifications(res.data);
  };

  useEffect(() => {
    loadTrips();
    loadNotifications();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create Trip</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={createTrip}>Create</button>

      <h2>Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet</p>}
      {notifications.map((note) => (
        <p key={note._id}>🔔 {note.message}</p>
      ))}

      <h2>Upcoming Trips</h2>

      {trips.map((trip) => (
        <div
          key={trip._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <strong>{trip.title}</strong> — {trip.location} — {trip.date}
          <div style={{ marginTop: "5px" }}>
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
