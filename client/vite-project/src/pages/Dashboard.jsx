import axios from "axios";
import { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // CREATE TRIP (ADMIN)
  const createTrip = async () => {
    if (!title || !date || !location) return alert("Fill all fields");

    try {
      await axios.post("http://localhost:5000/api/trips", {
        title,
        date,
        location,
        createdBy: user.name,
        role: user.role,
      });

      setTitle("");
      setDate("");
      setLocation("");

      loadTrips();
      loadNotifications();
    } catch (err) {
      alert("Only admin can create trips");
    }
  };

  // LOAD TRIPS
  const loadTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/trips");
      setTrips(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // RSVP (USERS)
  const rsvp = async (tripId, status) => {
    try {
      await axios.post(`http://localhost:5000/api/trips/${tripId}/rsvp`, {
        userId: user._id,
        status,
      });

      loadTrips();
      loadNotifications();
    } catch (err) {
      alert("RSVP failed");
    }
  };

  // DELETE TRIP (ADMIN)
  const deleteTrip = async (id) => {
    if (!window.confirm("Delete this trip?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/trips/${id}`, {
        data: { role: user.role },
      });

      loadTrips();
    } catch (err) {
      alert("Admin only");
    }
  };

  // LOAD NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notifications/${user.name}`,
      );
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTrips();
    loadNotifications();
  }, []);

  return (
    <div className="dashboard-container">
      {isAdmin && (
        <div className="section">
          <h2>Create Trip (Admin)</h2>
          <div className="trip-form">
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
          </div>
        </div>
      )}

      <div className="section">
        <h2>Notifications</h2>
        {notifications.length === 0 && <p>No notifications yet</p>}
        {notifications.map((note) => (
          <div className="notification" key={note._id}>
            🔔 {note.message}
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Upcoming Trips</h2>

        {trips.map((trip) => (
          <div className="trip-card" key={trip._id}>
            <strong>{trip.title}</strong> — {trip.location} — {trip.date}
            <div className="trip-actions">
              <button className="yes" onClick={() => rsvp(trip._id, "Yes")}>
                Yes
              </button>
              <button className="no" onClick={() => rsvp(trip._id, "No")}>
                No
              </button>
              <button className="maybe" onClick={() => rsvp(trip._id, "Maybe")}>
                Maybe
              </button>

              {isAdmin && (
                <button
                  style={{
                    marginLeft: "10px",
                    background: "#dc2626",
                    color: "white",
                  }}
                  onClick={() => deleteTrip(trip._id)}
                >
                  Delete
                </button>
              )}
            </div>
            <p>Participants: {trip.participants.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
