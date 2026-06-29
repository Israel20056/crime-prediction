import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const crimeColors = {
  'Armed Robbery': '#f97316',
  'Kidnapping': '#ef4444',
  'Cybercrime': '#3b82f6',
  'Assault': '#eab308',
  'Terrorism': '#dc2626',
  'Cult Clash': '#a855f7',
  'Burglary': '#06b6d4',
  'Fraud': '#10b981',
  'Drug Trafficking': '#f43f5e',
  'Homicide': '#64748b',
};

function CrimeMap() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/nigeria_crime.csv')
      .then(res => res.text())
      .then(text => {
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        setData(result.data);
        setFiltered(result.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = data;
    if (selectedType !== 'All') result = result.filter(r => r.crime_type === selectedType);
    if (selectedYear !== 'All') result = result.filter(r => r.year === selectedYear);
    setFiltered(result);
  }, [selectedType, selectedYear, data]);

  const crimeTypes = ['All', ...Object.keys(crimeColors)];
  const years = ['All', '2020', '2021', '2022', '2023', '2024'];

  const selectStyle = {
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    cursor: 'pointer',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
          Crime Map
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Interactive hotspot map of crime incidents across Nigeria
        </p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '16px 24px',
        border: '1px solid #334155',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '600' }}>FILTER BY:</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: '#64748b', fontSize: '13px' }}>Crime Type</label>
          <select style={selectStyle} value={selectedType} onChange={e => setSelectedType(e.target.value)}>
            {crimeTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ color: '#64748b', fontSize: '13px' }}>Year</label>
          <select style={selectStyle} value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div style={{ marginLeft: 'auto', backgroundColor: '#f9731620', borderRadius: '8px', padding: '6px 14px' }}>
          <span style={{ color: '#f97316', fontSize: '13px', fontWeight: '600' }}>
            {filtered.length.toLocaleString()} incidents shown
          </span>
        </div>
      </div>

      {/* Map */}
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #334155',
        height: '520px',
      }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#1e293b' }}>
            <p style={{ color: '#64748b' }}>Loading map data...</p>
          </div>
        ) : (
          <MapContainer
            center={[9.0820, 8.6753]}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {filtered.slice(0, 2000).map((row, i) => (
              <CircleMarker
                key={i}
                center={[parseFloat(row.latitude), parseFloat(row.longitude)]}
                radius={5}
                fillColor={crimeColors[row.crime_type] || '#f97316'}
                color="transparent"
                fillOpacity={0.75}
              >
                <Popup>
                  <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    <strong>{row.crime_type}</strong><br />
                    📍 {row.state}<br />
                    📅 {row.date}<br />
                    💀 Fatalities: {row.fatalities}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '16px 24px',
        border: '1px solid #334155',
        marginTop: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {Object.entries(crimeColors).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CrimeMap;