import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeam = () => {
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/team');
      setMembers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ background: '#121214', border: '1px solid #2A2A2D', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: '"DM Sans", sans-serif', color: '#FFF', margin: '0 0 16px 0' }}>Manage Team</h3>
        <p style={{ color: '#AAA', fontSize: '14px', fontFamily: '"DM Sans", sans-serif' }}>IMPORTANT: Use real photos. This is what clients see. No AI avatars.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {members.map(member => (
          <div key={member.id} style={{ background: '#121214', border: '1px solid #2A2A2D', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#2A2A2D', border: '2px solid #E8622A', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {member.photo_url ? <img src={member.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#888', fontSize: '12px' }}>No Photo</span>}
              </div>
              <div>
                <input value={member.name} style={{ background: 'transparent', border: '1px solid #333', color: '#FFF', padding: '4px 8px', borderRadius: '4px', marginBottom: '4px', width: '100%', fontFamily: '"DM Sans", sans-serif' }} readOnly />
                <input value={member.role} style={{ background: 'transparent', border: '1px solid #333', color: '#E8622A', padding: '4px 8px', borderRadius: '4px', width: '100%', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }} readOnly />
              </div>
            </div>
            <textarea value={member.bio} style={{ width: '100%', background: '#1A1A1D', border: '1px solid #333', color: '#FFF', padding: '8px', borderRadius: '8px', height: '80px', marginBottom: '12px', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }} readOnly />
            <input value={member.skills} style={{ width: '100%', background: '#1A1A1D', border: '1px solid #333', color: '#AAA', padding: '8px', borderRadius: '8px', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }} readOnly />
            <button style={{ width: '100%', background: '#E8622A', border: 'none', color: '#FFF', padding: '8px', borderRadius: '8px', marginTop: '16px', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif' }}>Save Changes</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeam;
