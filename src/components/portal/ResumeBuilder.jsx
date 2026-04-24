import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ResumeBuilder = ({ student }) => {
  const resumeRef = useRef(null);

  if (!student) {
    return (
      <div className="empty-state">
        <h3>No student data available</h3>
        <p>Please ensure your profile is complete to generate a resume.</p>
      </div>
    );
  }

  const exportPdf = async () => {
    if (!resumeRef.current) return;

    const canvas = await html2canvas(resumeRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imageData, "PNG", 0, 0, pageWidth, imageHeight);
    pdf.save(`${student.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
  };

  return (
    <div className="resume-builder-container">
      <div className="resume-actions">
        <h3>Resume Preview</h3>
        <button className="primary-button" onClick={exportPdf}>
          Download PDF
        </button>
      </div>

      <div className="resume-paper-wrapper">
        <div className="resume-paper" ref={resumeRef}>
          {/* Header */}
          <header className="resume-header">
            <div className="header-left">
              <h1>{student.fullName}</h1>
              <p className="subtitle">
                {student.branch} Engineering | {student.year}
              </p>
              <div className="header-badges">
                <span className="badge">{student.score?.readinessLevel}</span>
                <span className="badge score">Score: {student.score?.overallScore}</span>
              </div>
            </div>
            <div className="header-right">
              <div className="contact-item">
                <span>📧</span> {student.email}
              </div>
              <div className="contact-item">
                <span>📱</span> {student.phoneNumber}
              </div>
              {student.githubProfile && (
                <div className="contact-item">
                  <span>🔗</span> {student.githubProfile}
                </div>
              )}
              <div className="contact-item">
                <span>📍</span> Roll: {student.rollNumber} | PRN: {student.prn}
              </div>
            </div>
          </header>

          <div className="resume-content">
            <aside className="resume-sidebar">
              <section className="resume-section">
                <h2>Education</h2>
                <div className="edu-item">
                  <h3>B.E. in {student.branch}</h3>
                  <p className="highlight">CGPA: {student.currentCgpa}</p>
                </div>
                <div className="edu-item">
                  <h3>HSC Education</h3>
                  <p>{student.hscPercentage}% Score</p>
                </div>
                <div className="edu-item">
                  <h3>SSC Education</h3>
                  <p>{student.sscPercentage}% Score</p>
                </div>
              </section>

              <section className="resume-section">
                <h2>Technical Skills</h2>
                <div className="skills-container">
                  {student.skills?.map((skill, idx) => (
                    <div key={idx} className="skill-pill">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </section>

              <section className="resume-section">
                <h2>Competency</h2>
                <div className="competency-card">
                  <div className="comp-row">
                    <span>Aptitude:</span>
                    <span>{student.aptitudeScore}</span>
                  </div>
                  <div className="comp-row">
                    <span>Communication:</span>
                    <span>{student.communicationScore}</span>
                  </div>
                  <div className="comp-row">
                    <span>Attendance:</span>
                    <span>{student.overallAttendance}%</span>
                  </div>
                </div>
              </section>
            </aside>

            <main className="resume-main">
              <section className="resume-section">
                <h2>Technical Projects</h2>
                {student.projects?.map((project, idx) => (
                  <div key={idx} className="project-item">
                    <div className="project-header">
                      <h3>{project.title}</h3>
                      <span className="complexity">{project.complexity}</span>
                    </div>
                    <p className="tech-stack">{project.techStack}</p>
                    <p className="desc">{project.description}</p>
                    {project.githubLink && (
                      <a href={project.githubLink} className="link">View Source</a>
                    )}
                  </div>
                ))}
              </section>

              <section className="resume-section">
                <h2>Certifications</h2>
                <div className="cert-grid">
                  {student.certifications?.map((cert, idx) => (
                    <div key={idx} className="cert-item">
                      <strong>{cert.title}</strong>
                      <p>{cert.platform} • {cert.completedOn}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="resume-section">
                <h2>Extracurricular Activities</h2>
                {student.extracurriculars?.map((extra, idx) => (
                  <div key={idx} className="extra-item">
                    <strong>{extra.title}</strong>
                    <p>{extra.description}</p>
                  </div>
                ))}
              </section>
            </main>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .resume-builder-container {
          padding: 20px;
          height: calc(100vh - 120px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .resume-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          padding: 15px 25px;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 32px rgba(0,0,0,0.05);
        }
        .resume-actions h3 { margin: 0; color: #1e293b; }
        .resume-paper-wrapper {
          flex: 1;
          overflow-y: auto;
          background: #f8fafc;
          padding: 40px;
          border-radius: 15px;
          display: flex;
          justify-content: center;
        }
        .resume-paper {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 25mm 20mm;
          box-shadow: 0 0 50px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          color: #334155;
        }
        .resume-header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 30px;
          margin-bottom: 30px;
          border-bottom: 3px solid #1f6feb;
        }
        .header-left h1 {
          font-size: 32px;
          margin: 0;
          color: #0f172a;
          letter-spacing: -1px;
        }
        .header-left .subtitle {
          color: #1f6feb;
          font-weight: 600;
          margin: 5px 0 15px 0;
          font-size: 16px;
        }
        .header-badges {
          display: flex;
          gap: 10px;
        }
        .badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          background: #eff6ff;
          color: #1f6feb;
          text-transform: uppercase;
        }
        .badge.score { background: #f0fdf4; color: #16a34a; }
        
        .header-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 13px;
        }
        .contact-item span { margin-right: 5px; opacity: 0.7; }

        .resume-content {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          flex: 1;
        }
        .resume-section h2 {
          font-size: 14px;
          font-weight: 800;
          color: #1e293b;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }
        .edu-item, .project-item, .cert-item, .extra-item {
          margin-bottom: 20px;
        }
        .edu-item h3, .project-item h3 {
          font-size: 15px;
          margin: 0 0 5px 0;
          color: #0f172a;
        }
        .edu-item p, .project-item p, .cert-item p, .extra-item p {
          font-size: 13px;
          margin: 0;
          line-height: 1.6;
        }
        .highlight { color: #1f6feb; font-weight: 700; }
        
        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skill-pill {
          background: #f1f5f9;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 600;
        }
        
        .competency-card {
          background: #f8fafc;
          padding: 15px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .comp-row {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 500;
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .complexity {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          background: #f1f5f9;
          color: #64748b;
        }
        .tech-stack {
          color: #1f6feb;
          font-weight: 600;
          font-size: 12px !important;
          margin-bottom: 8px !important;
        }
        .project-item .desc {
          color: #475569;
          margin-bottom: 8px !important;
        }
        .project-item .link {
          font-size: 12px;
          color: #1f6feb;
          text-decoration: none;
          font-weight: 600;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .cert-item strong { font-size: 13px; display: block; }
      ` }} />
    </div>
  );
};

export default ResumeBuilder;
