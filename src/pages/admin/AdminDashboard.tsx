import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'Total Bookings', value: '142', sub: '+12 this week' },
          { label: 'Revenue This Month', value: '₹45,000', sub: '+₹5,000 from last month' },
          { label: 'Upcoming Sessions', value: '8', sub: 'Next: Tomorrow at 10:00 AM' },
          { label: 'Today\'s Capacity', value: '2/3', sub: 'Manage →' }
        ].map((stat, i) => (
          <div key={i} style={{ background: '#121214', border: '1px solid #2A2A2D', borderRadius: '16px', padding: '24px' }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '36px', color: '#FFF', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#AAA', marginBottom: '12px' }}>{stat.label}</div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: i === 0 || i === 1 ? '#2ECC71' : '#E8622A', cursor: i === 3 ? 'pointer' : 'default' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#121214', border: '1px solid #2A2A2D', borderRadius: '16px', overflow: 'hidden' }}>
        <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', margin: '24px', color: '#FFF' }}>Recent Bookings</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"DM Sans", sans-serif', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A2D', color: '#AAA', textAlign: 'left' }}>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Plan</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Date</th>
              <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map(i => (
              <tr key={i} style={{ borderBottom: '1px solid #2A2A2D', color: '#FFF' }}>
                <td style={{ padding: '16px 24px' }}>John Doe</td>
                <td style={{ padding: '16px 24px' }}>Premium Video</td>
                <td style={{ padding: '16px 24px' }}>Oct {10 + i}, 2024</td>
                <td style={{ padding: '16px 24px' }}><span style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ECC71', padding: '4px 12px', borderRadius: '100px', fontSize: '12px' }}>PAID</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
