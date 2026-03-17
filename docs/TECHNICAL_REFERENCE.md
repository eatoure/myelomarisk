# MyelomaRisk - Technical Reference Document

## Complete Repository Analysis & Implementation Guide

This document provides detailed technical specifications extracted from the Flutter codebase for rebuilding the MyelomaRisk application on a new platform.

---

## Table of Contents
1. [Application Architecture](#application-architecture)
2. [Detailed Calculation Algorithms](#detailed-calculation-algorithms)
3. [Data Models](#data-models)
4. [UI Component Specifications](#ui-component-specifications)
5. [External Dependencies & Links](#external-dependencies--links)
6. [Assets & Media](#assets--media)

---

## Application Architecture

### Navigation Flow
```
Splash Screen (5 seconds)
    ↓
Disclaimer Modal (mandatory accept)
    ↓
Home Page (calculator grid)
    ↓
Individual Calculator Pages
    ↓
Results Display (modal)
```

### Page Structure
```
App Root
├── Splash Screen (_SplashScreen)
├── Home Page (_HomePage)
├── Calculator Pages
│   ├── Smoldering MM (_Smoldering)
│   ├── Multiple Myeloma (_Multiple)
│   ├── MGUS (_MGUSEx)
│   ├── Amyloidosis (_AmyloidosisEx)
│   ├── Frailty (FrailtyCalculatorPage)
│   └── Waldenstrom (WMCalculatorPage)
├── External Link Handlers
│   ├── MGUS Bone Marrow (UrlLauncherScreen)
│   └── MGUS Light Chain (UrlLauncherScreenLC)
└── Developers Page (_AuthorsPage)
```

---

## Detailed Calculation Algorithms

### 1. Smoldering Multiple Myeloma (SMM)

#### Input Validation
```javascript
// All fields required
// M-Protein: decimal number in g/dl
// Free Serum Kappa: decimal number
// Free Serum Lambda: decimal number
// Bone Marrow Plasma %: decimal number
// Cytogenetic abnormalities: boolean selection (Yes/No/Unsure)
```

#### Calculation Functions

**Free Light Chain (FLC) Score:**
```javascript
function calculateFLCScore(freeSerumKappa, freeSerumLambda) {
  let ratio;
  
  if (freeSerumKappa > freeSerumLambda) {
    ratio = freeSerumKappa / freeSerumLambda;
  } else {
    ratio = freeSerumLambda / freeSerumKappa;
  }
  
  if (ratio <= 10) return 0;
  if (ratio > 10 && ratio <= 25) return 2;
  if (ratio > 25 && ratio <= 40) return 3;
  if (ratio > 40) return 5;
  
  return 0;
}
```

**M-Protein Score:**
```javascript
function calculateMProteinScore(mProtein) {
  if (mProtein <= 1.5) return 0;
  if (mProtein > 1.5 && mProtein <= 3) return 3;
  if (mProtein > 3) return 4;
  
  return 0;
}
```

**Bone Marrow Infiltration (BMI) Score:**
```javascript
function calculateBMIScore(boneMarrowPercentage) {
  if (boneMarrowPercentage <= 15) return 0;
  if (boneMarrowPercentage > 15 && boneMarrowPercentage <= 20) return 2;
  if (boneMarrowPercentage > 20 && boneMarrowPercentage <= 30) return 3;
  if (boneMarrowPercentage > 30 && boneMarrowPercentage <= 40) return 5;
  if (boneMarrowPercentage > 40) return 6;
  
  return 0;
}
```

**Risk Percentage Mapping:**
```javascript
function calculatePercentageRisk(totalScore) {
  const scoreToRiskMap = {
    0: 1.3,
    2: 5.4,
    3: 2.6,
    4: 10.3,
    5: 19.2,
    6: 23.4,
    7: 27.6,
    8: 35.0,
    9: 48.6,
    10: 41.9,
    11: 50.0,
    12: 61.9,
    13: 50.0,
    14: 78.6,
    15: 83.3
  };
  
  if (totalScore > 15) return 88.9;
  
  return scoreToRiskMap[totalScore] || 0;
}
```

**Complete SMM Calculation:**
```javascript
function calculateSMMRisk(inputs) {
  const { mProtein, freeSerumKappa, freeSerumLambda, 
          marrowPlasmaPercentage, hasCytogeneticAbnormalities } = inputs;
  
  let totalScore = 0;
  
  // Calculate component scores
  totalScore += calculateFLCScore(freeSerumKappa, freeSerumLambda);
  totalScore += calculateMProteinScore(mProtein);
  totalScore += calculateBMIScore(marrowPlasmaPercentage);
  
  // Add cytogenetic abnormalities bonus
  if (hasCytogeneticAbnormalities === true) {
    totalScore += 2;
  }
  
  const riskPercentage = calculatePercentageRisk(totalScore);
  
  return {
    totalScore,
    riskPercentage,
    message: `The 2-year progression risk from the time of initial diagnosis is ${riskPercentage.toFixed(1)}%. This information is for patients who are not receiving any treatment for Smoldering Multiple Myeloma.`
  };
}
```

---

### 2. Multiple Myeloma (Newly Diagnosed)

#### Input Structure
```javascript
const multipleMyelomaInputs = {
  hasHighRiskIghTranslocation: boolean,  // t(4;14), t(14;16), t(14;20)
  has1qGainAmplification: boolean,
  hasChromosome17Abnormality: boolean,
  hasElevatedLDH: boolean,
  b2Microglobulin: number  // in mg/L
};
```

#### Calculation
```javascript
function calculateMultipleMyelomaRisk(inputs) {
  let score = 0;
  
  if (inputs.hasHighRiskIghTranslocation) score++;
  if (inputs.has1qGainAmplification) score++;
  if (inputs.hasChromosome17Abnormality) score++;
  if (inputs.b2Microglobulin > 5.5) score++;
  if (inputs.hasElevatedLDH) score++;
  
  let pfs, os;
  
  switch(score) {
    case 0:
      pfs = "63.1 months";
      os = "11 years";
      break;
    case 1:
      pfs = "44 months";
      os = "7 years";
      break;
    default:  // 2 or more
      pfs = "28.6 months";
      os = "4.5 years";
  }
  
  return {
    score,
    progressionFreeSurvival: pfs,
    overallSurvival: os,
    message: `Median Progression-Free Survival with Frontline Therapy is Expected to Exceed: ${pfs}. Median Overall Survival from the Time of Diagnosis is Expected to Exceed: ${os}. Estimates are for newly diagnosed patients based on variables at initial diagnosis. "Median" means that 50% of patients have outcomes similar or better than the estimate provided. This information is based on data available until 2022, and with recent advances will be better than the estimates provided.`
  };
}
```

---

### 3. MGUS Prognosis

#### Input Structure
```javascript
const mgusInputs = {
  serumMProtein: number,      // in g/dl
  freeSerumLambda: number,
  freeSerumKappa: number,
  isIgG: boolean              // IgG subtype
};
```

#### Calculation
```javascript
function calculateMGUSRisk(inputs) {
  let score = 0;
  
  // M-protein check (note: >15 g/dl, not 1.5)
  if (inputs.serumMProtein > 15) score++;
  
  // Non-IgG subtype
  if (!inputs.isIgG) score++;
  
  // Calculate FLC ratio
  const ratio = inputs.freeSerumLambda > inputs.freeSerumKappa
    ? inputs.freeSerumLambda / inputs.freeSerumKappa
    : inputs.freeSerumKappa / inputs.freeSerumLambda;
  
  // Abnormal ratio
  if (ratio < 0.26 || ratio > 1.65) score++;
  
  const riskMap = {
    0: "2%",
    1: "10%",
    2: "18%",
    3: "27%"
  };
  
  const absoluteRisk = riskMap[score];
  
  return {
    score,
    absoluteRisk,
    message: `Absolute Risk of Progression: ${absoluteRisk}. Absolute risk is the likelihood of developing progression to myeloma or related disorder over a 20 year period from diagnosis after adjusting for competing causes of death.`
  };
}
```

---

### 4. Amyloidosis Staging

#### Input Structure
```javascript
const amyloidosisInputs = {
  cTnT: number,               // Cardiac Troponin T in µg/L
  NTproBNP: number,           // NT-proBNP in ng/L
  freeSerumLambda: number,    // in mg/L
  freeSerumKappa: number      // in mg/L
};
```

#### Calculation
```javascript
function calculateAmyloidosisStage(inputs) {
  let score = 0;
  
  // Cardiac Troponin T threshold
  if (inputs.cTnT >= 0.025) score++;
  
  // NT-proBNP threshold
  if (inputs.NTproBNP >= 1800) score++;
  
  // Difference in free light chains
  const difference = Math.abs(inputs.freeSerumLambda - inputs.freeSerumKappa);
  if (difference >= 180) score++;
  
  const stageMap = {
    0: "1",
    1: "2",
    2: "3",
    3: "4"
  };
  
  const stage = stageMap[score];
  
  return {
    score,
    stage,
    message: `The risk factors provided are correspondent with Stage ${stage} of AL amyloidosis. This data conforms to the Mayo 2012 Model for biomarker models used in systemic amyloidosis.`
  };
}
```

---

### 5. Frailty Classification

#### Input Structure
```javascript
const frailtyInputs = {
  ageGroup: number,  // 0: ≤75, 1: 76-80, 2: >80
  cci: number,       // Charlson Comorbidity Index: 0: ≤1, 1: >1
  ecog: number       // ECOG Performance Status: 0: 0, 1: 1, 2: ≥2
};
```

#### Calculation
```javascript
function calculateFrailty(inputs) {
  const totalScore = inputs.ageGroup + inputs.cci + inputs.ecog;
  
  const diagnosis = totalScore <= 1 ? "Non-frail" : "Frail";
  
  return {
    totalScore,
    diagnosis,
    message: `Based on the provided information, the diagnosis is: ${diagnosis}.`
  };
}
```

---

### 6. Waldenstrom Macroglobulinemia

#### Input Structure
```javascript
const waldenstromInputs = {
  age: number,              // in years
  serumAlbumin: number,     // in g/dL
  elevatedLDH: boolean      // above normal upper limit
};
```

#### Calculation
```javascript
function calculateWaldenstromRisk(inputs) {
  let score = 0;
  
  // Age scoring
  if (inputs.age > 75) {
    score += 2;
  } else if (inputs.age >= 66 && inputs.age <= 75) {
    score += 1;
  }
  // age ≤65: 0 points (implicit)
  
  // Serum albumin
  if (inputs.serumAlbumin < 3.5) score++;
  
  // Elevated LDH
  if (inputs.elevatedLDH) score += 2;
  
  let riskClassification, survivalRate;
  
  if (score === 0) {
    riskClassification = 'Low-risk';
    survivalRate = '93%';
  } else if (score === 1) {
    riskClassification = 'Low-intermediate risk';
    survivalRate = '82%';
  } else if (score === 2) {
    riskClassification = 'Intermediate-risk';
    survivalRate = '69%';
  } else {  // score >= 3
    riskClassification = 'High-risk';
    survivalRate = '55%';
  }
  
  return {
    score,
    riskClassification,
    survivalRate,
    message: `Based on the provided information, the risk classification is: ${riskClassification}. 5-year overall survival (OS) rate: ${survivalRate}.`
  };
}
```

---

## Data Models

### Author/Developer Model
```javascript
const authorSchema = {
  name: string,
  title: string,
  bio: string,
  image: string,      // asset path or URL
  skills: string,     // comma-separated list
  email: string,
  twitter: string     // full URL to Twitter profile
};

const authors = [
  {
    name: "Vincent Rajkumar, M.D.",
    title: "Hematologist at the Mayo Clinic",
    bio: "Dr. S. Vincent Rajkumar is a distinguished researcher focusing on myeloma and related disorders. He has led multiple crucial clinical trials, including those resulting in the U.S. approval of thalidomide for myeloma treatment. His work greatly contributes to improving patient outcomes.",
    image: "VincentRajkumar.jpg",
    skills: "Clinical, Epidemiological, and Laboratory Research, Hematology",
    email: "vincerk@gmail.com",
    twitter: "https://twitter.com/vincentrk"
  },
  {
    name: "Shaji Kumar, M.D.",
    title: "Hematologist and Internist at the Mayo Clinic",
    bio: "Dr. Shaji Kumar is a distinguished researcher and physician focusing in research on developing new myeloma treatments, investigating promising drugs and their combinations. He also studies myeloma biology and patient outcomes in myeloma and amyloidosis.",
    image: "ShajiKumar.jpg",
    skills: "Drug Development, Clinical Trials, In Vitro Research, Monoclonal Gammopathie, etc.",
    email: "kumarshaji@hotmail.com",
    twitter: "https://twitter.com/myelomamd"
  },
  {
    name: "Elhadji Amadou Touré",
    title: "SREP Intern at the Mayo Clinic, Department of Otolaryngology -- Head and Neck Surgery",
    bio: "Amadou, a junior at Carleton College, blends computer science and biochemistry in his pre-med journey. He interned at Mayo Clinic, delving into otolaryngology and medical oncology. His CS background contributed to the development of this tool.",
    image: "AmadouToure.JPG",
    skills: "Software Development, Laboratory, Healthcare Disparities, and Audiovisual Integration Research",
    email: "tourea@carleton.edu",
    twitter: "https://twitter.com/eamadoutoure"
  }
];
```

### Calculator Card Model
```javascript
const calculatorSchema = {
  id: string,
  title: string,
  route: string,          // internal route or external URL
  isExternal: boolean
};

const calculators = [
  { id: "smm", title: "Smoldering Multiple Myeloma", route: "/smoldering", isExternal: false },
  { id: "mm", title: "Multiple Myeloma", route: "/multiple-myeloma", isExternal: false },
  { id: "mgus", title: "MGUS Prognosis", route: "/mgus", isExternal: false },
  { id: "mgus-bm", title: "MGUS: Bone Marrow Check", route: "https://istopmm.com/riskmodel/", isExternal: true },
  { id: "mgus-lc", title: "MGUS: Diagnosis Criteria for Light Chain", route: "https://istopmm.com/lcmgus/", isExternal: true },
  { id: "amyloidosis", title: "Amyloidosis", route: "/amyloidosis", isExternal: false },
  { id: "frailty", title: "Frailty", route: "/frailty", isExternal: false },
  { id: "waldenstrom", title: "Waldenstrom Macroglobulinemia", route: "/waldenstrom", isExternal: false },
  { id: "developers", title: "Developers", route: "/developers", isExternal: false }
];
```

---

## UI Component Specifications

### Color Palette
```css
:root {
  /* Primary Blues */
  --primary-dark: #0D47A1;
  --primary-medium: #1976D2;
  --primary-light: #42A5F5;
  
  /* Backgrounds */
  --bg-light: #F5F5F5;
  --bg-white: #FFFFFF;
  
  /* Text */
  --text-primary: #131255;
  --text-secondary: #333333;
  --text-light: #666666;
  
  /* Semantic */
  --error: #D32F2F;
  --success: #388E3C;
  --warning: #F57C00;
  
  /* Overlay */
  --overlay-dark: rgba(0, 0, 0, 0.7);
  --overlay-medium: rgba(0, 0, 0, 0.5);
}
```

### Gradient Button Component
```css
.gradient-button {
  background: linear-gradient(
    to bottom,
    var(--primary-dark),
    var(--primary-medium),
    var(--primary-light)
  );
  border: none;
  border-radius: 15px;
  padding: 12px 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.gradient-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}
```

### Input Field Styling
```css
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #CCCCCC;
  border-radius: 15px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-medium);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: var(--text-primary);
}

.form-hint {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-light);
}
```

### Card Component
```css
.calculator-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.calculator-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}
```

### Responsive Grid Layout
```css
.calculator-grid {
  display: grid;
  gap: 24px;
  padding: 24px;
}

/* Mobile */
@media (max-width: 599px) {
  .calculator-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (min-width: 600px) and (max-width: 1049px) {
  .calculator-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1050px) {
  .calculator-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## External Dependencies & Links

### External URLs
```javascript
const externalLinks = {
  msmart: "https://msmart.org",
  mgusBoneMarrow: "https://istopmm.com/riskmodel/",
  mgusLightChain: "https://istopmm.com/lcmgus/",
  twitter: {
    rajkumar: "https://twitter.com/vincentrk",
    kumar: "https://twitter.com/myelomamd",
    toure: "https://twitter.com/eamadoutoure"
  }
};
```

### References (with DOI links)
```javascript
const references = {
  smoldering: {
    citation: "Mateos MV, Kumar S, Dimopoulos MA, et al. International Myeloma Working Group risk stratification model for smoldering multiple myeloma (SMM). Blood Cancer J. 2020 Oct 16;10(10):102.",
    url: "https://doi.org/10.1038/s41408-020-00366-3"
  },
  multipleMyeloma: {
    citation: "Abdallah, N.H., Binder, M., Rajkumar, S.V. et al. A simple additive staging system for newly diagnosed multiple myeloma. Blood Cancer J. 12, 21 (2022).",
    url: "https://doi.org/10.1038/s41408-022-00611-x"
  },
  mgus: {
    citation: "Rajkumar SV, Kyle RA, Therneau TM, et al. Serum free light chain ratio is an independent risk factor for progression in monoclonal gammopathy of undetermined significance. Blood (2005) 106 (3): 812-817.",
    url: "https://doi.org/10.1182/blood-2005-03-1038"
  },
  amyloidosis: {
    citation: "Muchtar E, Kumar SK, Gertz MA, Grogan M, AbouEzzeddine OF, Jaffe AS, Dispenzieri A. Staging systems use for risk stratification of systemic amyloidosis in the era of high-sensitivity troponin T assay. Blood. 2019 Feb 14;133(7):763-766.",
    url: "https://pubmed.ncbi.nlm.nih.gov/30545829/"
  },
  frailty: {
    citation: "Facon, T., Dimopoulos, M.A., Meuleman, N. et al. A simplified frailty scale predicts outcomes in transplant-ineligible patients with newly diagnosed multiple myeloma treated in the FIRST (MM-020) trial. Leukemia 34, 224–233 (2020).",
    url: "https://doi.org/10.1038/s41375-019-0539-0"
  },
  waldenstrom: {
    citation: "Zanwar, S., Le-Rademacher, J., Durot, E., D'Sa, S., Abeykoon, J. P., Mondello, P., Kumar, S., Sarosiek, S., Paludo, J., Chhabra, S., Cook, J. M., Parrondo, R., Dispenzieri, A., Gonsalves, W. I., Muchtar, E., Ailawadhi, S., Kyle, R. A., Rajkumar, S. V., Delmer, A., . . . Kapoor, P. (2024). Simplified Risk Stratification Model for Patients With Waldenström Macroglobulinemia. Journal of Clinical Oncology.",
    url: "https://doi.org/10.1200/jco.23.02066"
  }
};
```

---

## Assets & Media

### Required Media
```
public/images/team/
  ├── VincentRajkumar.jpg       # Headshot photo
  ├── ShajiKumar.jpg            # Headshot photo
  └── AmadouToure.JPG           # Headshot photo
public/videos/
  └── combined_video.mp4        # Homepage background video (optional)
public/
  ├── favicon.ico               # Favicon
  ├── favicon-16x16.png          # Favicon
  ├── favicon-32x32.png          # Favicon
  └── apple-icon-180x180.png     # Apple touch icon
```

### Image Specifications
- **Headshots**: Square aspect ratio, minimum 400x400px, professional quality
- **Background video**: MP4 format, 1080p, looping, no audio, subtle medical/lab footage
- **Icons**: PNG/ICO sizes as listed above

---

## Disclaimer Text (Complete)

### Full Disclaimer for Modal
```
Those utilizing the MyelomaRisk on this platform ("Calculator") need to acknowledge that the Calculator, as a research instrument, hasn't received validation or endorsement by the United States Food and Drug Administration, the European Medicines Agency, or any equivalent entity. The Calculator is still in its development phase and is delivered "as is," devoid of any supplementary services.

mSMART reserves the right to implement changes to the Calculator at its discretion, without the obligation to notify the Calculator's users. The Calculator serves purely as an analytical tool and is not meant to replace professional medical guidance, or to provide medical diagnosis or prognosis.

If you have concerns regarding test outcomes or any health condition, it is recommended to consult your doctor or an accredited healthcare provider. mSMART will not be held responsible for any patient or Calculator user in relation to the Calculator's usage and/or results, or interpretation of its results. This Calculator is designed for non-commercial use only. For usage in a commercial context or to acquire a license, please reach out to S. Vincent Rajkumar (vincerk@gmail.com) or Shaji K. Kumar (kumarshaji@hotmail.com).
```

---

## Form Validation Rules

### Universal Validation
```javascript
const validationRules = {
  required: {
    message: "Please enter some value",
    validate: (value) => value !== null && value !== undefined && value !== ""
  },
  
  numeric: {
    message: "Please enter a valid number",
    validate: (value) => !isNaN(parseFloat(value))
  },
  
  decimal: {
    message: "Please enter a valid decimal number",
    validate: (value) => /^\d+\.?\d*$/.test(value)
  },
  
  positive: {
    message: "Please enter a positive number",
    validate: (value) => parseFloat(value) >= 0
  },
  
  radioSelected: {
    message: "Please select an option",
    validate: (value) => value === 0 || value === 1
  },
  
  toggleSelected: {
    message: "Please answer all questions before proceeding",
    validate: (selection) => selection.includes(true)
  }
};
```

### Field-Specific Validation
```javascript
const fieldValidation = {
  age: {
    min: 0,
    max: 150,
    message: "Please enter a valid age"
  },
  
  mProtein: {
    min: 0,
    max: 100,  // reasonable upper limit
    unit: "g/dl",
    helpText: "Enter in g/dl. If report is in g/L, divide by 10 (e.g., 25g/L = 2.5 g/dl)"
  },
  
  b2Microglobulin: {
    min: 0,
    unit: "mg/L"
  },
  
  serumAlbumin: {
    min: 0,
    max: 10,
    unit: "g/dL"
  },
  
  troponin: {
    min: 0,
    unit: "µg/L"
  },
  
  ntProBNP: {
    min: 0,
    unit: "ng/L"
  }
};
```

---

## Responsive Design Breakpoints

```javascript
const breakpoints = {
  mobile: {
    max: 599,
    columns: 1,
    fontSize: {
      heading: "28px",
      subheading: "18px",
      body: "14px"
    },
    padding: "16px",
    inputWidth: "100%"
  },
  
  tablet: {
    min: 600,
    max: 1049,
    columns: 2,
    fontSize: {
      heading: "32px",
      subheading: "20px",
      body: "15px"
    },
    padding: "24px",
    inputWidth: "80%"
  },
  
  desktop: {
    min: 1050,
    columns: 3,
    fontSize: {
      heading: "36px",
      subheading: "24px",
      body: "16px"
    },
    padding: "32px",
    inputWidth: "50%"
  }
};
```

---

## Animation Specifications

### Splash Screen Animation Sequence
```javascript
const splashAnimationSequence = {
  step1: {
    delay: 0,
    duration: 1000,
    element: "MyelomaRisk title",
    effect: "fadeIn"
  },
  step2: {
    delay: 2000,
    duration: 1000,
    element: "Subtitle line 1",
    effect: "fadeIn"
  },
  step3: {
    delay: 3000,
    duration: 2000,
    element: "Subtitle line 2",
    effect: "fadeIn"
  },
  step4: {
    delay: 5000,
    duration: 500,
    element: "Navigate to home",
    effect: "fadeOut and route change"
  }
};
```

### Page Transitions
```css
.page-transition {
  animation: fadeIn 300ms ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

---

## Testing Scenarios

### Unit Test Cases

**SMM Calculator:**
```javascript
const testCases = {
  smm: [
    {
      input: { mProtein: 1.0, fsk: 5, fsl: 10, marrow: 10, cyto: false },
      expected: { score: 0, risk: 1.3 }
    },
    {
      input: { mProtein: 2.5, fsk: 15, fsl: 5, marrow: 25, cyto: true },
      expected: { score: 9, risk: 48.6 }
    },
    {
      input: { mProtein: 4.0, fsk: 50, fsl: 1, marrow: 45, cyto: true },
      expected: { score: 17, risk: 88.9 }
    }
  ],
  
  multipleMyeloma: [
    {
      input: { igh: false, q1: false, chr17: false, b2m: 3.0, ldh: false },
      expected: { score: 0, pfs: "63.1 months", os: "11 years" }
    },
    {
      input: { igh: true, q1: false, chr17: false, b2m: 4.0, ldh: false },
      expected: { score: 1, pfs: "44 months", os: "7 years" }
    },
    {
      input: { igh: true, q1: true, chr17: true, b2m: 6.0, ldh: true },
      expected: { score: 5, pfs: "28.6 months", os: "4.5 years" }
    }
  ]
};
```

---

## SEO & Metadata

```html
<head>
  <title>MyelomaRisk - Multiple Myeloma Risk Assessment Calculator</title>
  <meta name="description" content="MyelomaRisk provides evidence-based risk assessment calculators for multiple myeloma, MGUS, amyloidosis, and related plasma cell disorders. Developed in collaboration with Mayo Clinic.">
  <meta name="keywords" content="multiple myeloma, MGUS, smoldering myeloma, amyloidosis, Waldenstrom, myeloma calculator, Mayo Clinic, risk assessment">
  <meta name="author" content="Mayo Clinic mSMART">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Open Graph -->
  <meta property="og:title" content="MyelomaRisk - Myeloma Risk Assessment">
  <meta property="og:description" content="Evidence-based risk calculators for multiple myeloma and related disorders">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://myelomarisk.com">
  
  <!-- Medical context -->
  <meta name="robots" content="index, follow">
  <meta name="medical-disclaimer" content="For research and educational purposes only. Not FDA approved. Consult healthcare provider for medical advice.">
</head>
```

---

## Accessibility Requirements (WCAG 2.1 AA)

### Checklist
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Form labels properly associated with inputs
- [ ] Error messages clearly visible and descriptive
- [ ] ARIA labels for icon buttons and complex widgets
- [ ] Skip navigation link for keyboard users
- [ ] Focus indicators visible on all interactive elements
- [ ] Alternative text for all images
- [ ] Semantic HTML structure (headings, landmarks)
- [ ] Consistent navigation across pages
- [ ] No information conveyed by color alone

### ARIA Labels Example
```html
<button aria-label="Calculate risk score" onclick="calculateRisk()">
  Calculate
</button>

<div role="alert" aria-live="polite">
  <!-- Error messages appear here -->
</div>

<form aria-labelledby="calculator-heading">
  <h2 id="calculator-heading">Smoldering Multiple Myeloma Calculator</h2>
  <!-- Form fields -->
</form>
```

---

## Performance Optimization

### Bundle Size Targets
- Initial page load: < 300KB
- Time to interactive: < 3 seconds
- Largest contentful paint: < 2.5 seconds

### Image Optimization
- Use WebP format with JPEG fallback
- Implement lazy loading for below-fold images
- Compress images to appropriate quality (80-85%)
- Provide responsive image sizes

### Code Splitting
```javascript
// Lazy load calculator pages
const SmolderingCalculator = lazy(() => import('./calculators/Smoldering'));
const MultipleCalculator = lazy(() => import('./calculators/Multiple'));
// ... etc
```

---

## Browser Support

### Target Browsers
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari iOS 12+
- Chrome Android

### Polyfills Needed
- Array.includes
- Object.entries
- Promise
- Fetch API

---

## Deployment Considerations

### Environment Variables
```bash
REACT_APP_VERSION=0.0.1
REACT_APP_ANALYTICS_ID=UA-XXXXXXXX-X
REACT_APP_API_URL=https://api.myelomarisk.com
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src --ext js,jsx"
  }
}
```

---

## Future Enhancements (Phase 2+)

1. **User Accounts & History**
   - Save calculation history
   - Export results as PDF
   - Share results with healthcare provider

2. **Multi-language Support**
   - Spanish
   - French
   - German
   - Chinese

3. **Additional Features**
   - Dark mode toggle
   - Print-friendly layouts
   - Educational videos
   - Glossary of terms
   - FAQs section

4. **Analytics Integration**
   - Track calculator usage
   - Monitor user flow
   - A/B testing for UI improvements

5. **Mobile App**
   - iOS native app
   - Android native app
   - Offline functionality

---

## Contact & Support

**For Technical Issues:**
- Developer: Elhadji Amadou Touré (tourea@carleton.edu)

**For Medical/Research Questions:**
- Dr. S. Vincent Rajkumar (vincerk@gmail.com)
- Dr. Shaji K. Kumar (kumarshaji@hotmail.com)

**Official Website:**
- mSMART: https://msmart.org

---

## License & Copyright

```
MIT License

Copyright (c) 2024 Mayo Clinic mSMART

This Calculator is designed for non-commercial use only. 
For commercial usage or licensing, contact:
- S. Vincent Rajkumar (vincerk@gmail.com)
- Shaji K. Kumar (kumarshaji@hotmail.com)
```

---

## Changelog

### Version 0.0.1 (Current Flutter App)
- Initial release with 6 calculators
- Splash screen with video background
- Responsive design
- Authors page
- External links to iSTOPMM resources

### Version 1.0.0 (Target - Web Rebuild)
- Migrated to modern web framework
- Improved responsive design
- Enhanced accessibility
- Performance optimizations
- Better mobile experience

---

**End of Technical Reference Document**

*Last Updated: January 2026*
*Original Flutter App Repository: myelomarisk*
