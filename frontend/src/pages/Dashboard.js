import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const emptyForm = {
  itemName: "",
  description: "",
  type: "Lost",
  location: "",
  date: "",
  contactInfo: "",
};

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchItems = async () => {
    try {
      const res = search
        ? await API.get(`/items/search?name=${search}`)
        : await API.get("/items");
      setItems(res.data);
    } catch (err) {
      setError("Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await API.put(`/items/${editId}`, form);
        setEditId(null);
      } else {
        await API.post("/items", form);
      }
      setForm(emptyForm);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      itemName: item.itemName,
      description: item.description || "",
      type: item.type,
      location: item.location,
      date: item.date ? item.date.substring(0, 10) : "",
      contactInfo: item.contactInfo,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <h1>📦 Lost & Found</h1>
        <div>
          <span>Welcome, {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        {error && <p className="error">{error}</p>}

        {/* Add / Edit Item Form */}
        <div className="card">
          <h2>{editId ? "✏️ Edit Item" : "➕ Report Item"}</h2>
          <form onSubmit={handleSubmit} className="item-form">
            <input
              name="itemName"
              placeholder="Item Name"
              value={form.itemName}
              onChange={handleChange}
              required
            />
            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
            <input
              name="contactInfo"
              placeholder="Contact Info"
              value={form.contactInfo}
              onChange={handleChange}
              required
            />
            <div className="form-btns">
              <button type="submit">{editId ? "Update" : "Submit"}</button>
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="card">
          <h2>🔍 Search Items</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              placeholder="Search by item name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchItems();
              }}
            >
              Clear
            </button>
          </form>
        </div>

        {/* Items List */}
        <div className="card">
          <h2>📋 All Items ({items.length})</h2>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <div className="items-grid">
              {items.map((item) => (
                <div
                  key={item._id}
                  className={`item-card ${item.type === "Lost" ? "lost" : "found"}`}
                >
                  <div className="item-header">
                    <strong>{item.itemName}</strong>
                    <span
                      className={`badge ${item.type === "Lost" ? "badge-lost" : "badge-found"}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p>{item.description}</p>
                  <p>📍 {item.location}</p>
                  <p>📞 {item.contactInfo}</p>
                  <p>👤 {item.postedBy?.name}</p>
                  <p>
                    🗓{" "}
                    {new Date(item.date || item.createdAt).toLocaleDateString()}
                  </p>
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={() => navigate(`/items/${item._id}`)}
                      style={{
                        background: "#4f46e5",
                        padding: "6px 14px",
                        fontSize: 13,
                      }}
                    >
                      View
                    </button>
                  </div>
                  {item.postedBy?._id === user.id && (
                    <div className="item-actions">
                      <button
                        onClick={() => handleEdit(item)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
