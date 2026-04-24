import React, { useState } from 'react';

const PlacementGuide = () => {
  const [activeDept, setActiveDept] = useState('CSE');
  const [activeYear, setActiveYear] = useState('First Year');

  const guides = {
    'CSE': {
      title: 'Computer Science & Engineering',
      companies: ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys'],
      years: {
        'First Year': {
          focus: 'Foundation & Logic Building',
          topics: ['C/C++ Programming', 'Basic Mathematics for CS', 'Introduction to Git/GitHub', 'Basic Web (HTML/CSS)'],
          resources: [
            { name: 'CS50 (Harvard)', link: 'https://cs50.harvard.edu/x/' },
            { name: 'GeeksforGeeks (C++)', link: 'https://www.geeksforgeeks.org/c-plus-plus/' },
            { name: 'FreeCodeCamp', link: 'https://www.freecodecamp.org/' },
            { name: 'Codecademy (Intro)', link: 'https://www.codecademy.com/' },
            { name: 'Coursera (Programming)', link: 'https://www.coursera.org/' }
          ]
        },
        'Second Year': {
          focus: 'Core Fundamentals & DSA',
          topics: ['Data Structures', 'Algorithms', 'Object-Oriented Programming (Java/Python)', 'Database Management'],
          resources: [
            { name: 'LeetCode', link: 'https://leetcode.com' },
            { name: 'NPTEL (Data Structures)', link: 'https://nptel.ac.in/courses/106102064' },
            { name: 'HackerRank', link: 'https://www.hackerrank.com/' },
            { name: 'Codeforces', link: 'https://codeforces.com/' },
            { name: 'Udemy (Java Masterclass)', link: 'https://www.udemy.com/' }
          ]
        },
        'Third Year': {
          focus: 'Advanced Core & Development',
          topics: ['Operating Systems', 'Computer Networks', 'Full-Stack Projects', 'Aptitude Preparation'],
          resources: [
            { name: 'NeetCode', link: 'https://neetcode.io/' },
            { name: 'GeeksforGeeks (Core CS)', link: 'https://www.geeksforgeeks.org/' },
            { name: 'IndiaBix (Aptitude)', link: 'https://www.indiabix.com/' }
          ]
        },
        'Final Year': {
          focus: 'System Design & Interviews',
          topics: ['System Design (LLD/HLD)', 'Mock Interviews', 'Company-specific Prep', 'Resume Polish'],
          resources: [
            { name: 'InterviewBit', link: 'https://www.interviewbit.com/' },
            { name: 'Pramp (Mock Interviews)', link: 'https://www.pramp.com/' },
            { name: 'Grokking System Design', link: 'https://www.designgurus.io/' }
          ]
        }
      }
    },
    'IT': {
      title: 'Information Technology',
      companies: ['Amazon', 'Accenture', 'Cognizant', 'Capgemini'],
      years: {
        'First Year': {
          focus: 'Programming Basics',
          topics: ['C Programming', 'Web Basics', 'Logic Development'],
          resources: [
            { name: 'GeeksforGeeks', link: 'https://www.geeksforgeeks.org/' },
            { name: 'W3Schools', link: 'https://www.w3schools.com/' },
            { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/' },
            { name: 'edX (Intro to IT)', link: 'https://www.edx.org/' }
          ]
        },
        'Second Year': {
          focus: 'DSA & Web Technologies',
          topics: ['Data Structures', 'JavaScript/React', 'SQL & Databases'],
          resources: [
            { name: 'Frontend Masters', link: 'https://frontendmasters.com/' },
            { name: 'LeetCode', link: 'https://leetcode.com' },
            { name: 'NPTEL (DBMS)', link: 'https://nptel.ac.in/' }
          ]
        },
        'Third Year': {
          focus: 'Cloud & App Development',
          topics: ['Cloud Computing (AWS/Azure)', 'Computer Networks', 'Software Engineering'],
          resources: [
            { name: 'AWS Skill Builder', link: 'https://explore.skillbuilder.aws/' },
            { name: 'Coursera (IT)', link: 'https://www.coursera.org/' }
          ]
        },
        'Final Year': {
          focus: 'Placements & Architecture',
          topics: ['System Architecture', 'Interview Prep', 'Aptitude Tests'],
          resources: [
            { name: 'InterviewBit', link: 'https://www.interviewbit.com/' },
            { name: 'IndiaBix', link: 'https://www.indiabix.com/' }
          ]
        }
      }
    },
    'EXTC': {
      title: 'Electronics & Telecommunication',
      companies: ['Qualcomm', 'Intel', 'Cisco', 'Ericsson', 'TCS'],
      years: {
        'First Year': {
          focus: 'Circuit Fundamentals',
          topics: ['Basic Electronics', 'C Programming', 'Engineering Mathematics'],
          resources: [
            { name: 'NPTEL (Basic Electronics)', link: 'https://nptel.ac.in/' },
            { name: 'All About Circuits', link: 'https://www.allaboutcircuits.com/' },
            { name: 'Coursera (Electronics)', link: 'https://www.coursera.org/' },
            { name: 'Electronics Tutorials', link: 'https://www.electronics-tutorials.ws/' }
          ]
        },
        'Second Year': {
          focus: 'Core Electronics',
          topics: ['Digital Logic Design', 'Signals and Systems', 'Microprocessors'],
          resources: [
            { name: 'NPTEL (Digital Circuits)', link: 'https://nptel.ac.in/' },
            { name: 'TutorialsPoint (Microprocessors)', link: 'https://www.tutorialspoint.com/' }
          ]
        },
        'Third Year': {
          focus: 'Communication & Networks',
          topics: ['Communication Systems', 'Computer Networks', 'Embedded Systems / IoT'],
          resources: [
            { name: 'Cisco Networking Academy', link: 'https://www.netacad.com/' },
            { name: 'Arduino/IoT Projects', link: 'https://create.arduino.cc/projecthub' }
          ]
        },
        'Final Year': {
          focus: 'Industry Readiness',
          topics: ['VLSI Design', 'Mock Interviews', 'IT/Software crossover skills (Python/C++)'],
          resources: [
            { name: 'GeeksforGeeks (IT placement)', link: 'https://www.geeksforgeeks.org/' },
            { name: 'IndiaBix (Aptitude)', link: 'https://www.indiabix.com/' }
          ]
        }
      }
    }
  };

  const departments = Object.keys(guides);
  const years = ['First Year', 'Second Year', 'Third Year', 'Final Year'];
  
  const currentGuide = guides[activeDept];
  const currentYearData = currentGuide.years[activeYear];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h3>Year-Wise Placement Guide</h3>
          <span>Targeted preparation strategies, topics, and official resources per department and year.</span>
        </div>
      </div>

      {/* Department Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <strong style={{ alignSelf: 'center', marginRight: '8px', color: '#374151' }}>Department:</strong>
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #1f6feb',
              background: activeDept === dept ? '#1f6feb' : 'white',
              color: activeDept === dept ? 'white' : '#1f6feb',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {guides[dept].title}
          </button>
        ))}
      </div>

      {/* Year Selector */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <strong style={{ alignSelf: 'center', marginRight: '8px', color: '#374151' }}>Academic Year:</strong>
        {years.map(year => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #f97316',
              background: activeYear === year ? '#f97316' : 'white',
              color: activeYear === year ? 'white' : '#f97316',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {year}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Core Topics Panel */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', fontWeight: 'bold' }}>Primary Focus</span>
            <h4 style={{ margin: '4px 0 16px 0', color: '#0f172a', fontSize: '18px' }}>🎯 {currentYearData.focus}</h4>
          </div>
          
          <strong style={{ display: 'block', marginBottom: '8px', color: '#334155' }}>Core Topics to Study:</strong>
          <ul style={{ paddingLeft: '20px', margin: 0, color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentYearData.topics.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>

        {/* Resources Panel */}
        <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0369a1', fontSize: '18px' }}>🔗 Official Resources & Links</h4>
          <p style={{ fontSize: '13px', color: '#0284c7', marginBottom: '16px' }}>Click to visit the official learning platforms:</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentYearData.resources.map((r, i) => (
              <a 
                key={i} 
                href={r.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  background: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  color: '#0284c7', 
                  textDecoration: 'none',
                  border: '1px solid #7dd3fc',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.1s, box-shadow 0.1s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              >
                <span>{r.name}</span>
                <span style={{ fontSize: '16px' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Companies Panel (Spans full width at bottom) */}
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
          <h4 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>🏢 Top Recruiting Companies for {guides[activeDept].title}</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {currentGuide.companies.map((c, i) => (
              <span key={i} style={{ padding: '6px 12px', background: '#e2e8f0', borderRadius: '4px', color: '#334155', fontWeight: '500', fontSize: '14px' }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementGuide;
