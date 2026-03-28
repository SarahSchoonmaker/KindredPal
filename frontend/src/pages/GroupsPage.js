import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { groupsAPI } from "../services/api";
import {
  Search,
  Plus,
  Lock,
  Globe,
  Users,
  SlidersHorizontal,
  X,
} from "lucide-react";
import "./GroupsPage.css";

const CATEGORIES = [
  "All",
  "Caregiver Support",
  "Grief & Loss",
  "Sober & Clean Living",
  "New Parent Support",
  "Chronic Illness Support",
  "Anxiety & Mental Wellness",
  "Veteran Support",
  "Senior Wellness",
  "Loneliness & Social Connection",
  "Divorce Recovery",
  "Faith & Spiritual Support",
  "Life Transitions",
  "Trauma Recovery",
  "Cancer Support",
  "Single Parent Support",
  "Addiction Recovery",
  "Autism & Special Needs Families",
  "Singles Social Support",
  "Married No Kids",
  "Career Change Support",
  "Financial Recovery",
  "Sports & Fitness",
  "Local Activity Groups",
];

const CATEGORY_ICONS = {
  All: "✨",
  "Caregiver Support": "🤲",
  "Grief & Loss": "🌿",
  "Sober & Clean Living": "🍃",
  "New Parent Support": "👶",
  "Chronic Illness Support": "🎗️",
  "Anxiety & Mental Wellness": "🧘",
  "Veteran Support": "🎖️",
  "Senior Wellness": "🌻",
  "Loneliness & Social Connection": "💙",
  "Divorce Recovery": "🌱",
  "Faith & Spiritual Support": "🙏",
  "Life Transitions": "🔄",
  "Trauma Recovery": "🕊️",
  "Cancer Support": "💛",
  "Single Parent Support": "👨‍👧",
  "Addiction Recovery": "⭐",
  "Autism & Special Needs Families": "🦋",
  "Singles Social Support": "🌟",
  "Married No Kids": "💑",
  "Career Change Support": "💼",
  "Financial Recovery": "💰",
  "Sports & Fitness": "🏃",
  "Local Activity Groups": "🎯",
};

const RELIGION_OPTIONS = [
  "None",
  "Spiritual but not religious",
  "Christian (Catholic)",
  "Christian (Protestant)",
  "Christian (Evangelical)",
  "Christian (Orthodox)",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Mormon / LDS",
  "Other",
];

const POLITICS_OPTIONS = [
  "Very Conservative",
  "Conservative",
  "Moderate",
  "Liberal",
  "Very Liberal",
];

const LIFE_STAGE_OPTIONS = [
  "Single",
  "In a relationship",
  "Married",
  "Divorced",
  "Widowed",
  "Empty nester",
  "Newly retired",
  "Retired",
];

const FAMILY_OPTIONS = [
  "No kids",
  "Expecting",
  "Kids under 5",
  "Kids 6-12",
  "Teenagers",
  "Adult children",
  "Grandchildren",
  "Homeschooling",
];

function GroupCard({ group, onClick, currentUser }) {
  // Compute "people like me" tags based on shared values with current user
  const peopleLikeMeTags = [];
  if (currentUser && group.memberValues) {
    const mv = group.memberValues;
    if (
      currentUser.religion &&
      (mv.religions || []).includes(currentUser.religion)
    ) {
      peopleLikeMeTags.push({ icon: "🙏", label: "Others share your faith" });
    }
    if (
      currentUser.politicalBeliefs &&
      (mv.politics || []).includes(currentUser.politicalBeliefs)
    ) {
      peopleLikeMeTags.push({ icon: "🗳️", label: "Similar values here" });
    }
    const sharedStages = (currentUser.lifeStage || []).filter((s) =>
      (mv.lifeStages || []).includes(s),
    );
    if (sharedStages.length > 0) {
      const label = sharedStages[0];
      peopleLikeMeTags.push({ icon: "👥", label: `${label} in this group` });
    }
    const sharedFamily = (currentUser.familySituation || []).filter((f) =>
      (mv.families || []).includes(f),
    );
    if (sharedFamily.length > 0) {
      peopleLikeMeTags.push({ icon: "👨‍👧", label: `${sharedFamily[0]} here` });
    }
  }

  return (
    <div className="group-card" onClick={() => onClick(group._id)}>
      <div className="group-card-header">
        <div className="group-icon">
          {group.coverPhoto ? (
            <img
              src={group.coverPhoto}
              alt={group.name}
              className="group-card-photo"
            />
          ) : (
            CATEGORY_ICONS[group.category] || "✨"
          )}
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
const US_STATES_FILTER = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const DISTANCE_OPTIONS = [
  { label: "Same city", value: "city" },
  { label: "25 miles", value: "25" },
  { label: "50 miles", value: "50" },
  { label: "100 miles", value: "100" },
  { label: "Statewide", value: "state" },
  { label: "Anywhere", value: "anywhere" },
];

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

  const set = (field, val) => onChange({ ...filters, [field]: val });

  const activeCount = [
    ...(filters.religion || []),
    ...(filters.politics || []),
    ...(filters.lifeStage || []),
    ...(filters.family || []),
    filters.city ? [1] : [],
    filters.state ? [1] : [],
    filters.distance ? [1] : [],
  ].flat().length;

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
          <button className="filter-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Location ── */}
      <div className="filter-section">
        <h4>📍 Location</h4>
        <div className="filter-location-row">
          <input
            type="text"
            className="filter-city-input"
            placeholder="City"
            value={filters.city || ""}
            onChange={(e) => set("city", e.target.value)}
          />
          <select
            className="filter-state-select"
            value={filters.state || ""}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">Any State</option>
            {US_STATES_FILTER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {userProfile?.city && (
          <button
            className="btn-use-my-location"
            onClick={() =>
              onChange({
                ...filters,
                city: userProfile.city,
                state: userProfile.state,
              })
            }
          >
            📍 Use my location ({userProfile.city}, {userProfile.state})
          </button>
        )}
      </div>

      {/* ── Distance ── */}
      <div className="filter-section">
        <h4>📏 Distance / Range</h4>
        <div className="filter-chips">
          {DISTANCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`filter-chip ${filters.distance === opt.value ? "active" : ""}`}
              onClick={() =>
                set(
                  "distance",
                  filters.distance === opt.value ? null : opt.value,
                )
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Faith ── */}
      <div className="filter-section">
        <h4>🙏 Faith / Religion</h4>
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

      {/* ── Politics ── */}
      <div className="filter-section">
        <h4>🗳️ Political Views</h4>
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

      {/* ── Life Stage ── */}
      <div className="filter-section">
        <h4>🌱 Life Stage</h4>
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

      {/* ── Family ── */}
      <div className="filter-section">
        <h4>👨‍👧 Family Situation</h4>
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
          onClick={() =>
            onChange({
              city: userProfile.city || "",
              state: userProfile.state || "",
              distance: "state",
              religion: userProfile.religion ? [userProfile.religion] : [],
              politics: userProfile.politicalBeliefs
                ? [userProfile.politicalBeliefs]
                : [],
              lifeStage: userProfile.lifeStage || [],
              family: userProfile.familySituation || [],
            })
          }
        >
          ✨ Match My Values &amp; Location
        </button>
      )}
    </div>
  );
}

export default function GroupsPage() {
  const navigate = useNavigate();
  const { user, groupInviteCount } = useAuth();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [forYouGroups, setForYouGroups] = useState([]);
  const [invitedGroups, setInvitedGroups] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [locationCity, setLocationCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [locationDistance, setLocationDistance] = useState("");

  const fetchingRef = useRef(false);
  const fetchTimerRef = useRef(null);

  const activeFilterCount = Object.values(filters).flat().length;

  // Client-side filter groups by values
  const applyFilters = useCallback(
    (groupList) => {
      if (activeFilterCount === 0) return groupList;
      return groupList.filter((group) => {
        const memberValues = group.memberValues || {};
        if (
          filters.religion?.length &&
          !filters.religion.some((r) =>
            (memberValues.religions || []).includes(r),
          )
        )
          return false;
        if (
          filters.politics?.length &&
          !filters.politics.some((p) =>
            (memberValues.politics || []).includes(p),
          )
        )
          return false;
        if (
          filters.lifeStage?.length &&
          !filters.lifeStage.some((l) =>
            (memberValues.lifeStages || []).includes(l),
          )
        )
          return false;
        if (
          filters.family?.length &&
          !filters.family.some((f) => (memberValues.families || []).includes(f))
        )
          return false;
        return true;
      });
    },
    [filters, activeFilterCount],
  );

  const fetchGroups = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== "All") params.category = selectedCategory;
      // Location search bar takes priority over filter drawer values
      const activeCity = locationCity.trim() || filters.city;
      const activeState = locationState.trim() || filters.state;
      const activeDist = locationDistance || filters.distance;
      if (activeCity) params.city = activeCity;
      if (activeState) params.state = activeState;
      if (activeDist) params.distance = activeDist;
      if (filters.religion?.length) params.religion = filters.religion;
      if (filters.politics?.length) params.politics = filters.politics;
      if (filters.lifeStage?.length) params.lifeStage = filters.lifeStage;
      if (filters.family?.length) params.family = filters.family;
      if (search) params.search = search;

      const [discoverRes, myRes, invitesRes] = await Promise.all([
        groupsAPI.getGroups(params),
        groupsAPI.getMyGroups(),
        groupsAPI.getMyInvites().catch(() => ({ data: { groups: [] } })),
      ]);

      const allGroups = discoverRes.data.groups || [];
      setGroups(allGroups);
      setMyGroups(myRes.data.groups || []);
      setInvitedGroups(invitesRes.data.groups || []);

      // "For You" — groups that share at least one value with user
      if (
        user?.religion ||
        user?.politicalBeliefs ||
        user?.lifeStage?.length ||
        user?.familySituation?.length
      ) {
        const forYou = allGroups.filter((g) => {
          if (g.isMember) return false;
          const mv = g.memberValues || {};
          if (user.religion && (mv.religions || []).includes(user.religion))
            return true;
          if (
            user.politicalBeliefs &&
            (mv.politics || []).includes(user.politicalBeliefs)
          )
            return true;
          if (user.lifeStage?.some((l) => (mv.lifeStages || []).includes(l)))
            return true;
          if (
            user.familySituation?.some((f) => (mv.families || []).includes(f))
          )
            return true;
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
  }, [
    selectedCategory,
    search,
    user,
    locationCity,
    locationState,
    locationDistance,
    filters.city,
    filters.state,
    filters.distance,
    filters.religion,
    filters.politics,
    filters.lifeStage,
    filters.family,
  ]);

  useEffect(() => {
    if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
    fetchTimerRef.current = setTimeout(() => fetchGroups(), 300);
    return () => clearTimeout(fetchTimerRef.current);
  }, [fetchGroups]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const baseGroups =
    activeTab === "my"
      ? myGroups
      : activeTab === "foryou"
        ? forYouGroups
        : groups;

  const handleRsvp = async (groupId, response) => {
    setRsvpStatus((prev) => ({ ...prev, [groupId]: response }));
    try {
      await groupsAPI.rsvpInvite(groupId, response);
      if (response === "accept") {
        setInvitedGroups((prev) => prev.filter((g) => g._id !== groupId));
        fetchGroups();
      } else if (response === "decline") {
        setInvitedGroups((prev) => prev.filter((g) => g._id !== groupId));
      }
    } catch (err) {
      setRsvpStatus((prev) => ({ ...prev, [groupId]: null }));
      alert(err.response?.data?.message || "Could not update RSVP");
    }
  };
  const displayedGroups = applyFilters(baseGroups);

  return (
    <div className="groups-page">
      {/* Header */}
      <div className="groups-header">
        <div className="groups-header-content">
          <div>
            <h1>Community Groups</h1>
            <p>
              Find local peer support groups, wellness communities, and
              caregiving networks near you
            </p>
          </div>
        </div>
        <button
          className="btn-create-group"
          onClick={() => navigate("/groups/create")}
        >
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
            <button type="submit" className="search-btn">
              Search
            </button>
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

      {/* Location Search Bar */}
      <div className="location-search-bar">
        <div className="location-search-inner">
          <div className="location-search-label">📍 Search by location</div>
          <div className="location-search-fields">
            <input
              type="text"
              className="location-city-field"
              placeholder="City"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
            />
            <select
              className="location-state-field"
              value={locationState}
              onChange={(e) => setLocationState(e.target.value)}
            >
              <option value="">Any State</option>
              {[
                "AL",
                "AK",
                "AZ",
                "AR",
                "CA",
                "CO",
                "CT",
                "DE",
                "FL",
                "GA",
                "HI",
                "ID",
                "IL",
                "IN",
                "IA",
                "KS",
                "KY",
                "LA",
                "ME",
                "MD",
                "MA",
                "MI",
                "MN",
                "MS",
                "MO",
                "MT",
                "NE",
                "NV",
                "NH",
                "NJ",
                "NM",
                "NY",
                "NC",
                "ND",
                "OH",
                "OK",
                "OR",
                "PA",
                "RI",
                "SC",
                "SD",
                "TN",
                "TX",
                "UT",
                "VT",
                "VA",
                "WA",
                "WV",
                "WI",
                "WY",
                "DC",
              ].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              className="location-distance-field"
              value={locationDistance}
              onChange={(e) => setLocationDistance(e.target.value)}
            >
              <option value="">Any distance</option>
              <option value="city">Same city</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
              <option value="state">Statewide</option>
              <option value="anywhere">Anywhere</option>
            </select>
            {(locationCity || locationState || locationDistance) && (
              <button
                className="location-clear-btn"
                onClick={() => {
                  setLocationCity("");
                  setLocationState("");
                  setLocationDistance("");
                }}
              >
                Clear
              </button>
            )}
            {user?.city && !locationCity && (
              <button
                className="location-use-mine-btn"
                onClick={() => {
                  setLocationCity(user.city);
                  setLocationState(user.state || "");
                }}
              >
                Use my location
              </button>
            )}
          </div>
        </div>
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
          style={{ position: "relative" }}
        >
          My Groups &amp; Invites
          {(groupInviteCount > 0 || invitedGroups.length > 0) && (
            <span className="tab-invite-badge">
              {groupInviteCount || invitedGroups.length}
            </span>
          )}
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
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 12 }}
          >
            {/* Dashed circle ring */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
            />

            {/* Center person — blue */}
            <circle cx="40" cy="28" r="7" fill="#2B6CB0" />
            <path
              d="M27 52c0-7.2 5.8-13 13-13s13 5.8 13 13"
              stroke="#2B6CB0"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            {/* Top-right person — green */}
            <circle cx="60" cy="24" r="5" fill="#38A169" />
            <path
              d="M51 44c0-5 4-9 9-9s9 4 9 9"
              stroke="#38A169"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Top-left person — orange */}
            <circle cx="20" cy="24" r="5" fill="#ED8936" />
            <path
              d="M11 44c0-5 4-9 9-9s9 4 9 9"
              stroke="#ED8936"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Bottom-right person — purple */}
            <circle cx="63" cy="50" r="4" fill="#805AD5" />

            {/* Bottom-left person — pink */}
            <circle cx="17" cy="50" r="4" fill="#D53F8C" />

            {/* Bottom person — teal */}
            <circle cx="40" cy="64" r="4" fill="#319795" />
          </svg>
          <h3>
            {activeTab === "my"
              ? "No Groups Yet"
              : activeTab === "foryou"
                ? "No Matches Yet"
                : "No Groups Found"}
          </h3>
          <p>
            {activeTab === "my"
              ? "Join a group from Discover to get started!"
              : activeTab === "foryou"
                ? "Fill in your profile to see support groups matched to your needs"
                : activeFilterCount > 0
                  ? "Try removing some filters"
                  : "Try a different category or search term"}
          </p>
          {activeTab === "foryou" && (
            <button
              className="btn-go-profile"
              onClick={() => navigate("/profile")}
            >
              Update My Profile →
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Group invites — shown at top of My Groups & Invites tab */}
          {activeTab === "my" && invitedGroups.length > 0 && (
            <div className="group-invites-section">
              <h3 className="group-invites-section-title">
                <span className="group-invites-section-badge">
                  {invitedGroups.length}
                </span>
                Pending Invitation{invitedGroups.length > 1 ? "s" : ""}
              </h3>
              {invitedGroups.map((group) => {
                const status = rsvpStatus[group._id];
                return (
                  <div key={group._id} className="group-invite-rsvp-card">
                    <div className="group-invite-rsvp-info">
                      <span className="group-invite-rsvp-icon">
                        {CATEGORY_ICONS[group.category] || "👥"}
                      </span>
                      <div>
                        <div className="group-invite-rsvp-name">
                          {group.name}
                        </div>
                        <div className="group-invite-rsvp-meta">
                          {group.category} · Invited by{" "}
                          {group.createdBy?.name || "Group Admin"}
                        </div>
                      </div>
                    </div>
                    {status ? (
                      <div className="group-invite-rsvp-confirmed">
                        {status === "accept"
                          ? "✓ Accepted"
                          : status === "maybe"
                            ? "~ Maybe"
                            : "✕ Can't Make It"}
                      </div>
                    ) : (
                      <div className="group-invite-rsvp-btns">
                        <button
                          className="btn-rsvp btn-rsvp-accept"
                          onClick={() => handleRsvp(group._id, "accept")}
                        >
                          ✓ Accept
                        </button>
                        <button
                          className="btn-rsvp btn-rsvp-maybe"
                          onClick={() => handleRsvp(group._id, "maybe")}
                        >
                          ~ Maybe
                        </button>
                        <button
                          className="btn-rsvp btn-rsvp-decline"
                          onClick={() => handleRsvp(group._id, "decline")}
                        >
                          ✕ Can't Make It
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
