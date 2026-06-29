import React, { useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { fetchPrediction } from '../api';

const crimeTypes = [
  'Armed Robbery', 'Kidnapping', 'Cybercrime', 'Assault',
  'Terrorism', 'Cult Clash', 'Burglary', 'Fraud',
  'Drug Trafficking', 'Homicide',
];

const states = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Kano', 'Borno',
  'Kaduna', 'Delta', 'Oyo', 'Anambra', 'Imo',
  'Enugu', 'Plateau', 'Niger', 'Zamfara', 'Sokoto',
  'Ogun', 'Edo', 'Cross River', 'Bauchi', 'Kebbi',
];

const timeOfDay = ['Morning (6am–12pm)', 'Afternoon (12pm–6pm)', 'Evening (6pm–10pm)', 'Night (10pm–6am)'];
const months = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

// Risk scoring logic based on Nigerian crime patterns
function calculateRisk(inputs) {
  let score = 0;

  // State risk weight
  const stateRisk = {
    'Lagos': 90, 'Borno': 88, 'Kaduna': 82, 'Zamfara': 85,
    'Rivers': 78, 'Abuja (FCT)': 72, 'Kano': 70, 'Delta': 68,
    'Oyo': 60, 'Anambra': 58, 'Imo': 55, 'Plateau': 65,
    'Enugu': 50, 'Niger': 48, 'Sokoto': 75, 'Ogun': 45,
    'Edo': 52, 'Cross River': 40, 'Bauchi': 55, 'Kebbi': 42,
  };
  score += (stateRisk[inputs.state] || 50) * 0.35;

  // Crime type risk weight
  const crimeRisk = {
    'Terrorism': 95, 'Kidnapping': 90, 'Homicide': 88,
    'Armed Robbery': 82, 'Cult Clash': 78, 'Drug Trafficking': 70,
    'Assault': 65, 'Burglary': 55, 'Fraud': 50, 'Cybercrime': 45,
  };
  score += (crimeRisk[inputs.crimeType] || 50) * 0.30;

  // Time of day risk
  const timeRisk = {
    'Night (10pm–6am)': 90, 'Evening (6pm–10pm)': 70,
    'Afternoon (12pm–6pm)': 40, 'Morning (6am–12pm)': 30,
  };
  score += (timeRisk[inputs.timeOfDay] || 50) * 0.20;

  // Month risk (festive periods higher)
  const monthRisk = {
    'December': 90, 'January': 85, 'November': 70,
    'October': 65, 'April': 60, 'March': 55,
    'February': 50, 'May': 50, 'June': 48,
    'July': 45, 'August': 45, 'September': 48,
  };
  score += (monthRisk[inputs.month] || 50) * 0.15;

  return Math.min(Math.round(score), 99);
}

function getRiskLevel(score) {
  if (score >= 75) return { level: 'HIGH RISK', color: '#ef4444', bg: '#ef444415', icon: AlertTriangle };
  if (score >= 50) return { level: 'MODERATE RISK', color: '#eab308', bg: '#eab30815', icon: Info };
  return { level: 'LOW RISK', color: '#10b981', bg: '#10b98115', icon: CheckCircle };
}

function getRiskRecommendation(score, inputs) {
  if (score >= 75) {
    return [
      `Avoid ${inputs.state} during ${inputs.timeOfDay.toLowerCase()} hours if possible.`,
      `${inputs.crimeType} incidents are significantly elevated in this region.`,
      'Increase law enforcement patrol frequency in this area.',
      'Citizens should avoid isolated areas and travel in groups.',
      'Emergency response units should be placed on high alert.',
    ];
  } else if (score >= 50) {
    return [
      `Exercise caution in ${inputs.state} during ${inputs.timeOfDay.toLowerCase()}.`,
      `${inputs.crimeType} activity is moderate — stay aware of surroundings.`,
      'Avoid displaying valuables in public spaces.',
      'Keep emergency contacts readily available.',
    ];
  } else {
    return [
      `${inputs.state} shows relatively low risk for ${inputs.crimeType} at this time.`,
      'Standard safety precautions are sufficient.',
      'Maintain routine awareness of your environment.',
    ];
  }
}

const inputStyle = {
  width: '100%',
  backgroundColor: '#0f172a',
  color: '#e2e8f0',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  outline: 'none',
  cursor: 'pointer',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  color: '#94a3b8',
  marginBottom: '6px',
  fontWeight: '500',
};

function Prediction() {
  const [inputs, setInputs] = useState({
    state: 'Lagos',
    crimeType: 'Armed Robbery',
    timeOfDay: 'Night (10pm–6am)',
    month: 'December',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

const handlePredict = async () => {
  setLoading(true);
  try {
    const res = await fetchPrediction(inputs);
    const { score, level } = res.data;
    const risk = getRiskLevel(score);
    const recommendations = getRiskRecommendation(score, inputs);
    setResult({ score, level, ...risk, recommendations });
  } catch (err) {
    console.error('Prediction error:', err);
  }
  setLoading(false);
};

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#f1f5f9' }}>
          Crime Risk Prediction
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Predict crime risk level based on location, crime type, and time factors
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Input Form */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '28px',
          border: '1px solid #334155',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Brain size={20} color="#f97316" />
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>
              Prediction Parameters
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* State */}
            <div>
              <label style={labelStyle}>State / Location</label>
              <select style={inputStyle} value={inputs.state}
                onChange={e => handleChange('state', e.target.value)}>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Crime Type */}
            <div>
              <label style={labelStyle}>Crime Type</label>
              <select style={inputStyle} value={inputs.crimeType}
                onChange={e => handleChange('crimeType', e.target.value)}>
                {crimeTypes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Time of Day */}
            <div>
              <label style={labelStyle}>Time of Day</label>
              <select style={inputStyle} value={inputs.timeOfDay}
                onChange={e => handleChange('timeOfDay', e.target.value)}>
                {timeOfDay.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Month */}
            <div>
              <label style={labelStyle}>Month</label>
              <select style={inputStyle} value={inputs.month}
                onChange={e => handleChange('month', e.target.value)}>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Predict Button */}
            <button
              onClick={handlePredict}
              disabled={loading}
              style={{
                backgroundColor: loading ? '#334155' : '#f97316',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'Analysing...' : 'Run Prediction'}
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '28px',
          border: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: result ? 'flex-start' : 'center',
          alignItems: result ? 'flex-start' : 'center',
          minHeight: '400px',
        }}>
          {!result && !loading && (
            <div style={{ textAlign: 'center' }}>
              <Brain size={48} color="#334155" />
              <p style={{ color: '#475569', marginTop: '16px', fontSize: '14px' }}>
                Fill in the parameters and click<br />
                <strong style={{ color: '#64748b' }}>Run Prediction</strong> to see the risk analysis
              </p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Analysing crime patterns...</p>
            </div>
          )}

          {result && !loading && (
            <div style={{ width: '100%' }}>

              {/* Risk Score */}
              <div style={{
                backgroundColor: result.bg,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: `1px solid ${result.color}30`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '56px', fontWeight: '800', color: result.color }}>
                  {result.score}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  RISK SCORE OUT OF 100
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: result.bg,
                  border: `1px solid ${result.color}`,
                  borderRadius: '20px',
                  padding: '6px 16px',
                }}>
                  <result.icon size={14} color={result.color} />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: result.color }}>
                    {result.level}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600' }}>
                  ANALYSIS SUMMARY
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { label: 'State', value: inputs.state },
                    { label: 'Crime', value: inputs.crimeType },
                    { label: 'Time', value: inputs.timeOfDay.split(' ')[0] },
                    { label: 'Month', value: inputs.month },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      backgroundColor: '#0f172a',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                    }}>
                      <span style={{ color: '#475569' }}>{label}: </span>
                      <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600' }}>
                  RECOMMENDATIONS
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.recommendations.map((rec, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}>
                      <div style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%',
                        backgroundColor: result.color,
                        marginTop: '6px',
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;