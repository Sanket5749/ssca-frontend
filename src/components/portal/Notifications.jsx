import React from 'react';

const Notifications = () => {
  const updates = [
    {
      id: 1,
      title: 'Google Recruitment Drive',
      message: 'Google is visiting the campus on May 15th for the Software Engineering role. Register by May 10th.',
      type: 'upcoming',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Microsoft Interview Results',
      message: 'The results for the final round of Microsoft interviews (TE students) are now available on the portal.',
      type: 'result',
      time: '5 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Amazon Application Deadline',
      message: 'Reminder: The deadline for Amazon SDE-1 applications is today at 11:59 PM.',
      type: 'deadline',
      time: '1 day ago',
      priority: 'high'
    },
    {
      id: 4,
      title: 'New Recruiter: NVIDIA',
      message: 'NVIDIA has been added to the recruiter list for the upcoming BE placement cycle.',
      type: 'new',
      time: '2 days ago',
      priority: 'low'
    },
    {
      id: 5,
      title: 'Capgemini Pre-Placement Talk',
      message: 'Join the PPT for Capgemini today at 4:00 PM in the Main Auditorium.',
      type: 'event',
      time: '3 hours ago',
      priority: 'medium'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'upcoming': return '📅';
      case 'result': return '🏆';
      case 'deadline': return '⏰';
      case 'new': return '🏢';
      case 'event': return '🎤';
      default: return '🔔';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <div>
          <h2>Recruiter Updates & Notifications</h2>
          <p>Stay informed about upcoming drives, deadlines, and placement results.</p>
        </div>
        <button className="ghost-button">Mark all as read</button>
      </div>

      <div className="notifications-list">
        {updates.map((update) => (
          <div key={update.id} className={`notification-item ${update.priority}`}>
            <div className="notification-icon">{getTypeIcon(update.type)}</div>
            <div className="notification-content">
              <div className="notification-meta">
                <span className="notification-type">{update.type}</span>
                <span className="notification-time">{update.time}</span>
              </div>
              <h3>{update.title}</h3>
              <p>{update.message}</p>
            </div>
            {update.priority === 'high' && <div className="priority-indicator" />}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .notifications-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .notifications-header h2 { margin: 0; color: #1e293b; }
        .notifications-header p { margin: 4px 0 0 0; color: #64748b; font-size: 14px; }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .notification-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          display: flex;
          gap: 16px;
          position: relative;
          transition: all 0.2s;
          cursor: pointer;
        }
        .notification-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border-color: #1f6feb;
        }
        .notification-icon {
          width: 48px;
          height: 48px;
          background: #f1f5f9;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .notification-content { flex: 1; }
        .notification-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .notification-type {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1f6feb;
          background: #eff6ff;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .notification-time {
          font-size: 12px;
          color: #94a3b8;
        }
        .notification-content h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #0f172a;
        }
        .notification-content p {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.5;
        }
        .priority-indicator {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: #ef4444;
          border-radius: 4px 0 0 4px;
        }
        .notification-item.high { border-left: 4px solid #ef4444; }
        .notification-item.medium { border-left: 4px solid #f59e0b; }
      ` }} />
    </div>
  );
};

export default Notifications;
