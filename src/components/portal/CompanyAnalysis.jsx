import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CompanyAnalysis = () => {
  // Mock data for company selection ratios
  const companyData = [
    { name: 'Google', selected: 12, applied: 150, ratio: '8%' },
    { name: 'Microsoft', selected: 18, applied: 200, ratio: '9%' },
    { name: 'Amazon', selected: 25, applied: 300, ratio: '8.3%' },
    { name: 'Meta', selected: 8, applied: 100, ratio: '8%' },
    { name: 'Apple', selected: 5, applied: 80, ratio: '6.2%' },
    { name: 'Netflix', selected: 3, applied: 50, ratio: '6%' },
  ];

  const studentSelections = [
    { name: 'Kavya Singh', company: 'Meta', package: '60 LPA', branch: 'CSE', date: '2025-03-12' },
    { name: 'Aarav Sharma', company: 'Amazon', package: '45 LPA', branch: 'IT', date: '2025-02-28' },
    { name: 'Ishaan Verma', company: 'Qualcomm', package: '25 LPA', branch: 'EXTC', date: '2025-01-15' },
    { name: 'Diya Patel', company: 'Apple', package: '55 LPA', branch: 'CSE', date: '2025-03-05' },
    { name: 'Riya Gupta', company: 'Netflix', package: '50 LPA', branch: 'IT', date: '2025-03-20' },
    { name: 'Ravi Teja', company: 'Google', package: '40 LPA', branch: 'CSE', date: '2024-11-10' },
    { name: 'Priya Iyer', company: 'Microsoft', package: '42 LPA', branch: 'IT', date: '2024-12-05' },
  ];

  const COLORS = ['#1f6feb', '#f97316', '#16a34a', '#ef4444', '#8b5cf6', '#0f766e'];

  return (
    <div className="company-analysis-container">
      <header className="analysis-header">
        <div className="header-info">
          <h2>Company Recruitment Analysis</h2>
          <p>Detailed breakdown of recruitment ratios and selected student trajectories.</p>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <span>Total Recruiters</span>
            <strong>45+</strong>
          </div>
          <div className="stat-pill">
            <span>Avg. Selection Rate</span>
            <strong>7.8%</strong>
          </div>
        </div>
      </header>

      <section className="analysis-grid">
        {/* Recruitment Ratio Chart */}
        <article className="card chart-card">
          <div className="card-header">
            <h3>Selection Ratios by Company</h3>
            <span>Comparison of students applied vs selected</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={companyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="selected" name="Selected Students" fill="#1f6feb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="applied" name="Total Applied" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Share Distribution */}
        <article className="card chart-card">
          <div className="card-header">
            <h3>Market Share</h3>
            <span>Placement distribution across top firms</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="selected"
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* Selected Students Table */}
      <section className="card table-card">
        <div className="card-header">
          <div>
            <h3>Recently Selected Students</h3>
            <span>A live feed of student success stories across major corporations.</span>
          </div>
          <button className="secondary-button">Export List</button>
        </div>
        <div className="table-shell">
          <table className="analysis-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Company</th>
                <th>Package Offered</th>
                <th>Branch</th>
                <th>Placement Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentSelections.map((student, idx) => (
                <tr key={idx}>
                  <td><strong>{student.name}</strong></td>
                  <td>
                    <span className="company-tag">{student.company}</span>
                  </td>
                  <td><span className="package-tag">{student.package}</span></td>
                  <td>{student.branch}</td>
                  <td>{student.date}</td>
                  <td>
                    <span className="status-pill positive">Selected</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .company-analysis-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .analysis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
        .header-info h2 { margin: 0; color: #1e293b; font-size: 24px; }
        .header-info p { margin: 4px 0 0 0; color: #64748b; font-size: 14px; }
        
        .header-stats { display: flex; gap: 12px; }
        .stat-pill {
          background: white;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          min-width: 120px;
        }
        .stat-pill span { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .stat-pill strong { font-size: 18px; color: #1f6feb; }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 24px;
        }
        .chart-card { min-height: 400px; }
        .chart-wrapper { padding: 20px; }

        .analysis-table {
          width: 100%;
          border-collapse: collapse;
        }
        .analysis-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f8fafc;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
        }
        .analysis-table td {
          padding: 16px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }
        .company-tag {
          background: #eff6ff;
          color: #1f6feb;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
        }
        .package-tag {
          color: #16a34a;
          font-weight: 700;
        }
        .status-pill.positive {
          background: #f0fdf4;
          color: #16a34a;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
      ` }} />
    </div>
  );
};

export default CompanyAnalysis;
