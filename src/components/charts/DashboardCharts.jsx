import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#1f6feb", "#f97316", "#16a34a", "#ef4444", "#0f766e", "#8b5cf6"];

const renderInsightList = (items, emptyMessage) => {
  if (!items?.length) {
    return <p className="empty-copy">{emptyMessage}</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

const DashboardCharts = ({ student }) => {
  if (!student) return null;

  const score = student.score || {};
  const skillLookup = student.skills?.reduce((map, skill) => {
    map[skill.name] = skill.score || 0;
    return map;
  }, {}) || {};

  const radarData = [
    { subject: "DSA", score: skillLookup.DSA || 0 },
    { subject: "Frontend", score: skillLookup["Frontend Development"] || 0 },
    { subject: "Backend", score: skillLookup["Backend Development"] || 0 },
    { subject: "MERN", score: skillLookup.MERN || 0 },
    { subject: "DBMS", score: skillLookup.DBMS || 0 },
    { subject: "OS", score: skillLookup["Operating Systems"] || 0 },
    { subject: "CN", score: skillLookup["Computer Networks"] || 0 },
  ];

  const categoryData = [
    { label: "Academics", value: score.academicsScore || 0 },
    { label: "Skills", value: score.skillsScore || 0 },
    { label: "Projects", value: score.projectsScore || 0 },
    { label: "Certifications", value: score.certificationsScore || 0 },
    { label: "Aptitude", value: score.aptitudeCodingScore || 0 },
    { label: "Extra", value: score.extracurricularScore || 0 },
  ];

  const semesterData =
    student.semesterRecords
      ?.slice()
      .sort((first, second) => first.semesterNumber - second.semesterNumber)
      .map((record) => ({
        semester: `Sem ${record.semesterNumber}`,
        gpa: Number(record.gpa),
      })) || [];

  return (
    <div className="detail-grid">
      <div className="card chart-card">
        <div className="card-header">
          <h3>Skill Radar</h3>
          <span>Core technical footprint</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <Radar dataKey="score" stroke="#1f6feb" fill="#1f6feb" fillOpacity={0.4} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <div className="card-header">
          <h3>Score Breakdown</h3>
          <span>Category-wise competency scoring</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <div className="card-header">
          <h3>Semester Trend</h3>
          <span>{score.trend || "Stable"} performance movement</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={semesterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semester" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="gpa" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card chart-card">
        <div className="card-header">
          <h3>Competency Mix</h3>
          <span>Weighted score distribution</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="label"
              outerRadius={110}
              innerRadius={60}
              paddingAngle={3}
            >
              {categoryData.map((item, index) => (
                <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card narrative-card">
        <div className="card-header">
          <h3>Automated Strengths & Risks</h3>
          <span>Advanced Competency Intelligence Engine</span>
        </div>
        <div className="insight-columns">
          <div>
            <h4>Strengths</h4>
            {renderInsightList(score.strengths, "No strong signals have been flagged yet.")}
          </div>
          <div>
            <h4>Weaknesses</h4>
            {renderInsightList(score.weaknesses, "No major weakness patterns were detected.")}
          </div>
          <div>
            <h4>Risk Flags</h4>
            {renderInsightList(score.risks, "No active placement risk flags at the moment.")}
          </div>
        </div>
      </div>

      <div className="card narrative-card">
        <div className="card-header">
          <h3>Recommendations & Skill Gaps</h3>
          <span>Actionable placement-prep steps</span>
        </div>
        <div className="insight-columns">
          <div>
            <h4>Suggestions</h4>
            {renderInsightList(score.suggestions, "No additional recommendations are required right now.")}
          </div>
          <div>
            <h4>Skill Gap Analysis</h4>
            <div className="pill-list">
              {(score.skillGap || []).length ? (
                (score.skillGap || []).map((item) => (
                  <span className="pill" key={item}>
                    {item}
                  </span>
                ))
              ) : (
                <p className="empty-copy">No placement skill gaps are currently highlighted.</p>
              )}
            </div>
          </div>
          <div>
            <h4>Placement Readiness</h4>
            <div className="score-panel">
              <span className="score-value">{score.overallScore || 0}</span>
              <span className="score-label">{score.readinessLevel}</span>
              <p>Trend: {score.trend}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
