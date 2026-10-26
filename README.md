# Urine Test Strip Reader using Colorimetry as a Point-of-Care Technology (KJS-HC-03)

A clean, direct, full-stack **MERN (MongoDB, Express.js, React.js with Vite, Node.js)** college mini-project developed for healthcare point-of-care diagnostics. This system addresses the human visual reading errors and timing inaccuracies associated with manually comparing 10-parameter urine test strip colors against printed bottle charts.

---

## 1. Project Overview & Clinical Context

In standard bedside and outpatient urinalysis, medical staff visually compare the color of 10 chemical pads against a printed color chart. This manual approach introduces clinical errors due to ambient lighting variations, inaccurate reaction incubation timing, and subjective observer fatigue.

### The Digital Solution (KJS-HC-03)
This application establishes a point-of-care digital workstation that:
1. Manages patient registrations and historical clinical profiles.
2. Evaluates all **10 biochemical parameters** against physiological reference intervals.
3. Provides **instant clinical flagging** for abnormal analytes.
4. Generates a **formal, printable digital diagnostic laboratory report** (A4 / PDF print-ready).
5. Provides **direct, seamless access** without unnecessary login screens or complicated multi-step wizards.

---

## 2. Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Clean, custom Vanilla CSS healthcare design system
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (abnormality distribution bar chart)
- **Backend**: Node.js runtime with Express.js REST API
- **Database**: MongoDB with Mongoose ODM

---

## 3. Project Structure

```
nikhil presentation/
├── backend/
│   ├── config/db.js          # Mongoose connection
│   ├── controllers/
│   │   ├── patientController.js  # Patient CRUD
│   │   └── testController.js     # 10-parameter test retrieval & dashboard stats
│   ├── middleware/auth.js    # Seamless staff access middleware
│   ├── models/
│   │   ├── Patient.js        # Patient demographic and medical record
│   │   └── UrineTest.js      # Urinalysis test with 10 parameters & image meta
│   ├── routes/
│   │   ├── patientRoutes.js  # /api/patients routes
│   │   ├── testRoutes.js     # /api/tests routes
│   │   └── seedRoutes.js     # /api/seed demo reset route
│   ├── utils/
│   │   ├── parameterReference.js # 10 parameter reference ranges
│   │   └── seedData.js       # Pre-seeded realistic clinical cases
│   ├── uploads/              # Optical strip image files
│   ├── .env                  # Environment configuration
│   ├── package.json          # Backend dependencies
│   └── server.js             # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Clean header showing hospital & lab name
│   │   │   ├── Sidebar.jsx          # Simple navigation (Dashboard, Patients, History, Settings)
│   │   │   ├── StatusBadge.jsx      # Normal / Flagged indicator badge
│   │   │   └── StripVisualizer.jsx  # 10-pad dipstick color visualizer
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Overview metrics, chart, recent reports
│   │   │   ├── PatientsPage.jsx     # Patient directory, search, registration modal
│   │   │   ├── PatientDetailPage.jsx# Patient demographics & past tests timeline
│   │   │   ├── TestResultPage.jsx   # 10-parameter breakdown with reference ranges
│   │   │   ├── TestHistoryPage.jsx  # Filterable archive of all past tests
│   │   │   ├── DigitalReportPage.jsx# Printable clinical laboratory report (PDF/A4)
│   │   │   └── SettingsPage.jsx     # KJS-HC-03 specs & 1-click demo data reset
│   │   ├── services/api.js          # Fetch API client
│   │   ├── App.jsx                  # Direct route mapping
│   │   └── index.css                # Clean healthcare styling
│   ├── index.html                   # HTML entrypoint
│   └── package.json                 # Frontend dependencies
└── README.md                        # Documentation
```

---

## 4. The 10 Urine Strip Parameters

| # | Analyte Parameter | Code | Reference Range | Unit | Diagnostic Significance |
|---|-------------------|------|-----------------|------|-------------------------|
| 1 | **Glucose** | GLU | Negative (< 15 mg/dL) | mg/dL | Diabetes mellitus, endocrine disorders |
| 2 | **Protein** | PRO | Negative (< 15 mg/dL) | mg/dL | Glomerular damage, chronic kidney disease |
| 3 | **pH** | pH | 5.0 – 7.5 | pH Units | Systemic acid-base status, bacterial shifts |
| 4 | **Ketones** | KET | Negative (< 5 mg/dL) | mg/dL | Diabetic ketoacidosis, acute starvation |
| 5 | **Blood** | BLO | Negative | Ery/µL | Renal calculi, trauma, glomerulonephritis |
| 6 | **Bilirubin** | BIL | Negative | mg/dL | Hepatobiliary obstruction, jaundice |
| 7 | **Urobilinogen** | URO | 0.2 – 1.0 mg/dL | mg/dL | Hemolytic anemia, early liver dysfunction |
| 8 | **Nitrite** | NIT | Negative | Qual | Gram-negative bacterial UTI |
| 9 | **Leucocytes** | LEU | Negative | Leu/µL | Pyuria, urinary tract inflammation |
| 10 | **Specific Gravity** | SG | 1.005 – 1.030 | Index | Renal concentration capacity, hydration |

---

## 5. How to Run the Application

### 1. Backend Server
```bash
cd backend
npm install
node server.js
```
*Runs on `http://localhost:5000` and automatically connects to local MongoDB.*

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`.*

---

## 6. Pre-Seeded Sample Clinical Cases

When opened, the dashboard automatically contains 5 realistic clinical cases ready to demonstrate:

1. **Aarav Sharma (PAT-1001)**: Normal control baseline — all 10 parameters within normal limits.
2. **Priya Patel (PAT-1002)**: Urinary Tract Infection (UTI) — Positive Nitrite + 3+ Leucocytes.
3. **Ramesh Gupta (PAT-1003)**: Diabetes — 3+ Glucosuria + Ketonuria.
4. **Sunita Verma (PAT-1004)**: Renal issue — 3+ Proteinuria + Hematuria.
5. **Kavita Nair (PAT-1005)**: Jaundice / Liver issue — 3+ Bilirubinuria + Elevated Urobilinogen.

*(Use the **"Refresh Demo Data"** button in Settings & Info to reset records at any time).*
