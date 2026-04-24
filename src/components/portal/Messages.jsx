import React from 'react';

const Messages = () => {
  const messages = [
    {
      title: 'Message from the President',
      name: 'Dr. Arvind Rao',
      message: 'Welcome to our institution. Our goal is to foster an environment of academic excellence and continuous learning, ensuring every student reaches their full potential and is fully prepared to take on the challenges of the modern professional world.',
      image: 'https://ui-avatars.com/api/?name=Arvind+Rao&background=0d8abc&color=fff'
    },
    {
      title: 'Message from the Vice President',
      name: 'Mrs. Meena Agarwal',
      message: 'We believe in holistic development. It is our endeavor to empower our students with both technical expertise and essential life skills, building confident professionals ready for global opportunities.',
      image: 'https://ui-avatars.com/api/?name=Meena+Agarwal&background=eab308&color=fff'
    },
    {
      title: 'Message from the Director',
      name: 'Dr. K. V. Sharma',
      message: 'Our placement cell is dedicated to bridging the gap between industry and academia. We work closely with top recruiters to ensure our students get the best opportunities to start their careers on a high note.',
      image: 'https://ui-avatars.com/api/?name=K+V+Sharma&background=ef4444&color=fff'
    }
  ];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <div>
          <h3>Leadership Messages</h3>
          <span>Words of wisdom and guidance from our institution's leadership.</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '20px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <img src={msg.image} alt={msg.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: '#1f6feb', fontSize: '18px' }}>{msg.title}</h4>
              <strong style={{ display: 'block', color: '#0f172a', marginBottom: '12px' }}>{msg.name}</strong>
              <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontStyle: 'italic' }}>"{msg.message}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
