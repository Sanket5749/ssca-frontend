import React, { useState } from 'react';

const PlacementRecords = () => {
  const [activeYear, setActiveYear] = useState('2025');

  const recordsByYear = {
    '2025': [
      { name: 'Kavya Singh', branch: 'CSE', company: 'Meta', package: '60 LPA', role: 'Software Engineer' },
      { name: 'Aarav Sharma', branch: 'IT', company: 'Amazon', package: '45 LPA', role: 'SDE-1' },
      { name: 'Ishaan Verma', branch: 'EXTC', company: 'Qualcomm', package: '25 LPA', role: 'Hardware Engineer' },
      { name: 'Diya Patel', branch: 'CSE', company: 'Apple', package: '55 LPA', role: 'iOS Developer' },
      { name: 'Riya Gupta', branch: 'IT', company: 'Netflix', package: '50 LPA', role: 'UI Engineer' },
    ],
    '2024': [
      { name: 'Ravi Teja', branch: 'CSE', company: 'Google', package: '40 LPA', role: 'Software Engineer' },
      { name: 'Priya Iyer', branch: 'IT', company: 'Microsoft', package: '42 LPA', role: 'SDE-2' },
      { name: 'Sameer Khan', branch: 'EXTC', company: 'Intel', package: '20 LPA', role: 'Verification Engineer' },
      { name: 'Aditya Rao', branch: 'CSE', company: 'Uber', package: '38 LPA', role: 'Backend Engineer' },
      { name: 'Megha Nair', branch: 'IT', company: 'Flipkart', package: '26 LPA', role: 'SDE-1' },
    ],
    '2023': [
      { name: 'Aditi Sharma', branch: 'CSE', company: 'Google', package: '32 LPA', role: 'Software Engineer' },
      { name: 'Rohan Verma', branch: 'IT', company: 'Amazon', package: '28 LPA', role: 'SDE-1' },
      { name: 'Sneha Patil', branch: 'EXTC', company: 'Cisco', package: '18 LPA', role: 'Network Engineer' },
      { name: 'Vikram Singh', branch: 'CSE', company: 'Microsoft', package: '42 LPA', role: 'Software Engineer' },
      { name: 'Pooja Iyer', branch: 'IT', company: 'TCS Digital', package: '7 LPA', role: 'System Engineer' },
    ],
    '2022': [
      { name: 'Arjun Reddy', branch: 'CSE', company: 'Atlassian', package: '45 LPA', role: 'Frontend Engineer' },
      { name: 'Neha Gupta', branch: 'EXTC', company: 'Intel', package: '15 LPA', role: 'Hardware Engineer' },
      { name: 'Karan Patel', branch: 'IT', company: 'Capgemini', package: '6.5 LPA', role: 'Analyst' },
      { name: 'Sanya Mirza', branch: 'CSE', company: 'Goldman Sachs', package: '22 LPA', role: 'Tech Analyst' },
    ],
    '2021': [
      { name: 'Rahul Bose', branch: 'IT', company: 'Infosys', package: '5 LPA', role: 'System Engineer' },
      { name: 'Anjali Menon', branch: 'CSE', company: 'Adobe', package: '38 LPA', role: 'MTS' },
      { name: 'Deepak Kumar', branch: 'EXTC', company: 'Ericsson', package: '12 LPA', role: 'Telecom Engineer' },
    ]
  };

  const currentRecords = recordsByYear[activeYear];

  // Calculate summary stats
  const totalPlaced = currentRecords.length;
  const highestPackage = Math.max(...currentRecords.map(r => parseFloat(r.package)));
  const topCompanies = [...new Set(currentRecords.map(r => r.company))].slice(0, 3).join(', ');

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Alumni Placement Records</h3>
          <span>Explore the successful placement history of our pass-out students.</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['2025', '2024', '2023', '2022', '2021'].map(year => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #1f6feb',
                background: activeYear === year ? '#1f6feb' : 'white',
                color: activeYear === year ? 'white' : '#1f6feb',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Batch {year}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd', textAlign: 'center' }}>
          <div style={{ color: '#0369a1', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Highest Package</div>
          <div style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>{highestPackage} LPA</div>
        </div>
        <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <div style={{ color: '#166534', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Key Recruiters</div>
          <div style={{ color: '#0f172a', fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>{topCompanies}</div>
        </div>
        <div style={{ background: '#fdf4ff', padding: '16px', borderRadius: '8px', border: '1px solid #fbcfe8', textAlign: 'center' }}>
          <div style={{ color: '#86198f', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>Total Highlights</div>
          <div style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800' }}>{totalPlaced}+</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Alumni Name</th>
            <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Branch</th>
            <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Company</th>
            <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Role</th>
            <th style={{ padding: '12px', color: '#475569', fontWeight: '600' }}>Package</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '12px', fontWeight: '500', color: '#0f172a' }}>{record.name}</td>
              <td style={{ padding: '12px', color: '#64748b' }}>{record.branch}</td>
              <td style={{ padding: '12px', color: '#1f6feb', fontWeight: '500' }}>{record.company}</td>
              <td style={{ padding: '12px', color: '#475569' }}>{record.role}</td>
              <td style={{ padding: '12px', color: '#16a34a', fontWeight: '600' }}>{record.package}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlacementRecords;
