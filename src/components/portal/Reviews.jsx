import React, { useState } from 'react';

const Reviews = () => {
  const [reviews, setReviews] = useState([
    { name: 'Rahul Desai', branch: 'CSE', year: 'BE', review: 'The placement cell was incredibly supportive! Got placed at Microsoft. The mock interviews really helped.', rating: 5 },
    { name: 'Sneha Patil', branch: 'IT', year: 'TE', review: 'The new AI mock interview feature is amazing. It gave me exact areas to improve before my actual rounds.', rating: 4 },
    { name: 'Amit Kumar', branch: 'EXTC', year: 'BE', review: 'Great guidance from the TPO. The roadmap provided was very accurate for my target companies.', rating: 5 }
  ]);
  const [newReview, setNewReview] = useState({ name: '', branch: 'CSE', year: 'BE', review: '', rating: 5 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newReview.name && newReview.review) {
      setReviews([newReview, ...reviews]);
      setNewReview({ name: '', branch: 'CSE', year: 'BE', review: '', rating: 5 });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-header" style={{ marginBottom: '24px' }}>
          <div>
            <h3>Student Experiences & Reviews</h3>
            <span>Read what our students have to say about the placement process.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((r, idx) => (
            <div key={idx} style={{ padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#0f172a' }}>{r.name}</strong>
                <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{r.branch} • {r.year}</div>
              <p style={{ margin: 0, color: '#334155', fontSize: '14px', lineHeight: '1.5' }}>"{r.review}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '24px', height: 'fit-content' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Write a Review</h4>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" placeholder="Your Name" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} required />
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={newReview.branch} onChange={e => setNewReview({...newReview, branch: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="EXTC">EXTC</option>
            </select>
            <select value={newReview.year} onChange={e => setNewReview({...newReview, year: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="SE">SE</option>
              <option value="TE">TE</option>
              <option value="BE">BE</option>
            </select>
          </div>
          <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value={5}>5 Stars - Excellent</option>
            <option value={4}>4 Stars - Very Good</option>
            <option value={3}>3 Stars - Good</option>
            <option value={2}>2 Stars - Fair</option>
            <option value={1}>1 Star - Poor</option>
          </select>
          <textarea placeholder="Share your placement experience..." value={newReview.review} onChange={e => setNewReview({...newReview, review: e.target.value})} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px', resize: 'vertical' }} required />
          <button type="submit" className="primary-button" style={{ padding: '10px' }}>Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;
