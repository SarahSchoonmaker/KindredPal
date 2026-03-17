import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { groupsAPI } from "../services/api";
import {
  Search, Plus, Lock, Globe, Users, LayoutGrid, SlidersHorizontal, X,
} from "lucide-react";
import "./GroupsPage.css";

const CATEGORIES = [
  "All","Sports & Fitness","Faith & Spirituality","Parents",
  "Hobbies & Interests","Volunteers & Causes","Support & Wellness",
  "Professional & Networking","Arts, Culture & Book Clubs","Outdoor & Adventure",
  "Food & Dining","Learning & Education","Neighborhood & Local","Life Transitions",
  "Single & Childfree",
  "Caregiver Support","Social Outings",
];

const CATEGORY_ICONS = {
  "Sports & Fitness":"🏃","Faith & Spirituality":"🙏","Parents":"👩‍👧",
  "Hobbies & Interests":"🎯","Volunteers & Causes":"🤝","Support & Wellness":"💙",
  "Professional & Networking":"💼","Arts, Culture & Book Clubs":"🎨",
  "Outdoor & Adventure":"🏕️","Food & Dining":"🍽️","Learning & Education":"🎓",
  "Neighborhood & Local":"🏘️","New to the Area":"📍",
  "Business Owners & Entrepreneurs":"🚀","Sober & Clean Living":"🌿",
  "Single Parents":"👨‍👧‍👦","Aging Gracefully":"🌻","Life Transitions":"🌿","Social Outings":"🥂",
};

const RELIGION_OPTIONS = [
  "None","Spiritual but not religious","Christian (Catholic)",
  "Christian (Protestant)","Christian (Evangelical)","Christian (Orthodox)",
  "Jewish","Muslim","Hindu","Buddhist","Mormon / LDS","Other",
];

const POLITICS_OPTIONS = [
  "Very Conservative","Conservative","Moderate","Liberal","Very Liberal",
];

const LIFE_STAGE_OPTIONS = [
  "Single","In a relationship","Married","Divorced",
  "Widowed","Empty nester","Newly retired","Retired",
];

const FAMILY_OPTIONS = [
  "No kids","Expecting","Kids under 5","Kids 6-12",
  "Teenagers","Adult children","Grandchildren","Homeschooling",
];

function GroupCard({ group, onClick, currentUser }) {
  // Compute "people like me" tags based on shared values with current user
  const peopleLikeMeTags = [];
  if (currentUser && group.memberValues) {
    const mv = group.memberValues;
    if (currentUser.religion && (mv.religions || []).includes(currentUser.religion)) {
      peopleLikeMeTags.push({ icon: "🙏", label: "Others share your faith" });
    }
    if (currentUser.politicalBeliefs && (mv.politics || []).includes(currentUser.politicalBeliefs)) {
      peopleLikeMeTags.push({ icon: "🗳️", label: "Similar values here" });
    }
    const sharedStages = (currentUser.lifeStage || []).filter(s => (mv.lifeStages || []).includes(s));
    if (sharedStages.length > 0) {
      const label = sharedStages[0];
      peopleLikeMeTags.push({ icon: "👥", label: `${label} in this group` });
    }
    const sharedFamily = (currentUser.familySituation || []).filter(f => (mv.families || []).includes(f));
    if (sharedFamily.length > 0) {
      peopleLikeMeTags.push({ icon: "👨‍👧", label: `${sharedFamily[0]} here` });
    }
  }

  return (
    <div className="group-card" onClick={() => onClick(group._id)}>
      <div className="group-card-header">
        <div className="group-icon">
          {group.coverPhoto
            ? <img src={group.coverPhoto} alt={group.name} className="group-card-photo" />
            : CATEGORY_ICONS[group.category] || "✨"
          }
        </div>
        <div className="group-card-info">
          <div className="group-card-title-row">
            <h3 className="group-name">{group.name}</h3>
            {group.isPrivate
              ? <Lock size={14} className="privacy-icon private" />
              : <Globe size={14} className="privacy-icon public" />
            }
          </div>
          <span className="group-category">{group.category}</span>
          <span className="group-location">
            {group.isNationwide ? "🌍 Nationwide" : `📍 ${group.city}, ${group.state}`}
          </span>
        </div>
      </div>
      <p className="group-description">{group.description}</p>
      {peopleLikeMeTags.length > 0 && (
        <div className="people-like-me-tags">
          {peopleLikeMeTags.slice(0, 2).map((tag, i) => (
            <span key={i} className="plm-tag">
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>
      )}
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

// Filter drawer component
function FilterDrawer({ filters, onChange, onClose, userProfile }) {
  const toggle = (field, val) => {
    const current = filters[field] || [];
    onChange({
      ...filters,
      [field]: current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val],
    });
  };

  const activeCount = Object.values(filters).flat().length;

  return (
    <div className="filter-drawer">
      <div className="filter-drawer-header">
        <h3>Filter Groups</h3>
        <div className="filter-header-actions">
          {activeCount > 0 && (
            <button className="btn-clear-filters" onClick={() => onChange({})}>
              Clear all ({activeCount})
            </button>
          )}
          <button className="filter-close" onClick={onClose}><X size={20} /></button>
        </div>
      </div>

      <div className="filter-section">
        <h4>Faith / Religion</h4>
        <div className="filter-chips">
          {RELIGION_OPTIONS.map((r) => (
            <button
              key={r}
              className={`filter-chip ${(filters.religion || []).includes(r) ? "active" : ""}`}
              onClick={() => toggle("religion", r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Political Views</h4>
        <div className="filter-chips">
          {POLITICS_OPTIONS.map((p) => (
            <button
              key={p}
              className={`filter-chip ${(filters.politics || []).includes(p) ? "active" : ""}`}
              onClick={() => toggle("politics", p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Life Stage</h4>
        <div className="filter-chips">
          {LIFE_STAGE_OPTIONS.map((l) => (
            <button
              key={l}
              className={`filter-chip ${(filters.lifeStage || []).includes(l) ? "active" : ""}`}
              onClick={() => toggle("lifeStage", l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Family Situation</h4>
        <div className="filter-chips">
          {FAMILY_OPTIONS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${(filters.family || []).includes(f) ? "active" : ""}`}
              onClick={() => toggle("family", f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {userProfile && (
        <button
          className="btn-match-my-values"
          onClick={() => onChange({
            religion: userProfile.religion ? [userProfile.religion] : [],
            politics: userProfile.politicalBeliefs ? [userProfile.politicalBeliefs] : [],
            lifeStage: userProfile.lifeStage || [],
            family: userProfile.familySituation || [],
          })}
        >
          ✨ Match My Values
        </button>
      )}
    </div>
  );
}

export default function GroupsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [forYouGroups, setForYouGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchingRef = useRef(false);
  const fetchTimerRef = useRef(null);

  const activeFilterCount = Object.values(filters).flat().length;

  // Client-side filter groups by values
  const applyFilters = useCallback((groupList) => {
    if (activeFilterCount === 0) return groupList;
    return groupList.filter((group) => {
      const memberValues = group.memberValues || {};
      if (filters.religion?.length && !filters.religion.some(r => (memberValues.religions || []).includes(r))) return false;
      if (filters.politics?.length && !filters.politics.some(p => (memberValues.politics || []).includes(p))) return false;
      if (filters.lifeStage?.length && !filters.lifeStage.some(l => (memberValues.lifeStages || []).includes(l))) return false;
      if (filters.family?.length && !filters.family.some(f => (memberValues.families || []).includes(f))) return false;
      return true;
    });
  }, [filters, activeFilterCount]);

  const fetchGroups = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (search) params.search = search;

      const [discoverRes, myRes] = await Promise.all([
        groupsAPI.getGroups(params),
        groupsAPI.getMyGroups(),
      ]);

      const allGroups = discoverRes.data.groups || [];
      setGroups(allGroups);
      setMyGroups(myRes.data.groups || []);

      // "For You" — groups that share at least one value with user
      if (user?.religion || user?.politicalBeliefs || user?.lifeStage?.length || user?.familySituation?.length) {
        const forYou = allGroups.filter((g) => {
          if (g.isMember) return false;
          const mv = g.memberValues || {};
          if (user.religion && (mv.religions || []).includes(user.religion)) return true;
          if (user.politicalBeliefs && (mv.politics || []).includes(user.politicalBeliefs)) return true;
          if (user.lifeStage?.some(l => (mv.lifeStages || []).includes(l))) return true;
          if (user.familySituation?.some(f => (mv.families || []).includes(f))) return true;
          return false;
        });
        setForYouGroups(forYou);
      }
    } catch (err) {
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [selectedCategory, search, user]);

  useEffect(() => {
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => fetchGroups(), 300);
    return () => clearTimeout(fetchTimerRef.current);
  }, [fetchGroups]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const baseGroups = activeTab === "my" ? myGroups : activeTab === "foryou" ? forYouGroups : groups;
  const displayedGroups = applyFilters(baseGroups);

  return (
    <div className="groups-page">
      {/* Header */}
      <div className="groups-header">
        <div className="groups-header-content">
          <LayoutGrid size={28} className="groups-header-icon" />
          <div>
            <h1>Community Groups</h1>
            <p>Find your people — connect through shared values, faith, and life stage</p>
          </div>
        </div>
        <button className="btn-create-group" onClick={() => navigate("/groups/create")}>
          <Plus size={18} /> Create Group
        </button>
      </div>

      {/* Search + Filter */}
      <div className="groups-search-row">
        <form className="groups-search" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-btn">Search</button>
          </div>
        </form>
        <button
          className={`btn-filter ${activeFilterCount > 0 ? "btn-filter-active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={18} />
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <FilterDrawer
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
          userProfile={user}
        />
      )}

      {/* Tabs */}
      <div className="groups-tabs">
        <button
          className={`groups-tab ${activeTab === "discover" ? "active" : ""}`}
          onClick={() => setActiveTab("discover")}
        >
          Discover
        </button>
        {forYouGroups.length > 0 && (
          <button
            className={`groups-tab ${activeTab === "foryou" ? "active" : ""}`}
            onClick={() => setActiveTab("foryou")}
          >
            ✨ For You ({forYouGroups.length})
          </button>
        )}
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
          <h3>
            {activeTab === "my" ? "No Groups Yet" :
             activeTab === "foryou" ? "No Matches Yet" : "No Groups Found"}
          </h3>
          <p>
            {activeTab === "my" ? "Join a group from Discover to get started!" :
             activeTab === "foryou" ? "Fill in your profile values to see groups matched to you" :
             activeFilterCount > 0 ? "Try removing some filters" : "Try a different category or search term"}
          </p>
          {activeTab === "foryou" && (
            <button className="btn-go-profile" onClick={() => navigate("/profile")}>
              Update My Profile →
            </button>
          )}
        </div>
      ) : (
        <div className="groups-grid">
          {displayedGroups.map((group) => (
            <GroupCard
              key={group._id}
              group={group}
              onClick={(id) => navigate(`/groups/${id}`)}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}