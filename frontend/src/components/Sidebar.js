import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BarChart2, Brain, Shield, Info } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/map', label: 'Crime Map', icon: Map },
  { path: '/charts', label: 'Charts', icon: BarChart2 },
  { path: '/prediction', label: 'Prediction', icon: Brain },
  { path: '/about', label: 'About', icon: Info },
];

function Sidebar() {
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    fetch('https://crimewatch-backend-ljak.onrender.com/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setApiStatus('online');
        else setApiStatus('offline');
      })
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#1e293b',
      borderRight: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 32px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={28} color="#f97316" />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f1f5f9' }}>
              CrimeWatch
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Nigeria Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ padding: '24px 12px', flex: 1 }}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '4px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#f97316' : '#94a3b8',
              backgroundColor: isActive ? '#f9731615' : 'transparent',
              borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
              transition: 'all 0.2s',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* API Status */}
      <div style={{
        margin: '0 12px 16px 12px',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        padding: '12px 16px',
        border: '1px solid #334155',
      }}>
        <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>
          API STATUS
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor:
              apiStatus === 'online' ? '#10b981' :
              apiStatus === 'offline' ? '#ef4444' : '#eab308',
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color:
              apiStatus === 'online' ? '#10b981' :
              apiStatus === 'offline' ? '#ef4444' : '#eab308',
          }}>
            {apiStatus === 'online' ? 'Backend Connected' :
             apiStatus === 'offline' ? 'Backend Offline' : 'Checking...'}
          </span>
        </div>
        {apiStatus === 'online' && (
          <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
            5,000 records loaded
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid #334155' }}>
        <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center' }}>
          LAUTECH CS Final Year
        </div>
        <div style={{ fontSize: '11px', color: '#475569', textAlign: 'center' }}>
          2025/2026
        </div>
      </div>
    </div>
  );
}

export default Sidebar;