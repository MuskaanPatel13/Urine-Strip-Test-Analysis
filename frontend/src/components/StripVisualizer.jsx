import React from 'react';

// Representative realistic pad colors based on commercial colorimetric urine strips
const PAD_COLOR_MAP = {
  leucocytes: {
    'Negative': '#fef3c7', // pale beige
    'Trace (15 Leu/µL)': '#fed7aa',
    '1+ (70 Leu/µL)': '#f472b6',
    '2+ (125 Leu/µL)': '#c084fc',
    '3+ (500 Leu/µL)': '#7e22ce' // deep purple
  },
  nitrite: {
    'Negative': '#fef9c3', // pale off-white
    'Positive': '#ec4899'  // bright pink
  },
  urobilinogen: {
    '0.2 mg/dL (Normal)': '#fef08a', // light yellow
    '1.0 mg/dL (Normal)': '#fed7aa',
    '2.0 mg/dL (Elevated)': '#fb923c',
    '4.0 mg/dL (Elevated)': '#ea580c',
    '8.0 mg/dL (Marked)': '#b91c1c' // red-orange
  },
  protein: {
    'Negative': '#fef08a', // pale yellowish green
    'Trace (15 mg/dL)': '#d9f99d',
    '1+ (30 mg/dL)': '#86efac',
    '2+ (100 mg/dL)': '#22c55e',
    '3+ (300 mg/dL)': '#0f766e',
    '4+ (>=2000 mg/dL)': '#134e4a' // deep green-teal
  },
  ph: {
    '5.0': '#f97316', // orange
    '5.5': '#eab308',
    '6.0': '#ca8a04',
    '6.5': '#84cc16',
    '7.0': '#22c55e',
    '7.5': '#06b6d4',
    '8.0': '#0284c7',
    '8.5': '#3b82f6' // deep blue
  },
  blood: {
    'Negative': '#fef08a', // yellow
    'Trace (10 Ery/µL)': '#a3e635',
    'Small (25 Ery/µL)': '#65a30d',
    'Moderate (80 Ery/µL)': '#15803d',
    'Large (200 Ery/µL)': '#064e3b' // deep speckled green/blue
  },
  specificGravity: {
    '1.000': '#1e3a8a', // deep blue
    '1.005': '#2563eb',
    '1.010': '#0284c7',
    '1.015': '#0d9488',
    '1.020': '#65a30d',
    '1.025': '#ca8a04',
    '1.030': '#ea580c',
    '1.035': '#9a3412' // brownish yellow
  },
  ketones: {
    'Negative': '#fef08a', // buff / yellow
    'Trace (5 mg/dL)': '#fed7aa',
    'Small (15 mg/dL)': '#f472b6',
    'Moderate (40 mg/dL)': '#db2777',
    'Large (80 mg/dL)': '#9d174d',
    'Large (160 mg/dL)': '#581c87' // dark violet
  },
  bilirubin: {
    'Negative': '#fef9c3', // pale cream
    '1+ (Small - 1.0 mg/dL)': '#fed7aa',
    '2+ (Moderate - 2.0 mg/dL)': '#fb923c',
    '3+ (Large - 4.0 mg/dL)': '#b45309' // tan/brown
  },
  glucose: {
    'Negative': '#0ea5e9', // bright light cyan
    'Trace (100 mg/dL)': '#10b981', // light green
    '1+ (250 mg/dL)': '#84cc16', // olive
    '2+ (500 mg/dL)': '#ca8a04', // tan
    '3+ (1000 mg/dL)': '#ea580c', // brown
    '4+ (>=2000 mg/dL)': '#78350f' // dark brown
  }
};

const ORDERED_KEYS = [
  { key: 'leucocytes', label: 'LEU' },
  { key: 'nitrite', label: 'NIT' },
  { key: 'urobilinogen', label: 'URO' },
  { key: 'protein', label: 'PRO' },
  { key: 'ph', label: 'pH' },
  { key: 'blood', label: 'BLO' },
  { key: 'specificGravity', label: 'SG' },
  { key: 'ketones', label: 'KET' },
  { key: 'bilirubin', label: 'BIL' },
  { key: 'glucose', label: 'GLU' }
];

export const StripVisualizer = ({ values = {}, highlightedKey = null }) => {
  return (
    <div className="strip-visualizer-container">
      <div className="strip-title-row">
        <span className="strip-visualizer-label">Simulated 10-Pad Reagent Dipstick</span>
        <span className="strip-specs-sub">KJS-HC-03 Colorimetry Calibration</span>
      </div>

      <div className="virtual-strip-wrapper">
        <div className="virtual-strip-handle">HANDLE (Grip Area)</div>
        <div className="virtual-strip-body">
          {ORDERED_KEYS.map((item, index) => {
            const rawVal = values[item.key] || 'Negative';
            const color = (PAD_COLOR_MAP[item.key] && PAD_COLOR_MAP[item.key][rawVal]) || '#e2e8f0';
            const isHighlighted = highlightedKey === item.key;

            return (
              <div
                key={item.key}
                className={`virtual-pad-unit ${isHighlighted ? 'pad-highlighted' : ''}`}
                title={`${item.label}: ${rawVal}`}
              >
                <div
                  className="pad-square"
                  style={{ backgroundColor: color }}
                >
                  <span className="pad-index">{index + 1}</span>
                </div>
                <div className="pad-label-text">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="strip-legend-hint">
        * Color representation mirrors biochemical reactions after 120s exposure to urine.
      </div>
    </div>
  );
};
