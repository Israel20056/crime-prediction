import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, CartesianGrid
} from 'recharts';

const COLORS = ['#f97316', '#ef4444', '#3b82f6', '#eab308', '#a855f7',
                '#06b6d4', '#10b981', '#f43f5e', '#64748b', '#dc2626'];

const cardStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid #334155',
};

const tooltipStyle = {
  contentStyle: { backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' },
  labelStyle: { color: '#f1f5f9' },
  itemStyle: { color: '#f97316' },
};

function Charts() {
  const [crimeByType, setCrimeByType] = useState([]);
  const [crimeByState, setCrimeByState] = useState([]);
  const [crimeByMonth, setCrimeByMonth] = useState([]);
  const [crimeByYear, setCrimeByYear] = useState([]);
  const [fatalitiesByType, setFatalitiesByType] = useState([]);

  const monthOrder = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

  useEffect(() => {
    fetch('/nigeria_crime.csv')
      .then(res => res.text())
      .then(text => {
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        const data = result.data;

        // Crime by type
        const typeCounts = {};
        data.forEach(row => {
          typeCounts[row.crime_type] = (typeCounts[row.crime_type] || 0) + 1;
        });
        setCrimeByType(
          Object.entries(typeCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
        );

        // Crime by state (top 10)
        const stateCounts = {};
        data.forEach(row => {
          stateCounts[row.state] = (stateCounts[row.state] || 0) + 1;
        });
        setCrimeByState(
          Object.entries(stateCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10)
        );

        // Crime by month
        const monthCounts = {};
        data.forEach(row => {
          monthCounts[row.month] = (monthCounts[row.month] || 0) + 1;
        });
        setCrimeByMonth(
          monthOrder.map(m => ({ name: m.slice(0, 3), value: monthCounts[m] || 0 }))
        );

        // Crime by year
        const yearCounts = {};
        data.forEach(row => {
          yearCounts[row.year] = (yearCounts[row.year] || 0) + 1;
        });
        setCrimeByYear(
          Object.entries(yearCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name - b.name)
        );

        // Fatalities by crime type
        const fatalMap = {};
        data.forEach(row => {
          fatalMap[row.crime_type] = (fatalMap[row.crime_type] || 0) + parseInt(row.fatalities || 0);
        });
        setFatalitiesByType(
          Object.entries(fatalMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
        );
      });
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
          Crime Analytics
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Deep dive into Nigeria crime patterns and trends (2020–2024)
        </p>
      </div>

      {/* Row 1 - Crime by Type + Crime by State */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Crime by Type - Pie */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            Crime Distribution by Type
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={crimeByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {crimeByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 States */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            Top 10 States by Incidents
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={crimeByState} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {crimeByState.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 - Monthly Trend + Yearly Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Monthly trend */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            Monthly Crime Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={crimeByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly trend */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
            Yearly Crime Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={crimeByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3 - Fatalities by Crime Type */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '20px' }}>
          Total Fatalities by Crime Type
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={fatalitiesByType}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {fatalitiesByType.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Charts;