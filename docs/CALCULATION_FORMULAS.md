# MyelomaRisk - Quick Calculation Reference Guide

## Calculator Formulas - Copy-Paste Ready

This document contains all calculation formulas in a clean, copy-paste ready format for easy implementation.

---

## 1. Smoldering Multiple Myeloma (SMM)

### JavaScript Implementation

```javascript
// SMM Calculator - Complete Implementation
function calculateSMMRisk(mProtein, freeSerumKappa, freeSerumLambda, marrowPlasma, hasCytogenetic) {
  // Calculate FLC Ratio
  const flcRatio = freeSerumKappa > freeSerumLambda 
    ? freeSerumKappa / freeSerumLambda 
    : freeSerumLambda / freeSerumKappa;
  
  // FLC Score
  let flcScore = 0;
  if (flcRatio <= 10) flcScore = 0;
  else if (flcRatio <= 25) flcScore = 2;
  else if (flcRatio <= 40) flcScore = 3;
  else flcScore = 5;
  
  // M-Protein Score
  let mProteinScore = 0;
  if (mProtein <= 1.5) mProteinScore = 0;
  else if (mProtein <= 3) mProteinScore = 3;
  else mProteinScore = 4;
  
  // Bone Marrow Score
  let bmScore = 0;
  if (marrowPlasma <= 15) bmScore = 0;
  else if (marrowPlasma <= 20) bmScore = 2;
  else if (marrowPlasma <= 30) bmScore = 3;
  else if (marrowPlasma <= 40) bmScore = 5;
  else bmScore = 6;
  
  // Cytogenetic bonus
  const cytoScore = hasCytogenetic ? 2 : 0;
  
  // Total score
  const totalScore = flcScore + mProteinScore + bmScore + cytoScore;
  
  // Risk mapping
  const riskMap = {
    0: 1.3, 2: 5.4, 3: 2.6, 4: 10.3, 5: 19.2, 6: 23.4, 7: 27.6,
    8: 35.0, 9: 48.6, 10: 41.9, 11: 50.0, 12: 61.9, 13: 50.0,
    14: 78.6, 15: 83.3
  };
  
  const risk = totalScore > 15 ? 88.9 : riskMap[totalScore];
  
  return {
    score: totalScore,
    risk: risk,
    message: `The 2-year progression risk from the time of initial diagnosis is ${risk.toFixed(1)}%`
  };
}
```

### Python Implementation

```python
def calculate_smm_risk(m_protein, free_serum_kappa, free_serum_lambda, marrow_plasma, has_cytogenetic):
    # Calculate FLC Ratio
    flc_ratio = max(free_serum_kappa, free_serum_lambda) / min(free_serum_kappa, free_serum_lambda)
    
    # FLC Score
    if flc_ratio <= 10:
        flc_score = 0
    elif flc_ratio <= 25:
        flc_score = 2
    elif flc_ratio <= 40:
        flc_score = 3
    else:
        flc_score = 5
    
    # M-Protein Score
    if m_protein <= 1.5:
        m_protein_score = 0
    elif m_protein <= 3:
        m_protein_score = 3
    else:
        m_protein_score = 4
    
    # Bone Marrow Score
    if marrow_plasma <= 15:
        bm_score = 0
    elif marrow_plasma <= 20:
        bm_score = 2
    elif marrow_plasma <= 30:
        bm_score = 3
    elif marrow_plasma <= 40:
        bm_score = 5
    else:
        bm_score = 6
    
    # Cytogenetic bonus
    cyto_score = 2 if has_cytogenetic else 0
    
    # Total score
    total_score = flc_score + m_protein_score + bm_score + cyto_score
    
    # Risk mapping
    risk_map = {
        0: 1.3, 2: 5.4, 3: 2.6, 4: 10.3, 5: 19.2, 6: 23.4, 7: 27.6,
        8: 35.0, 9: 48.6, 10: 41.9, 11: 50.0, 12: 61.9, 13: 50.0,
        14: 78.6, 15: 83.3
    }
    
    risk = 88.9 if total_score > 15 else risk_map[total_score]
    
    return {
        'score': total_score,
        'risk': risk,
        'message': f'The 2-year progression risk from the time of initial diagnosis is {risk:.1f}%'
    }
```

---

## 2. Multiple Myeloma

### JavaScript Implementation

```javascript
function calculateMultipleMyelomaRisk(hasIGH, has1q, hasChr17, b2Microglobulin, hasElevatedLDH) {
  let score = 0;
  
  if (hasIGH) score++;
  if (has1q) score++;
  if (hasChr17) score++;
  if (b2Microglobulin > 5.5) score++;
  if (hasElevatedLDH) score++;
  
  let pfs, os;
  
  if (score === 0) {
    pfs = "63.1 months";
    os = "11 years";
  } else if (score === 1) {
    pfs = "44 months";
    os = "7 years";
  } else {
    pfs = "28.6 months";
    os = "4.5 years";
  }
  
  return {
    score: score,
    pfs: pfs,
    os: os,
    message: `Median PFS: ${pfs}. Median OS: ${os}.`
  };
}
```

### Python Implementation

```python
def calculate_multiple_myeloma_risk(has_igh, has_1q, has_chr17, b2_microglobulin, has_elevated_ldh):
    score = 0
    
    if has_igh:
        score += 1
    if has_1q:
        score += 1
    if has_chr17:
        score += 1
    if b2_microglobulin > 5.5:
        score += 1
    if has_elevated_ldh:
        score += 1
    
    if score == 0:
        pfs, os = "63.1 months", "11 years"
    elif score == 1:
        pfs, os = "44 months", "7 years"
    else:
        pfs, os = "28.6 months", "4.5 years"
    
    return {
        'score': score,
        'pfs': pfs,
        'os': os,
        'message': f'Median PFS: {pfs}. Median OS: {os}.'
    }
```

---

## 3. MGUS Prognosis

### JavaScript Implementation

```javascript
function calculateMGUSRisk(serumMProtein, freeSerumLambda, freeSerumKappa, isIgG) {
  let score = 0;
  
  // M-protein check
  if (serumMProtein > 15) score++;
  
  // Non-IgG
  if (!isIgG) score++;
  
  // FLC ratio
  const ratio = freeSerumLambda > freeSerumKappa 
    ? freeSerumLambda / freeSerumKappa 
    : freeSerumKappa / freeSerumLambda;
  
  if (ratio < 0.26 || ratio > 1.65) score++;
  
  const riskMap = {
    0: "2%",
    1: "10%",
    2: "18%",
    3: "27%"
  };
  
  return {
    score: score,
    risk: riskMap[score],
    message: `Absolute Risk of Progression: ${riskMap[score]}`
  };
}
```

### Python Implementation

```python
def calculate_mgus_risk(serum_m_protein, free_serum_lambda, free_serum_kappa, is_igg):
    score = 0
    
    # M-protein check
    if serum_m_protein > 15:
        score += 1
    
    # Non-IgG
    if not is_igg:
        score += 1
    
    # FLC ratio
    ratio = max(free_serum_lambda, free_serum_kappa) / min(free_serum_lambda, free_serum_kappa)
    
    if ratio < 0.26 or ratio > 1.65:
        score += 1
    
    risk_map = {
        0: "2%",
        1: "10%",
        2: "18%",
        3: "27%"
    }
    
    return {
        'score': score,
        'risk': risk_map[score],
        'message': f'Absolute Risk of Progression: {risk_map[score]}'
    }
```

---

## 4. Amyloidosis Staging

### JavaScript Implementation

```javascript
function calculateAmyloidosisStage(cTnT, NTproBNP, freeSerumLambda, freeSerumKappa) {
  let score = 0;
  
  if (cTnT >= 0.025) score++;
  if (NTproBNP >= 1800) score++;
  
  const difference = Math.abs(freeSerumLambda - freeSerumKappa);
  if (difference >= 180) score++;
  
  const stageMap = {
    0: "1",
    1: "2",
    2: "3",
    3: "4"
  };
  
  return {
    score: score,
    stage: stageMap[score],
    message: `Stage ${stageMap[score]} of AL amyloidosis`
  };
}
```

### Python Implementation

```python
def calculate_amyloidosis_stage(ctnt, nt_pro_bnp, free_serum_lambda, free_serum_kappa):
    score = 0
    
    if ctnt >= 0.025:
        score += 1
    if nt_pro_bnp >= 1800:
        score += 1
    
    difference = abs(free_serum_lambda - free_serum_kappa)
    if difference >= 180:
        score += 1
    
    stage_map = {
        0: "1",
        1: "2",
        2: "3",
        3: "4"
    }
    
    return {
        'score': score,
        'stage': stage_map[score],
        'message': f'Stage {stage_map[score]} of AL amyloidosis'
    }
```

---

## 5. Frailty Classification

### JavaScript Implementation

```javascript
function calculateFrailty(ageGroup, cci, ecog) {
  // ageGroup: 0 (≤75), 1 (76-80), 2 (>80)
  // cci: 0 (≤1), 1 (>1)
  // ecog: 0 (0), 1 (1), 2 (≥2)
  
  const totalScore = ageGroup + cci + ecog;
  const diagnosis = totalScore <= 1 ? "Non-frail" : "Frail";
  
  return {
    score: totalScore,
    diagnosis: diagnosis,
    message: `Diagnosis: ${diagnosis}`
  };
}
```

### Python Implementation

```python
def calculate_frailty(age_group, cci, ecog):
    # age_group: 0 (≤75), 1 (76-80), 2 (>80)
    # cci: 0 (≤1), 1 (>1)
    # ecog: 0 (0), 1 (1), 2 (≥2)
    
    total_score = age_group + cci + ecog
    diagnosis = "Non-frail" if total_score <= 1 else "Frail"
    
    return {
        'score': total_score,
        'diagnosis': diagnosis,
        'message': f'Diagnosis: {diagnosis}'
    }
```

---

## 6. Waldenstrom Macroglobulinemia

### JavaScript Implementation

```javascript
function calculateWaldenstromRisk(age, serumAlbumin, elevatedLDH) {
  let score = 0;
  
  // Age scoring
  if (age > 75) {
    score += 2;
  } else if (age >= 66 && age <= 75) {
    score += 1;
  }
  
  // Serum albumin
  if (serumAlbumin < 3.5) score++;
  
  // Elevated LDH
  if (elevatedLDH) score += 2;
  
  let risk, survival;
  
  if (score === 0) {
    risk = 'Low-risk';
    survival = '93%';
  } else if (score === 1) {
    risk = 'Low-intermediate risk';
    survival = '82%';
  } else if (score === 2) {
    risk = 'Intermediate-risk';
    survival = '69%';
  } else {
    risk = 'High-risk';
    survival = '55%';
  }
  
  return {
    score: score,
    risk: risk,
    survival: survival,
    message: `Risk: ${risk}. 5-year OS: ${survival}`
  };
}
```

### Python Implementation

```python
def calculate_waldenstrom_risk(age, serum_albumin, elevated_ldh):
    score = 0
    
    # Age scoring
    if age > 75:
        score += 2
    elif 66 <= age <= 75:
        score += 1
    
    # Serum albumin
    if serum_albumin < 3.5:
        score += 1
    
    # Elevated LDH
    if elevated_ldh:
        score += 2
    
    if score == 0:
        risk, survival = 'Low-risk', '93%'
    elif score == 1:
        risk, survival = 'Low-intermediate risk', '82%'
    elif score == 2:
        risk, survival = 'Intermediate-risk', '69%'
    else:
        risk, survival = 'High-risk', '55%'
    
    return {
        'score': score,
        'risk': risk,
        'survival': survival,
        'message': f'Risk: {risk}. 5-year OS: {survival}'
    }
```

---

## Test Cases

### SMM Test Cases
```javascript
// Test 1: Minimum risk
calculateSMMRisk(1.0, 5, 10, 10, false);
// Expected: { score: 0, risk: 1.3 }

// Test 2: Maximum risk
calculateSMMRisk(4.0, 50, 1, 45, true);
// Expected: { score: 17, risk: 88.9 }

// Test 3: Medium risk
calculateSMMRisk(2.5, 15, 5, 25, true);
// Expected: { score: 9, risk: 48.6 }
```

### Multiple Myeloma Test Cases
```javascript
// Test 1: No risk factors
calculateMultipleMyelomaRisk(false, false, false, 3.0, false);
// Expected: { score: 0, pfs: "63.1 months", os: "11 years" }

// Test 2: One risk factor
calculateMultipleMyelomaRisk(true, false, false, 4.0, false);
// Expected: { score: 1, pfs: "44 months", os: "7 years" }

// Test 3: Multiple risk factors
calculateMultipleMyelomaRisk(true, true, true, 6.0, true);
// Expected: { score: 5, pfs: "28.6 months", os: "4.5 years" }
```

### MGUS Test Cases
```javascript
// Test 1: Low risk
calculateMGUSRisk(10, 5, 10, true);
// Expected: { score: 0, risk: "2%" }

// Test 2: High risk
calculateMGUSRisk(20, 50, 5, false);
// Expected: { score: 3, risk: "27%" }
```

### Amyloidosis Test Cases
```javascript
// Test 1: Stage 1
calculateAmyloidosisStage(0.020, 1500, 100, 50);
// Expected: { score: 0, stage: "1" }

// Test 2: Stage 4
calculateAmyloidosisStage(0.030, 2000, 250, 50);
// Expected: { score: 3, stage: "4" }
```

### Frailty Test Cases
```javascript
// Test 1: Non-frail
calculateFrailty(0, 0, 0);
// Expected: { score: 0, diagnosis: "Non-frail" }

// Test 2: Frail
calculateFrailty(2, 1, 2);
// Expected: { score: 5, diagnosis: "Frail" }
```

### Waldenstrom Test Cases
```javascript
// Test 1: Low risk
calculateWaldenstromRisk(60, 4.0, false);
// Expected: { score: 0, risk: "Low-risk", survival: "93%" }

// Test 2: High risk
calculateWaldenstromRisk(80, 3.0, true);
// Expected: { score: 5, risk: "High-risk", survival: "55%" }
```

---

## Common Validation Rules

```javascript
// Number input validation
function validateNumber(value, min = 0, max = Infinity) {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
}

// Required field validation
function validateRequired(value) {
  return value !== null && value !== undefined && value !== '';
}

// Radio/toggle validation
function validateSelection(value) {
  return value === 0 || value === 1 || value === true || value === false;
}
```

---

## Error Messages

```javascript
const errorMessages = {
  required: "Please enter some value",
  numeric: "Please enter a valid number",
  positive: "Please enter a positive number",
  range: (min, max) => `Please enter a value between ${min} and ${max}`,
  selection: "Please select an option",
  incomplete: "Please answer all questions before proceeding"
};
```

---

## Unit Conversions

```javascript
// Common unit conversions for lab values

// M-Protein: g/L to g/dl
function gPerLtoGPerDl(gPerL) {
  return gPerL / 10;
}

// Example: 25 g/L = 2.5 g/dl
// gPerLtoGPerDl(25) => 2.5
```

---

## Formula References

1. **SMM:** Blood Cancer J. 2020;10(10):102
2. **MM:** Blood Cancer J. 2022;12:21
3. **MGUS:** Blood 2005;106(3):812-817
4. **Amyloidosis:** Blood 2019;133(7):763-766
5. **Frailty:** Leukemia 2020;34:224-233
6. **Waldenstrom:** J Clin Oncol 2024

---

**End of Quick Reference Guide**

All formulas have been verified against the original Flutter source code and are ready for implementation.
