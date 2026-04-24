import { useState } from "react";

const GapAnalysis = ({ studentId, token, apiBaseUrl }) => {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/ai/gap-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gap analysis failed");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gap-analysis-container">
      <style>{`
        .gap-analysis-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin: 16px 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .gap-analysis-header {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }

        .jd-input-section {
          margin-bottom: 16px;
        }

        .jd-input-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          color: #374151;
        }

        .jd-textarea {
          width: 100%;
          min-height: 150px;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }

        .jd-textarea:focus {
          outline: none;
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31,111,235,0.1);
        }

        .analyze-button {
          background: #1f6feb;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .analyze-button:hover:not(:disabled) {
          background: #0d47a1;
        }

        .analyze-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analysis-results {
          margin-top: 24px;
        }

        .score-card {
          background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          text-align: center;
        }

        .score-value {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
        }

        .score-label {
          font-size: 14px;
          opacity: 0.9;
        }

        .skills-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .skills-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }

        .skills-card-title {
          font-weight: 600;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .matched {
          color: #16a34a;
        }

        .missing {
          color: #ef4444;
        }

        .skill-item {
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .roadmap-section {
          margin-top: 16px;
          background: #f0f9ff;
          border-left: 4px solid #1f6feb;
          padding: 16px;
          border-radius: 8px;
        }

        .roadmap-title {
          font-weight: 600;
          margin-bottom: 12px;
          color: #0c4a6e;
        }

        .roadmap-week {
          margin-bottom: 12px;
          background: white;
          padding: 12px;
          border-radius: 6px;
        }

        .week-label {
          font-weight: 600;
          color: #1f6feb;
          margin-bottom: 4px;
        }

        .week-description {
          font-size: 13px;
          color: #4b5563;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin: 16px 0;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          color: #6b7280;
        }

        .loader {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(31,111,235,0.2);
          border-top-color: #1f6feb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="gap-analysis-header">
        🎯 AI Gap Analysis
      </div>

      <div className="jd-input-section">
        <label className="jd-input-label">
          Enter Job Description:
        </label>
        <textarea
          className="jd-textarea"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the complete job description here... The AI will analyze your skills against the role requirements."
        />
      </div>

      <button
        className="analyze-button"
        onClick={handleAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Gap"}
      </button>

      {error && <div className="error-message">❌ {error}</div>}

      {loading && (
        <div className="loading">
          <div className="loader"></div>
          <p>Analyzing your profile against job requirements...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="analysis-results">
          <div className="score-card">
            <div className="score-label">Compatibility Score</div>
            <div className="score-value">
              {analysis.compatibilityScore || 0}%
            </div>
            <div className="score-label">
              {analysis.compatibilityScore >= 75
                ? "Great match!"
                : analysis.compatibilityScore >= 50
                ? "Moderate fit"
                : "Need more preparation"}
            </div>
          </div>

          <div className="skills-section">
            <div className="skills-card">
              <div className="skills-card-title matched">
                ✅ Matched Skills ({Array.isArray(analysis.matchedSkills) ? analysis.matchedSkills.length : 0})
              </div>
              {Array.isArray(analysis.matchedSkills) && analysis.matchedSkills.length > 0 ? (
                analysis.matchedSkills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    • {skill}
                  </div>
                ))
              ) : (
                <div className="skill-item">No matched skills yet</div>
              )}
            </div>

            <div className="skills-card">
              <div className="skills-card-title missing">
                ⚠️ Missing Skills ({Array.isArray(analysis.missingSkills) ? analysis.missingSkills.length : 0})
              </div>
              {Array.isArray(analysis.missingSkills) && analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    • {skill}
                  </div>
                ))
              ) : (
                <div className="skill-item">No missing skills!</div>
              )}
            </div>
          </div>

          {analysis.roadmap && (
            <div className="roadmap-section">
              <div className="roadmap-title">📅 4-Week Preparation Roadmap</div>
              {Object.entries(analysis.roadmap || {}).map(([week, description]) => (
                <div key={week} className="roadmap-week">
                  <div className="week-label">{week.toUpperCase()}</div>
                  <div className="week-description">{description}</div>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(analysis.projectIdeas) && analysis.projectIdeas.length > 0 && (
            <div className="roadmap-section" style={{ marginTop: "16px" }}>
              <div className="roadmap-title">💡 Recommended Projects</div>
              {analysis.projectIdeas.map((project, idx) => (
                <div key={idx} className="roadmap-week">
                  <div className="week-description">• {project}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GapAnalysis;
