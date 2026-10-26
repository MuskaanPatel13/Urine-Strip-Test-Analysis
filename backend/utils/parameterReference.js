/**
 * Standard Reference Ranges & Thresholds for 10-Parameter Urine Test Strips
 * Based on Point-of-Care Colorimetric Urinalysis (KJS-HC-03)
 */

const PARAMETER_DEFINITIONS = {
  glucose: {
    key: 'glucose',
    name: 'Glucose (GLU)',
    unit: 'mg/dL',
    normalRange: 'Negative (< 15 mg/dL)',
    options: ['Negative', 'Trace (100 mg/dL)', '1+ (250 mg/dL)', '2+ (500 mg/dL)', '3+ (1000 mg/dL)', '4+ (>=2000 mg/dL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative' || val === 'Trace (100 mg/dL)' || val === '< 15 mg/dL',
    description: 'Elevated glucose may indicate diabetes mellitus, endocrine disorders, or renal glucosuria.'
  },
  protein: {
    key: 'protein',
    name: 'Protein (PRO)',
    unit: 'mg/dL',
    normalRange: 'Negative (< 15 mg/dL)',
    options: ['Negative', 'Trace (15 mg/dL)', '1+ (30 mg/dL)', '2+ (100 mg/dL)', '3+ (300 mg/dL)', '4+ (>=2000 mg/dL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative' || val === '< 15 mg/dL',
    description: 'Proteinuria can indicate glomerular damage, tubular dysfunction, or early chronic kidney disease (CKD).'
  },
  ph: {
    key: 'ph',
    name: 'pH',
    unit: 'pH Units',
    normalRange: '5.0 - 7.5',
    options: ['5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5'],
    defaultValue: '6.0',
    isNormal: (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 5.0 && num <= 7.5;
    },
    description: 'Acidic or alkaline shifts indicate metabolic imbalances, renal tubular acidosis, or urea-splitting bacteria.'
  },
  ketones: {
    key: 'ketones',
    name: 'Ketones (KET)',
    unit: 'mg/dL',
    normalRange: 'Negative',
    options: ['Negative', 'Trace (5 mg/dL)', 'Small (15 mg/dL)', 'Moderate (40 mg/dL)', 'Large (80 mg/dL)', 'Large (160 mg/dL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative',
    description: 'Ketonuria indicates diabetic ketoacidosis, prolonged fasting, starvation, or acute carbohydrate deficit.'
  },
  blood: {
    key: 'blood',
    name: 'Blood / Hemoglobin (BLO)',
    unit: 'Ery/µL',
    normalRange: 'Negative',
    options: ['Negative', 'Trace (10 Ery/µL)', 'Small (25 Ery/µL)', 'Moderate (80 Ery/µL)', 'Large (200 Ery/µL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative',
    description: 'Hematuria suggests urinary calculi (kidney stones), trauma, infection, glomerulonephritis, or malignancy.'
  },
  bilirubin: {
    key: 'bilirubin',
    name: 'Bilirubin (BIL)',
    unit: 'mg/dL',
    normalRange: 'Negative',
    options: ['Negative', '1+ (Small - 1.0 mg/dL)', '2+ (Moderate - 2.0 mg/dL)', '3+ (Large - 4.0 mg/dL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative',
    description: 'Conjugated bilirubin in urine indicates hepatic parenchymal disease or biliary tract obstruction (jaundice).'
  },
  urobilinogen: {
    key: 'urobilinogen',
    name: 'Urobilinogen (URO)',
    unit: 'mg/dL (EU/dL)',
    normalRange: '0.2 - 1.0 mg/dL',
    options: ['0.2 mg/dL (Normal)', '1.0 mg/dL (Normal)', '2.0 mg/dL (Elevated)', '4.0 mg/dL (Elevated)', '8.0 mg/dL (Marked)'],
    defaultValue: '0.2 mg/dL (Normal)',
    isNormal: (val) => val.includes('Normal') || val.includes('0.2') || val.includes('1.0'),
    description: 'Elevated urobilinogen indicates hemolytic disorders, hepatitis, or early liver cirrhosis.'
  },
  nitrite: {
    key: 'nitrite',
    name: 'Nitrite (NIT)',
    unit: 'Qualitative',
    normalRange: 'Negative',
    options: ['Negative', 'Positive'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative',
    description: 'Positive nitrite is a strong hallmark of Gram-negative bacterial urinary tract infection (UTI).'
  },
  leucocytes: {
    key: 'leucocytes',
    name: 'Leucocytes / White Blood Cells (LEU)',
    unit: 'Leu/µL',
    normalRange: 'Negative',
    options: ['Negative', 'Trace (15 Leu/µL)', '1+ (70 Leu/µL)', '2+ (125 Leu/µL)', '3+ (500 Leu/µL)'],
    defaultValue: 'Negative',
    isNormal: (val) => val === 'Negative',
    description: 'Pyuria indicates inflammatory response in the urinary tract, acute cystitis, or pyelonephritis.'
  },
  specificGravity: {
    key: 'specificGravity',
    name: 'Specific Gravity (SG)',
    unit: 'Density Index',
    normalRange: '1.005 - 1.030',
    options: ['1.000', '1.005', '1.010', '1.015', '1.020', '1.025', '1.030', '1.035'],
    defaultValue: '1.020',
    isNormal: (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 1.005 && num <= 1.030;
    },
    description: 'Measures renal concentrating ability and hydration status (low = dilute/diabetes insipidus, high = dehydration).'
  }
};

/**
 * Educational Simulation Presets
 * Allows staff / student to demonstrate clinical scenarios reliably during project evaluation
 */
const SIMULATION_PRESETS = {
  NORMAL: {
    id: 'NORMAL',
    name: 'Standard Normal (Control Sample)',
    description: 'Healthy adult profile with all parameters within physiological reference intervals.',
    data: {
      glucose: 'Negative',
      protein: 'Negative',
      ph: '6.0',
      ketones: 'Negative',
      blood: 'Negative',
      bilirubin: 'Negative',
      urobilinogen: '0.2 mg/dL (Normal)',
      nitrite: 'Negative',
      leucocytes: 'Negative',
      specificGravity: '1.020'
    }
  },
  UTI: {
    id: 'UTI',
    name: 'Urinary Tract Infection (UTI)',
    description: 'Gram-negative bacterial proliferation presenting positive nitrite and elevated leucocytes (pyuria).',
    data: {
      glucose: 'Negative',
      protein: 'Trace (15 mg/dL)',
      ph: '7.5',
      ketones: 'Negative',
      blood: 'Small (25 Ery/µL)',
      bilirubin: 'Negative',
      urobilinogen: '0.2 mg/dL (Normal)',
      nitrite: 'Positive',
      leucocytes: '3+ (500 Leu/µL)',
      specificGravity: '1.015'
    }
  },
  DIABETES: {
    id: 'DIABETES',
    name: 'Diabetic Glucosuria & Ketonuria',
    description: 'Uncontrolled blood sugar exceeding renal threshold resulting in severe glucosuria and metabolic ketosis.',
    data: {
      glucose: '3+ (1000 mg/dL)',
      protein: 'Trace (15 mg/dL)',
      ph: '5.5',
      ketones: 'Moderate (40 mg/dL)',
      blood: 'Negative',
      bilirubin: 'Negative',
      urobilinogen: '0.2 mg/dL (Normal)',
      nitrite: 'Negative',
      leucocytes: 'Negative',
      specificGravity: '1.030'
    }
  },
  RENAL: {
    id: 'RENAL',
    name: 'Kidney / Renal Dysfunction (Glomerulopathy)',
    description: 'Impaired glomerular filtration membrane showing significant proteinuria accompanied by microscopic hematuria.',
    data: {
      glucose: 'Negative',
      protein: '3+ (300 mg/dL)',
      ph: '6.5',
      ketones: 'Negative',
      blood: 'Moderate (80 Ery/µL)',
      bilirubin: 'Negative',
      urobilinogen: '1.0 mg/dL (Normal)',
      nitrite: 'Negative',
      leucocytes: 'Trace (15 Leu/µL)',
      specificGravity: '1.010'
    }
  },
  HEPATIC: {
    id: 'HEPATIC',
    name: 'Hepatic / Biliary Obstruction',
    description: 'Obstructive jaundice with conjugated bilirubin excretion and markedly elevated urobilinogen.',
    data: {
      glucose: 'Negative',
      protein: 'Negative',
      ph: '6.0',
      ketones: 'Negative',
      blood: 'Negative',
      bilirubin: '3+ (Large - 4.0 mg/dL)',
      urobilinogen: '8.0 mg/dL (Marked)',
      nitrite: 'Negative',
      leucocytes: 'Negative',
      specificGravity: '1.020'
    }
  }
};

/**
 * Evaluates the 10 parameters, calculating normal/flagged status for each
 */
function evaluateParameters(inputParams = {}) {
  const evaluated = {};
  let flagCount = 0;

  for (const key of Object.keys(PARAMETER_DEFINITIONS)) {
    const def = PARAMETER_DEFINITIONS[key];
    const rawVal = inputParams[key] || def.defaultValue;
    const isNormal = def.isNormal(rawVal);
    const status = isNormal ? 'Normal' : 'Flagged';

    if (!isNormal) {
      flagCount++;
    }

    evaluated[key] = {
      key,
      name: def.name,
      value: rawVal,
      unit: def.unit,
      normalRange: def.normalRange,
      status,
      description: def.description
    };
  }

  return {
    parameters: evaluated,
    overallStatus: flagCount > 0 ? 'Flagged' : 'Normal',
    flagCount
  };
}

module.exports = {
  PARAMETER_DEFINITIONS,
  SIMULATION_PRESETS,
  evaluateParameters
};
