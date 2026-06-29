import React from 'react';
import { Database, Brain, Map, BarChart2, Shield, Users } from 'lucide-react';

const cardStyle = {
  backgroundColor: '#1e293b',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid #334155',
};

const techniques = [
  {
    icon: Brain,
    color: '#f97316',
    title: 'Classification',
    description: 'Decision tree and rule-based algorithms classify crime incidents into categories based on location, time, and environmental factors.',
  },
  {
    icon: Database,
    color: '#3b82f6',
    title: 'Clustering',
    description: 'K-Means clustering groups crime hotspots geographically, identifying high-density zones across Nigerian states for targeted intervention.',
  },
  {
    icon: BarChart2,
    color: '#10b981',
    title: 'Time-Series Analysis',
    description: 'Temporal pattern mining reveals seasonal crime trends, peak periods (festive seasons), and year-on-year progression of incidents.',
  },
  {
    icon: Map,
    color: '#a855f7',
    title: 'Spatial Analysis',
    description: 'Geographic data mining maps crime distribution across Nigeria\'s 36 states, identifying regional patterns and border-zone vulnerabilities.',
  },
];

const team = [
  { name: 'Israel Pelumi', role: 'Lead Developer & Researcher' },
  { name: 'Eniola Ruth', role: 'Co-Researcher' },
  { name: 'Benjamin Fiyinfoluwa', role: 'Co-Researcher' },
];

function About() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
          About This Project
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Crime Pattern Analysis and Prediction Using Data Mining Techniques
        </p>
      </div>

      {/* Project Overview */}
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#f97316" />
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>Project Overview</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8' }}>
          CrimeWatch Nigeria is a final-year Computer Science project developed at Ladoke Akintola
          University of Technology (LAUTECH), Ogbomoso. The system applies data mining techniques
          to analyse and predict crime patterns across Nigeria using a dataset of 5,000 simulated
          incidents modelled after real Nigerian crime trends from 2020 to 2024.
        </p>
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.8', marginTop: '12px' }}>
          The dashboard provides law enforcement agencies, policymakers, and researchers with
          actionable insights into crime distribution, seasonal trends, and risk prediction
          across Nigerian states and geopolitical zones.
        </p>
      </div>

      {/* Data Mining Techniques */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
          Data Mining Techniques Applied
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {techniques.map(({ icon: Icon, color, title, description }) => (
            <div key={title} style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ backgroundColor: `${color}20`, borderRadius: '8px', padding: '8px' }}>
                  <Icon size={18} color={color} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f1f5f9' }}>{title}</h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.7' }}>{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Info */}
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
          Dataset Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Records', value: '5,000' },
            { label: 'Year Range', value: '2020–2024' },
            { label: 'States Covered', value: '20 States' },
            { label: 'Crime Categories', value: '10 Types' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#f97316' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
        <p style={{ color: '#475569', fontSize: '12px', marginTop: '16px', lineHeight: '1.6' }}>
          * Dataset is simulated based on Nigerian crime patterns and statistics from the Nigeria
          Police Force (NPF) and National Bureau of Statistics (NBS) reports. Used strictly for
          academic research purposes.
        </p>
      </div>

      {/* Tech Stack */}
      <div style={{ ...cardStyle, marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9', marginBottom: '16px' }}>
          Technology Stack
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {[
            { name: 'React.js', color: '#3b82f6' },
            { name: 'Python Flask', color: '#10b981' },
            { name: 'Pandas', color: '#f97316' },
            { name: 'Recharts', color: '#a855f7' },
            { name: 'Leaflet.js', color: '#06b6d4' },
            { name: 'Tailwind CSS', color: '#eab308' },
            { name: 'React Router', color: '#ef4444' },
            { name: 'Axios', color: '#f43f5e' },
          ].map(({ name, color }) => (
            <div key={name} style={{
              backgroundColor: `${color}15`,
              border: `1px solid ${color}40`,
              borderRadius: '20px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: '600',
              color: color,
            }}>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Users size={20} color="#f97316" />
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>Research Team</h2>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {team.map(({ name, role }) => (
            <div key={name} style={{
              backgroundColor: '#0f172a',
              borderRadius: '10px',
              padding: '16px 20px',
              flex: 1,
              textAlign: 'center',
            }}>
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                backgroundColor: '#f9731620',
                border: '2px solid #f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px auto',
                fontSize: '16px', fontWeight: '700', color: '#f97316',
              }}>
                {name.charAt(0)}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#f1f5f9' }}>{name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{role}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Department of Computer Science • LAUTECH, Ogbomoso • 2025/2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;