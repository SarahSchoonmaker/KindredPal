import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { groupsAPI } from "../services/api";
import { Search, Plus, Lock, Globe, Users, LayoutGrid } from "lucide-react";
import "./GroupsPage.css";

const CATEGORIES = [
  "All",
  "Sports & Fitness",
  "Faith & Spirituality",
  "Parents",
  "Hobbies & Interests",
  "Volunteers & Causes",
  "Support & Wellness",
  "Professional & Networking",
  "Arts, Culture & Book Clubs",
  "Outdoor & Adventure",
  "Food & Dining",
  "Learning & Education",
  "Neighborhood & Local",
  "Life Transitions",
];

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  Parents: "👩‍👧",
  "Hobbies & Interests": "🎯",
  "Volunteers & Causes": "🤝",
  "Support & Wellness": "💙",
  "Professional & Networking": "💼",
  "Arts, Culture & Book Clubs": "🎨",
  "Outdoor & Adventure": "🏕️",
  "Food & Dining": "🍽️",
  "Learning & Education": "🎓",
  "Neighborhood & Local": "🏘️",
  "New to the Area": "📍",
  "Business Owners & Entrepreneurs": "🚀",
  "Sober & Clean Living": "🌿",
  "Single Parents": "👨‍👧‍👦",
  "Aging Gracefully": "🌻",
  "Life Transitions": "🌿",
};

function GroupCard({ group, onClick }) {
  return (
    <div className="group-card" onClick={() => onClick(group._id)}>
      <div className="group-card-header">
        <div className="group-icon">
          {CATEGORY_ICONS[group.category] || "✨"}
        </div>
        <div className="group-card-info">
          <div className="group-card-title-row">
            <h3 className="group-name">{group.name}</h3>
            {group.isPrivate ? (
              <Lock size={14} className="privacy-icon private" />
            ) : (
              <Globe size={14} className="privacy-icon public" />
            )}
          </div>
          <span className="group-category">{group.category}</span>
          <span className="group-location">
            {group.isNationwide
              ? "🌍 Nationwide"
              : `📍 ${group.city}, ${group.state}`}
          </span>
        </div>
      </div>

      <p className="group-description">{group.description}</p>

      <div className="group-card-footer">
        <div className="member-count">
          <Users size={14} />
          <span>{group.memberCount || 0} members</span>
        </div>
        {group.isMember ? (
          <span className="badge badge-joined">✓ Joined</span>
        ) : group.isPending ? (
          <span className="badge badge-pending">Pending</span>
        ) : (
          <span className="badge badge-join">
            {group.isPrivate ? "Request to Join" : "Join"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (search) params.search = search;

      const [discoverRes, myRes] = await Promise.all([
        groupsAPI.getGroups(params),
        groupsAPI.getMyGroups(),
      ]);
      setGroups(discoverRes.data.groups || []);
      setMyGroups(myRes.data.groups || []);
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, search]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const displayedGroups = activeTab === "my" ? myGroups : groups;

  return (
    <div className="groups-page">
      {/* Page Header */}
      <div className="groups-header">
        <div className="groups-header-content">
          <LayoutGrid size={28} className="groups-header-icon" />
          <div>
            <h1>Community Groups</h1>
            <p>
              Find your people — connect through shared values, faith, and life
              stage
            </p>
          </div>
        </div>
        <button
          className="btn-create-group"
          onClick={() => navigate("/groups/create")}
        >
          <Plus size={18} />
          Create Group
        </button>
      </div>

      {/* Search */}
      <form className="groups-search" onSubmit={handleSearch}>
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </div>
      </form>

      {/* Tabs */}
      <div className="groups-tabs">
        <button
          className={`groups-tab ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        <button
          className={`groups-tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Groups {myGroups.length > 0 ? `(${myGroups.length})` : ""}
        </button>
      </div>

      {/* Category Filter — only on Discover */}
      {activeTab === "discover" && (
        <div className="category-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === "All" ? "All Groups" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Groups Grid */}
      {loading ? (
        <div className="groups-loading">
          <div className="spinner" />
          <p>Finding your community...</p>
        </div>
      ) : displayedGroups.length === 0 ? (
        <div className="groups-empty">
          <span className="empty-icon">👥</span>
          <h3>{activeTab === "my" ? "No Groups Yet" : "No Groups Found"}</h3>
          <p>
            {activeTab === "my"
              ? "Join a group from Discover to get started!"
              : "Try a different category or search term"}
          </p>
        </div>
      ) : (
        <div className="groups-grid">
          {displayedGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onClick={(id) => navigate(`/groups/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
