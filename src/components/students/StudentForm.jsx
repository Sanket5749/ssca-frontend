import { useEffect, useState } from "react";

const createEmptyStudent = (branch = "CSE") => ({
  prn: "",
  rollNumber: "",
  fullName: "",
  branch,
  division: "",
  year: "BE",
  email: "",
  phoneNumber: "",
  sscPercentage: 0,
  hscPercentage: 0,
  currentCgpa: 0,
  backlogsCount: 0,
  overallAttendance: 0,
  aptitudeScore: 0,
  mockInterviewScore: 0,
  communicationScore: 0,
  leetCodeSolved: 0,
  codeChefRating: 0,
  codeChefStars: 0,
  githubProfile: "",
  semesterRecords: [{ semesterNumber: 1, gpa: 0 }],
  attendanceRecords: [{ subjectName: "", attendancePercentage: 0 }],
  skills: [
    { category: "technical", name: "DSA", level: "Intermediate", score: 70 },
    { category: "technical", name: "Frontend Development", level: "Intermediate", score: 70 },
    { category: "technical", name: "Backend Development", level: "Intermediate", score: 70 },
    { category: "coreSubject", name: "DBMS", level: "Intermediate", score: 70 },
  ],
  certifications: [{ title: "", platform: "", completedOn: "", relevanceScore: 0 }],
  projects: [
    { title: "", techStack: "", complexity: "Medium", githubLink: "", description: "" },
  ],
  extracurriculars: [{ category: "Hackathon", title: "", impactScore: 0, description: "" }],
});

const numberFields = new Set([
  "sscPercentage",
  "hscPercentage",
  "currentCgpa",
  "backlogsCount",
  "overallAttendance",
  "aptitudeScore",
  "mockInterviewScore",
  "communicationScore",
  "leetCodeSolved",
  "codeChefRating",
  "codeChefStars",
]);

const StudentForm = ({
  isOpen,
  initialValue,
  teacherBranch,
  branchOptions,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(createEmptyStudent(teacherBranch || "CSE"));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setForm(
      initialValue
        ? {
            ...createEmptyStudent(initialValue.branch || teacherBranch || "CSE"),
            ...initialValue,
            semesterRecords: initialValue.semesterRecords?.length
              ? initialValue.semesterRecords
              : [{ semesterNumber: 1, gpa: 0 }],
            attendanceRecords: initialValue.attendanceRecords?.length
              ? initialValue.attendanceRecords
              : [{ subjectName: "", attendancePercentage: 0 }],
            skills: initialValue.skills?.length
              ? initialValue.skills
              : createEmptyStudent(teacherBranch || "CSE").skills,
            certifications: initialValue.certifications?.length
              ? initialValue.certifications
              : createEmptyStudent(teacherBranch || "CSE").certifications,
            projects: initialValue.projects?.length
              ? initialValue.projects
              : createEmptyStudent(teacherBranch || "CSE").projects,
            extracurriculars: initialValue.extracurriculars?.length
              ? initialValue.extracurriculars
              : createEmptyStudent(teacherBranch || "CSE").extracurriculars,
          }
        : createEmptyStudent(teacherBranch || "CSE")
    );
    setError("");
  }, [initialValue, isOpen, teacherBranch]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: numberFields.has(field) ? Number(value) : value,
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: ["semesterNumber", "gpa", "attendancePercentage", "score", "relevanceScore", "impactScore"].includes(field)
                ? Number(value)
                : value,
            }
          : item
      ),
    }));
  };

  const addArrayItem = (section, template) => {
    setForm((current) => ({
      ...current,
      [section]: [...current[section], template],
    }));
  };

  const removeArrayItem = (section, index) => {
    setForm((current) => ({
      ...current,
      [section]:
        current[section].length > 1
          ? current[section].filter((_, itemIndex) => itemIndex !== index)
          : current[section],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.prn || !form.fullName || !form.email || !form.branch || !form.rollNumber) {
      setError("Please complete the required basic information fields.");
      return;
    }

    onSave({
      ...form,
      branch: teacherBranch || form.branch,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <h2>{initialValue?.id ? "Edit Student Profile" : "Add Student Profile"}</h2>
            <p>Structured competency data entry with dynamic project and certification sections.</p>
          </div>
          <button className="ghost-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="student-form" onSubmit={handleSubmit}>
          {error ? <div className="form-error">{error}</div> : null}

          <section className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <label>
                PRN (9-digit password)
                <input value={form.prn} onChange={(e) => updateField("prn", e.target.value)} placeholder="e.g. 123456789" required />
              </label>
              <label>
                Roll Number
                <input value={form.rollNumber} onChange={(e) => updateField("rollNumber", e.target.value)} required />
              </label>
              <label className="span-2">
                Full Name
                <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
              </label>
              <label>
                Branch
                <select
                  value={teacherBranch || form.branch}
                  onChange={(e) => updateField("branch", e.target.value)}
                  disabled={Boolean(teacherBranch)}
                >
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Division
                <input value={form.division} onChange={(e) => updateField("division", e.target.value)} required />
              </label>
              <label>
                Year
                <select value={form.year} onChange={(e) => updateField("year", e.target.value)}>
                  <option value="SE">SE</option>
                  <option value="TE">TE</option>
                  <option value="BE">BE</option>
                </select>
              </label>
              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
              </label>
              <label>
                Phone Number
                <input value={form.phoneNumber} onChange={(e) => updateField("phoneNumber", e.target.value)} required />
              </label>
              <label className="span-2">
                GitHub Profile
                <input value={form.githubProfile} onChange={(e) => updateField("githubProfile", e.target.value)} />
              </label>
            </div>
          </section>

          <section className="form-section">
            <h3>Academic & Placement Metrics</h3>
            <div className="form-grid">
              <label>
                SSC %
                <input type="number" min="0" max="100" value={form.sscPercentage} onChange={(e) => updateField("sscPercentage", e.target.value)} />
              </label>
              <label>
                HSC %
                <input type="number" min="0" max="100" value={form.hscPercentage} onChange={(e) => updateField("hscPercentage", e.target.value)} />
              </label>
              <label>
                Current CGPA
                <input type="number" min="0" max="10" step="0.01" value={form.currentCgpa} onChange={(e) => updateField("currentCgpa", e.target.value)} />
              </label>
              <label>
                Backlogs
                <input type="number" min="0" value={form.backlogsCount} onChange={(e) => updateField("backlogsCount", e.target.value)} />
              </label>
              <label>
                Overall Attendance %
                <input type="number" min="0" max="100" value={form.overallAttendance} onChange={(e) => updateField("overallAttendance", e.target.value)} />
              </label>
              <label>
                Aptitude Score
                <input type="number" min="0" max="100" value={form.aptitudeScore} onChange={(e) => updateField("aptitudeScore", e.target.value)} />
              </label>
              <label>
                Mock Interview Score
                <input type="number" min="0" max="100" value={form.mockInterviewScore} onChange={(e) => updateField("mockInterviewScore", e.target.value)} />
              </label>
              <label>
                Communication Score
                <input type="number" min="0" max="100" value={form.communicationScore} onChange={(e) => updateField("communicationScore", e.target.value)} />
              </label>
              <label>
                LeetCode Solved
                <input type="number" min="0" value={form.leetCodeSolved} onChange={(e) => updateField("leetCodeSolved", e.target.value)} />
              </label>
              <label>
                CodeChef Rating
                <input type="number" min="0" value={form.codeChefRating} onChange={(e) => updateField("codeChefRating", e.target.value)} />
              </label>
              <label>
                CodeChef Stars
                <input type="number" min="0" max="7" value={form.codeChefStars} onChange={(e) => updateField("codeChefStars", e.target.value)} />
              </label>
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Semester-wise GPA</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() => addArrayItem("semesterRecords", { semesterNumber: form.semesterRecords.length + 1, gpa: 0 })}
              >
                Add Semester
              </button>
            </div>
            <div className="dynamic-list">
              {form.semesterRecords.map((record, index) => (
                <div className="dynamic-card compact-dynamic-card" key={`semester-${index}`}>
                  <label>
                    Semester
                    <input type="number" min="1" value={record.semesterNumber} onChange={(e) => updateArrayItem("semesterRecords", index, "semesterNumber", e.target.value)} />
                  </label>
                  <label>
                    GPA
                    <input type="number" min="0" max="10" step="0.01" value={record.gpa} onChange={(e) => updateArrayItem("semesterRecords", index, "gpa", e.target.value)} />
                  </label>
                  <div className="dynamic-card-actions">
                    <button className="ghost-button" type="button" onClick={() => removeArrayItem("semesterRecords", index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Subject-wise Attendance</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() => addArrayItem("attendanceRecords", { subjectName: "", attendancePercentage: 0 })}
              >
                Add Subject
              </button>
            </div>
            <div className="dynamic-list">
              {form.attendanceRecords.map((record, index) => (
                <div className="dynamic-card compact-dynamic-card" key={`attendance-${index}`}>
                  <label>
                    Subject
                    <input value={record.subjectName} onChange={(e) => updateArrayItem("attendanceRecords", index, "subjectName", e.target.value)} />
                  </label>
                  <label>
                    Attendance %
                    <input type="number" min="0" max="100" value={record.attendancePercentage} onChange={(e) => updateArrayItem("attendanceRecords", index, "attendancePercentage", e.target.value)} />
                  </label>
                  <div className="dynamic-card-actions">
                    <button className="ghost-button" type="button" onClick={() => removeArrayItem("attendanceRecords", index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Skills</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  addArrayItem("skills", {
                    category: "technical",
                    name: "",
                    level: "Beginner",
                    score: 40,
                  })
                }
              >
                Add Skill
              </button>
            </div>
            <div className="dynamic-list">
              {form.skills.map((skill, index) => (
                <div className="dynamic-card grid-4" key={`skill-${index}`}>
                  <label>
                    Category
                    <select value={skill.category} onChange={(e) => updateArrayItem("skills", index, "category", e.target.value)}>
                      <option value="technical">Technical</option>
                      <option value="language">Language</option>
                      <option value="coreSubject">Core Subject</option>
                    </select>
                  </label>
                  <label>
                    Name
                    <input value={skill.name} onChange={(e) => updateArrayItem("skills", index, "name", e.target.value)} />
                  </label>
                  <label>
                    Level
                    <select value={skill.level || "Beginner"} onChange={(e) => updateArrayItem("skills", index, "level", e.target.value)}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </label>
                  <label>
                    Score
                    <input type="number" min="0" max="100" value={skill.score || 0} onChange={(e) => updateArrayItem("skills", index, "score", e.target.value)} />
                  </label>
                  <div className="dynamic-card-actions">
                    <button className="ghost-button" type="button" onClick={() => removeArrayItem("skills", index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Certifications</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() => addArrayItem("certifications", { title: "", platform: "", completedOn: "", relevanceScore: 0 })}
              >
                Add Certification
              </button>
            </div>
            <div className="dynamic-list">
              {form.certifications.map((certification, index) => (
                <div className="dynamic-card grid-4" key={`certification-${index}`}>
                  <label>
                    Title
                    <input value={certification.title} onChange={(e) => updateArrayItem("certifications", index, "title", e.target.value)} />
                  </label>
                  <label>
                    Platform
                    <input value={certification.platform} onChange={(e) => updateArrayItem("certifications", index, "platform", e.target.value)} />
                  </label>
                  <label>
                    Date
                    <input type="date" value={certification.completedOn || ""} onChange={(e) => updateArrayItem("certifications", index, "completedOn", e.target.value)} />
                  </label>
                  <label>
                    Relevance Score
                    <input type="number" min="0" max="100" value={certification.relevanceScore || 0} onChange={(e) => updateArrayItem("certifications", index, "relevanceScore", e.target.value)} />
                  </label>
                  <div className="dynamic-card-actions">
                    <button className="ghost-button" type="button" onClick={() => removeArrayItem("certifications", index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Projects</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  addArrayItem("projects", {
                    title: "",
                    techStack: "",
                    complexity: "Medium",
                    githubLink: "",
                    description: "",
                  })
                }
              >
                Add Project
              </button>
            </div>
            <div className="dynamic-list">
              {form.projects.map((project, index) => (
                <div className="dynamic-card project-card" key={`project-${index}`}>
                  <div className="form-grid">
                    <label>
                      Title
                      <input value={project.title} onChange={(e) => updateArrayItem("projects", index, "title", e.target.value)} />
                    </label>
                    <label>
                      Tech Stack
                      <input value={project.techStack} onChange={(e) => updateArrayItem("projects", index, "techStack", e.target.value)} />
                    </label>
                    <label>
                      Complexity
                      <select value={project.complexity} onChange={(e) => updateArrayItem("projects", index, "complexity", e.target.value)}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </label>
                    <label>
                      GitHub Link
                      <input value={project.githubLink || ""} onChange={(e) => updateArrayItem("projects", index, "githubLink", e.target.value)} />
                    </label>
                    <label className="span-2">
                      Description
                      <textarea rows="3" value={project.description} onChange={(e) => updateArrayItem("projects", index, "description", e.target.value)} />
                    </label>
                  </div>
                  <button className="ghost-button" type="button" onClick={() => removeArrayItem("projects", index)}>
                    Remove Project
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <div className="section-header">
              <h3>Extracurriculars</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() =>
                  addArrayItem("extracurriculars", {
                    category: "Club",
                    title: "",
                    impactScore: 0,
                    description: "",
                  })
                }
              >
                Add Activity
              </button>
            </div>
            <div className="dynamic-list">
              {form.extracurriculars.map((activity, index) => (
                <div className="dynamic-card grid-4" key={`activity-${index}`}>
                  <label>
                    Category
                    <select value={activity.category} onChange={(e) => updateArrayItem("extracurriculars", index, "category", e.target.value)}>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Club">Club</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Achievement">Achievement</option>
                    </select>
                  </label>
                  <label>
                    Title
                    <input value={activity.title} onChange={(e) => updateArrayItem("extracurriculars", index, "title", e.target.value)} />
                  </label>
                  <label>
                    Impact Score
                    <input type="number" min="0" max="100" value={activity.impactScore || 0} onChange={(e) => updateArrayItem("extracurriculars", index, "impactScore", e.target.value)} />
                  </label>
                  <label className="span-2">
                    Description
                    <textarea rows="2" value={activity.description || ""} onChange={(e) => updateArrayItem("extracurriculars", index, "description", e.target.value)} />
                  </label>
                  <div className="dynamic-card-actions">
                    <button className="ghost-button" type="button" onClick={() => removeArrayItem("extracurriculars", index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-button" type="submit">
              Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { createEmptyStudent };
export default StudentForm;
