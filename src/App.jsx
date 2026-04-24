import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardCharts from "./components/charts/DashboardCharts.jsx";
import StudentForm from "./components/students/StudentForm.jsx";
import PlacementGuide from "./components/placement/PlacementGuide.jsx";
import AIMentorChatbot from "./components/ai/AIMentorChatbot.jsx";
import Contacts from "./components/portal/Contacts.jsx";
import Messages from "./components/portal/Messages.jsx";
import Reviews from "./components/portal/Reviews.jsx";
import PlacementRecords from "./components/portal/PlacementRecords.jsx";
import GraphBackground from "./components/GraphBackground.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://ssca-backend.onrender.com/api";
const NAV_ITEMS = [
  { key: "overview", label: "Dashboard Overview", roles: ["admin", "teacher", "student"] },
  { key: "students", label: "Student Profiles", roles: ["admin", "teacher", "student"] },
  { key: "leaderboard", label: "Rankings", roles: ["admin", "teacher", "student"] },
  { key: "placement-records", label: "Placement Records", roles: ["admin", "teacher", "student"] },
  { key: "placement-guide", label: "Placement Guide", roles: ["student"] },
  { key: "reviews", label: "Alumni Reviews", roles: ["student", "admin"] },
  { key: "messages", label: "Leadership Messages", roles: ["student", "teacher"] },
  { key: "contacts", label: "Campus Directory", roles: ["admin", "teacher", "student"] },
  { key: "teachers", label: "Manage Teachers", roles: ["admin"] },
];
const CHART_COLORS = [
  "#1f6feb",
  "#f97316",
  "#16a34a",
  "#ef4444",
  "#8b5cf6",
  "#0f766e",
];

const request = async (path, token, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};

const initialTeacherForm = {
  username: "",
  password: "",
  branch: "CSE",
};

const getReadinessTone = (readinessLevel) => {
  if (readinessLevel === "Highly Placement Ready") return "positive";
  if (readinessLevel === "Moderately Ready") return "neutral";
  return "critical";
};

const App = () => {
  const [token, setToken] = useState(
    () => localStorage.getItem("smart-student-token") || "",
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("smart-student-user");
    return raw ? JSON.parse(raw) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem("app-theme") || "light");
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);
  const [loginRole, setLoginRole] = useState("student");
  const [activeView, setActiveView] = useState("overview");
  const [config, setConfig] = useState({ branches: [], weights: {} });
  const [students, setStudents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [teacherForm, setTeacherForm] = useState(initialTeacherForm);
  const [filters, setFilters] = useState({
    search: "",
    branch: "",
    readinessLevel: "",
    year: "",
    sortBy: "fullName",
    sortOrder: "asc",
  });
  const [loginForm, setLoginForm] = useState({
    username: "admin_123",
    password: "admin@123",
  });
  const [formState, setFormState] = useState({
    open: false,
    student: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const reportRef = useRef(null);

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );
  const branchAwareFilters = {
    ...filters,
    branch: user?.role === "teacher" ? user.branch : filters.branch,
  };
  const readinessPieData = overview
    ? Object.entries(overview.metrics.readinessDistribution || {}).map(
        ([name, value]) => ({
          name,
          value,
        }),
      )
    : [];
  const topWeakAreaData = overview?.weakAreas || [];
  const branchComparisonData = overview?.branchComparison || [];
  const skillDistributionData = (overview?.skillDistribution || []).slice(0, 8);
  const leaderboardData = overview?.leaderboard || [];
  const studentTableClassName =
    user?.role === "teacher" ? "student-table has-actions" : "student-table";

  const handleLogout = () => {
    localStorage.removeItem("smart-student-token");
    localStorage.removeItem("smart-student-user");
    setToken("");
    setUser(null);
    setStudents([]);
    setOverview(null);
    setSelectedStudent(null);
    setActiveView("overview");
  };

  const loadBootstrapData = async () => {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const [meResponse, configResponse] = await Promise.all([
        request("/auth/me", token),
        request("/config", token),
      ]);

      setUser(meResponse.user);
      setConfig(configResponse);
    } catch (loadError) {
      setError(loadError.message);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!token || !user) return;

    setLoading(true);
    setError("");

    const searchParams = new URLSearchParams();
    if (branchAwareFilters.branch)
      searchParams.set("branch", branchAwareFilters.branch);

    try {
      const [overviewResponse, studentsResponse, teachersResponse] =
        await Promise.all([
          request(`/dashboard/overview?${searchParams.toString()}`, token),
          request(
            `/students?${new URLSearchParams({
              search: branchAwareFilters.search,
              branch: branchAwareFilters.branch,
              readinessLevel: branchAwareFilters.readinessLevel,
              year: branchAwareFilters.year,
              sortBy: branchAwareFilters.sortBy,
              sortOrder: branchAwareFilters.sortOrder,
            }).toString()}`,
            token,
          ),
          user.role === "admin"
            ? request("/teachers", token)
            : Promise.resolve({ teachers: [] }),
        ]);

      setOverview(overviewResponse);
      setStudents(studentsResponse.students || []);
      setTeachers(teachersResponse.teachers || []);

      if (selectedStudent) {
        const refreshed = (studentsResponse.students || []).find(
          (student) => student.id === selectedStudent.id,
        );
        setSelectedStudent(refreshed || null);
      }
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootstrapData();
  }, [token]);

  useEffect(() => {
    if (!token || !user) return;
    loadDashboard();
  }, [
    token,
    user,
    branchAwareFilters.search,
    branchAwareFilters.branch,
    branchAwareFilters.readinessLevel,
    branchAwareFilters.year,
    branchAwareFilters.sortBy,
    branchAwareFilters.sortOrder,
  ]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await request("/auth/login", null, {
        method: "POST",
        body: JSON.stringify({ ...loginForm, role: loginRole }),
      });

      localStorage.setItem("smart-student-token", response.token);
      localStorage.setItem("smart-student-user", JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      setMessage("Login successful.");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSave = async (payload) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const path = formState.student?.id
        ? `/students/${formState.student.id}`
        : "/students";
      const method = formState.student?.id ? "PUT" : "POST";
      const response = await request(path, token, {
        method,
        body: JSON.stringify(payload),
      });

      setFormState({ open: false, student: null });
      setSelectedStudent(response.student);
      setMessage(
        formState.student?.id
          ? "Student profile updated."
          : "Student profile created.",
      );
      await loadDashboard();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Delete this student profile?")) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await request(`/students/${studentId}`, token, { method: "DELETE" });
      if (selectedStudent?.id === studentId) setSelectedStudent(null);
      setMessage("Student profile deleted.");
      await loadDashboard();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherCreate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await request("/teachers", token, {
        method: "POST",
        body: JSON.stringify(teacherForm),
      });
      setTeacherForm(initialTeacherForm);
      setMessage("Teacher account created.");
      await loadDashboard();
    } catch (teacherError) {
      setError(teacherError.message);
    } finally {
      setLoading(false);
    }
  };

  const exportSelectedStudentPdf = async () => {
    if (!reportRef.current || !selectedStudent) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: "#f3f7fb",
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, imageHeight);
    pdf.save(
      `${selectedStudent.fullName.replace(/\s+/g, "_")}_competency_report.pdf`,
    );
  };

  const renderFilters = ({ title, subtitle, includeSort = false }) => (
    <section className="card filters-card">
      <div className="filters-header">
        <div>
          <h3>{title}</h3>
          <span>{subtitle}</span>
        </div>
        {loading ? (
          <span className="loading-badge">Refreshing data...</span>
        ) : null}
      </div>

      <div className="filters-grid">
        <label className="filter-field search-field">
          <span>Search</span>
          <input
            placeholder="Name, PRN, roll number, or email"
            value={filters.search}
            onChange={(e) =>
              setFilters((current) => ({ ...current, search: e.target.value }))
            }
          />
        </label>

        {user.role === "admin" ? (
          <label className="filter-field">
            <span>Branch</span>
            <select
              value={filters.branch}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  branch: e.target.value,
                }))
              }
            >
              <option value="">All Branches</option>
              {config.branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="filter-static">
            <span>Assigned Branch</span>
            <strong>{user.branch}</strong>
          </div>
        )}

        <label className="filter-field">
          <span>Year</span>
          <select
            value={filters.year}
            onChange={(e) =>
              setFilters((current) => ({ ...current, year: e.target.value }))
            }
          >
            <option value="">All Years</option>
            <option value="SE">SE</option>
            <option value="TE">TE</option>
            <option value="BE">BE</option>
          </select>
        </label>

        <label className="filter-field">
          <span>Readiness</span>
          <select
            value={filters.readinessLevel}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                readinessLevel: e.target.value,
              }))
            }
          >
            <option value="">All Readiness Levels</option>
            <option value="Highly Placement Ready">
              Highly Placement Ready
            </option>
            <option value="Moderately Ready">Moderately Ready</option>
            <option value="Needs Significant Improvement">
              Needs Significant Improvement
            </option>
          </select>
        </label>

        {includeSort ? (
          <>
            <label className="filter-field">
              <span>Sort By</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    sortBy: e.target.value,
                  }))
                }
              >
                <option value="fullName">Name</option>
                <option value="branch">Branch</option>
                <option value="year">Year</option>
                <option value="overallScore">Score</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Order</span>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  setFilters((current) => ({
                    ...current,
                    sortOrder: e.target.value,
                  }))
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
          </>
        ) : null}
      </div>
    </section>
  );

  if (!token || !user) {
    return (
      <>
        <GraphBackground />
        <div className="login-screen">
        <div className="login-card">
          <h1>Smart Student Competency Analysis</h1>
          <div
            className="role-tabs"
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "8px",
            }}
          >
            {["student", "teacher", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setLoginRole(role);
                  setLoginForm({
                    username:
                      role === "admin"
                        ? "admin_123"
                        : role === "teacher"
                          ? "teacher_cse"
                          : "Raj Menon",
                    password: 
                      role === "admin" 
                        ? "admin@123" 
                        : role === "teacher"
                          ? "teacher@123"
                          : "241106001",
                  });
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "6px",
                  border: "none",
                  background: loginRole === role ? "white" : "transparent",
                  color: loginRole === role ? "#1f6feb" : "#64748b",
                  fontWeight: loginRole === role ? "600" : "500",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  boxShadow:
                    loginRole === role ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {role}
              </button>
            ))}
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <label>
              {loginRole === "student" ? "PRN / Username" : "Username"}
              <input
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm((current) => ({
                    ...current,
                    username: e.target.value,
                  }))
                }
                placeholder={`Enter your ${loginRole} ID`}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((current) => ({
                    ...current,
                    password: e.target.value,
                  }))
                }
                placeholder="Enter password"
              />
            </label>
            <button
              className="primary-button"
              type="submit"
              disabled={loading}
              style={{ width: "100%", marginTop: "8px" }}
            >
              {loading
                ? "Signing In..."
                : `Login as ${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}`}
            </button>
          </form>

          {error ? (
            <div
              className="form-error"
              style={{
                marginTop: "16px",
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          ) : null}
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <GraphBackground />
      <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-main">
          <div className="sidebar-brand">
            <div className="brand-mark">TNP</div>
            <div>
              <h2>Training & Placement Cell</h2>
            </div>
          </div>

          <nav className="nav-list" aria-label="Main navigation">
            {visibleNavItems.map((item) => (
              <button
                key={item.key}
                className={`nav-button ${activeView === item.key ? "active" : ""}`}
                type="button"
                onClick={() => setActiveView(item.key)}
              >
                <span>{item.label}</span>
                {activeView === item.key ? (
                  <span className="nav-indicator" />
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="profile-card">
            <span className="profile-role">{user.role}</span>
            <strong>{user.username}</strong>
            <span>{user.branch || "All branches"}</span>
          </div>
          <button
            className="sidebar-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-content-inner">
          <header className="topbar">
            <div>
              <h1>Smart Student Competency Analysis Dashboard</h1>
            </div>
            <div className="topbar-actions">
              <button
                className="ghost-button"
                style={{ padding: '8px 12px', borderRadius: '50%' }}
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                title="Toggle Light/Dark Mode"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              {loading ? (
                <span className="loading-badge">Syncing...</span>
              ) : null}
            </div>
          </header>

          {message ? <div className="toast success">{message}</div> : null}
          {error ? <div className="toast error">{error}</div> : null}

          {activeView === "overview" && overview ? (
            <>
              <section className="metric-grid">
                <article className="metric-card">
                  <span>Total Students</span>
                  <strong>{overview.metrics.totalStudents}</strong>
                  <p>Tracked across configured student profiles.</p>
                </article>
                <article className="metric-card">
                  <span>Average Competency Score</span>
                  <strong>{overview.metrics.averageCompetencyScore}</strong>
                  <p>
                    Weighted score based on academics, skills, projects, and
                    readiness.
                  </p>
                </article>
                <article className="metric-card">
                  <span>Branches Covered</span>
                  <strong>{overview.metrics.branchesCovered}</strong>
                  <p>
                    Admin gets cross-branch visibility, teachers stay
                    branch-scoped.
                  </p>
                </article>
                <article className="metric-card">
                  <span>Top Performer</span>
                  <strong>
                    {overview.topPerformers[0]?.fullName || "N/A"}
                  </strong>
                  <p>
                    {overview.topPerformers[0]?.readinessLevel ||
                      "No readiness insights yet."}
                  </p>
                </article>
              </section>

              <section className="dashboard-grid">
                <article className="card">
                  <div className="card-header">
                    <h3>Cross-Branch Comparison</h3>
                    <span>Average competency score by branch</span>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={branchComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="branch" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="averageScore"
                        fill="#1f6feb"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </article>

                <article className="card">
                  <div className="card-header">
                    <h3>Readiness Distribution</h3>
                    <span>Student readiness across the current scope</span>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={readinessPieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={110}
                      >
                        {readinessPieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </article>

                <article className="card">
                  <div className="card-header">
                    <h3>Skill Distribution</h3>
                    <span>Average score per high-signal skill</span>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={skillDistributionData}
                      layout="vertical"
                      margin={{ left: 10, right: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip />
                      <Bar
                        dataKey="averageScore"
                        fill="#16a34a"
                        radius={[0, 10, 10, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </article>

                <article className="card">
                  <div className="card-header">
                    <h3>Weak Areas</h3>
                    <span>Common flags observed across students</span>
                  </div>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={topWeakAreaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" hide />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#ef4444"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="legend-list">
                    {topWeakAreaData.map((item) => (
                      <span key={item.label}>
                        {item.label} ({item.count})
                      </span>
                    ))}
                  </div>
                </article>
              </section>
            </>
          ) : null}

          {activeView === "students" ? (
            <>
              {renderFilters({
                title: "Student Search & Sorting",
                subtitle:
                  "Quickly narrow the student list and compare profiles with cleaner controls.",
                includeSort: true,
              })}

              <section className="split-layout">
                <article className="card table-card">
                  <div className="card-header">
                    <div>
                      <h3>Student Profiles</h3>
                      <span>
                        Search, sort, and drill into competency analysis
                      </span>
                    </div>
                    <div className="detail-actions">
                      <span className="table-count">
                        {students.length} profiles
                      </span>
                      {user.role === "teacher" || user.role === "admin" ? (
                        <button
                          className="primary-button"
                          type="button"
                          onClick={() => setFormState({ open: true, student: null })}
                        >
                          Add Student
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="student-table-shell">
                    <div className={studentTableClassName}>
                      <div className="student-table-head">
                        <div>Name</div>
                        <div>Branch</div>
                        <div>Year</div>
                        <div>Score</div>
                        <div>Readiness</div>
                        {user.role === "teacher" || user.role === "admin" ? <div>Actions</div> : null}
                      </div>

                      {students.length ? (
                        students.map((student) => (
                          <div
                            className={`student-row ${selectedStudent?.id === student.id ? "selected" : ""}`}
                            key={student.id}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <div className="student-row-cell">
                              <strong>{student.fullName}</strong>
                              <small>{student.prn}</small>
                            </div>
                            <div className="student-row-cell">
                              {student.branch}
                            </div>
                            <div className="student-row-cell">
                              {student.year}
                            </div>
                            <div className="student-row-cell">
                              {student.score?.overallScore || 0}
                            </div>
                            <div className="student-row-cell">
                              <span
                                className={`status-pill ${getReadinessTone(
                                  student.score?.readinessLevel,
                                )}`}
                              >
                                {student.score?.readinessLevel}
                              </span>
                            </div>
                            {user.role === "teacher" || user.role === "admin" ? (
                              <div
                                className="row-actions"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="ghost-button"
                                  type="button"
                                  onClick={() =>
                                    setFormState({ open: true, student })
                                  }
                                >
                                  Edit
                                </button>
                                <button
                                  className="danger-button"
                                  type="button"
                                  onClick={() =>
                                    handleDeleteStudent(student.id)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <div className="empty-inline">
                          No student profiles match the current filters.
                        </div>
                      )}
                    </div>
                  </div>
                </article>

                <article className="card detail-card" ref={reportRef}>
                  {selectedStudent ? (
                    <>
                      <div className="detail-header">
                        <div>
                          <h3>{selectedStudent.fullName}</h3>
                          <p>
                            {selectedStudent.branch} / {selectedStudent.year} /{" "}
                            {selectedStudent.division}
                          </p>
                        </div>
                        <div className="detail-actions">
                          <div
                            className={`status-pill ${getReadinessTone(
                              selectedStudent.score?.readinessLevel,
                            )}`}
                          >
                            {selectedStudent.score?.readinessLevel}
                          </div>
                          <button
                            className="secondary-button"
                            type="button"
                            onClick={exportSelectedStudentPdf}
                          >
                            Export PDF
                          </button>
                        </div>
                      </div>

                      <section className="detail-summary-grid">
                        <article className="summary-card">
                          <span>Overall Score</span>
                          <strong>
                            {selectedStudent.score?.overallScore || 0}
                          </strong>
                        </article>
                        <article className="summary-card">
                          <span>CGPA</span>
                          <strong>{selectedStudent.currentCgpa}</strong>
                        </article>
                        <article className="summary-card">
                          <span>Aptitude</span>
                          <strong>{selectedStudent.aptitudeScore}</strong>
                        </article>
                        <article className="summary-card">
                          <span>Attendance</span>
                          <strong>{selectedStudent.overallAttendance}%</strong>
                        </article>
                      </section>

                      <DashboardCharts student={selectedStudent} />
                    </>
                  ) : (
                    <div className="empty-state">
                      <h3>Select a student</h3>
                      <p>
                        Pick a row from the table to inspect detailed competency
                        charts and rule-based insights.
                      </p>
                    </div>
                  )}
                </article>
              </section>
            </>
          ) : null}

          {activeView === "leaderboard" ? (
            <section className="card">
              <div className="card-header">
                <div>
                  <h3>Ranking Leaderboard</h3>
                  <span>Top students by weighted competency score</span>
                </div>
                <span className="table-count">
                  {leaderboardData.length} ranked entries
                </span>
              </div>
              <div className="leaderboard-list">
                {leaderboardData.length ? (
                  leaderboardData.map((student) => (
                    <div className="leaderboard-row" key={student.id}>
                      <div className="leaderboard-rank">#{student.rank}</div>
                      <div className="leaderboard-meta">
                        <strong>{student.fullName}</strong>
                        <span>
                          {student.branch} / {student.year}
                        </span>
                      </div>
                      <div className="leaderboard-score">
                        <strong>{student.overallScore}</strong>
                        <span
                          className={`status-pill ${getReadinessTone(student.readinessLevel)}`}
                        >
                          {student.readinessLevel}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-inline">
                    No leaderboard data is available yet.
                  </div>
                )}
              </div>
            </section>
          ) : null}

          {activeView === "placement-guide" ? <PlacementGuide /> : null}

          {activeView === "contacts" ? <Contacts /> : null}
          {activeView === "messages" ? <Messages /> : null}
          {activeView === "reviews" ? <Reviews /> : null}
          {activeView === "placement-records" ? <PlacementRecords /> : null}

          {activeView === "teachers" && user.role === "admin" ? (
            <section className="split-layout">
              <article className="card">
                <div className="card-header">
                  <div>
                    <h3>Create Teacher Account</h3>
                    <span>
                      Admin-only teacher provisioning with branch assignment
                    </span>
                  </div>
                </div>
                <form className="teacher-form" onSubmit={handleTeacherCreate}>
                  <label>
                    Username
                    <input
                      value={teacherForm.username}
                      onChange={(e) =>
                        setTeacherForm((current) => ({
                          ...current,
                          username: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      value={teacherForm.password}
                      onChange={(e) =>
                        setTeacherForm((current) => ({
                          ...current,
                          password: e.target.value,
                        }))
                      }
                    />
                  </label>
                  <label>
                    Branch
                    <select
                      value={teacherForm.branch}
                      onChange={(e) =>
                        setTeacherForm((current) => ({
                          ...current,
                          branch: e.target.value,
                        }))
                      }
                    >
                      {config.branches.map((branch) => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button className="primary-button" type="submit">
                    Create Teacher
                  </button>
                </form>
              </article>

              <article className="card">
                <div className="card-header">
                  <div>
                    <h3>Teacher Directory</h3>
                    <span>Current branch assignments</span>
                  </div>
                  <span className="table-count">
                    {teachers.length} teachers
                  </span>
                </div>
                <div className="leaderboard-list">
                  {teachers.length ? (
                    teachers.map((teacher) => (
                      <div className="leaderboard-row" key={teacher.id}>
                        <div className="leaderboard-meta">
                          <strong>{teacher.username}</strong>
                          <span>{teacher.role}</span>
                        </div>
                        <div className="leaderboard-score">
                          <strong>{teacher.branch}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-inline">
                      No teacher accounts have been created yet.
                    </div>
                  )}
                </div>
              </article>
            </section>
          ) : null}

          <StudentForm
            isOpen={formState.open}
            initialValue={formState.student}
            teacherBranch={user.role === "teacher" ? user.branch : null}
            branchOptions={
              config.branches.length ? config.branches : ["CSE", "IT", "EXTC"]
            }
            onClose={() => setFormState({ open: false, student: null })}
            onSave={handleStudentSave}
          />
        </div>
      </main>

      {/* AI Chatbot Pop-up for all roles */}
      <AIMentorChatbot
        studentId={selectedStudent?.id || user?.id || "default"}
        token={token}
        apiBaseUrl={API_BASE_URL}
      />
    </div>
    </>
  );
};

export default App;
