import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertTriangle, MapPin, Skull } from 'lucide-react';

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5',
                '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#6c2409'];

const tooltipStyle = {
  contentStyle: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' },
  labelStyle: { color: '#f1f5f9' },
  itemStyle: { color: '#f97316' },
};

function Overview() {
  const [stats, setStats] = useState(null);
  const [crimeByType, setCrimeByType] = useState([]);
  const [crimeByYear, setCrimeByYear] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then(res => {
        const data = res.data;
        setStats({
          totalCrimes: data.total_crimes,
          totalFatalities: data.total_fatalities,
          topState: data.top_state,
          topCrime: data.top_crime,
        });

        // Crime by type
        const typeData = Object.entries(data.crimes_by_type)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        setCrimeByType(typeData);

        // Crime by year
        const yearData = Object.entries(data.crimes_by_year)
          .map(([name, value]) => ({ name: String(name), value }))
          .sort((a, b) => a.name - b.name);
        setCrimeByYear(yearData);

        setLoading(false);
      })
      .catch(err => {
        console.error('Backend error:', err);
        setLoading(false);
      });
  }, []);

  const statCards = stats ? [
    { label: 'Total Incidents', value: stats.totalCrimes.toLocaleString(), icon: Shield, color: '#f97316', bg: '#f9731620' },
    { label: 'Total Fatalities', value: stats.totalFatalities.toLocaleString(), icon: Skull, color: '#ef4444', bg: '#ef444420' },
    { label: 'Highest Crime State', value: stats.topState, icon: MapPin, color: '#3b82f6', bg: '#3b82f620' },
    { label: 'Most Common Crime', value: stats.topCrime, icon: AlertTriangle, color: '#eab308', bg: '#eab30820' },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
          Nigeria Crime Overview
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Analysing 5,000 crime incidents across Nigeria (2020–2024)
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#64748b', fontSize: '14px' }}>Loading data from API...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} style={{
                backgroundColor: '#1e293b',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #334155',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>{label}</p>
                    <p style={{ fontSize: '22px', fontWeight: '700', color: '#f1f5f9' }}>{value}</p>
                  </div>
                  <div style={{ backgroundColor: bg, borderRadius: '10px', padding: '10px' }}>
                    <Icon size={22} color={color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
                Incidents by Crime Type
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={crimeByType} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={110} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {crimeByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
                Incidents by Year
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={crimeByYear}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Overview;