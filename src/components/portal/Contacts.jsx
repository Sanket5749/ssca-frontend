import React from 'react';

const Contacts = () => {
  const contacts = [
    { name: 'Dr. Ramesh Kumar', role: 'Training & Placement Officer (TPO)', email: 'tpo@college.edu', phone: '+91-9876543210', dept: 'Placement Cell' },
    { name: 'Prof. Anita Sharma', role: 'Head of CSE', email: 'hod.cse@college.edu', phone: '+91-9876543211', dept: 'CSE' },
    { name: 'Prof. Vivek Singh', role: 'Head of IT', email: 'hod.it@college.edu', phone: '+91-9876543212', dept: 'IT' },
    { name: 'Dr. Sunita Patel', role: 'Head of EXTC', email: 'hod.extc@college.edu', phone: '+91-9876543213', dept: 'EXTC' },
    { name: 'Mr. Rohan Desai', role: 'Placement Coordinator', email: 'rohan.d@college.edu', phone: '+91-9876543214', dept: 'Placement Cell' },
  ];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3>Directory & Contacts</h3>
          <span>Contact details for the Training & Placement Cell and Department Heads.</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {contacts.map((contact, idx) => (
          <div key={idx} style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0f172a' }}>{contact.name}</h4>
            <span style={{ display: 'block', fontSize: '14px', color: '#1f6feb', fontWeight: '500', marginBottom: '12px' }}>{contact.role}</span>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}><strong>Email:</strong> {contact.email}</div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '4px' }}><strong>Phone:</strong> {contact.phone}</div>
            <div style={{ fontSize: '13px', color: '#475569' }}><strong>Department:</strong> {contact.dept}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contacts;
