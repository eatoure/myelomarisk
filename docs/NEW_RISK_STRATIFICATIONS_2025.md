# MyelomaRisk - New Risk Stratifications (2025 Updates)

## Overview

This document contains information about **two new risk stratification models** that will be added to the MyelomaRisk website:

1. **Updated Multiple Myeloma Risk Stratification** (JCO 2025 Genomics)
2. **Second Smoldering Multiple Myeloma Risk Stratification** (Avet-Loiseau et al. 2025 - Figure 5)

These updates are based on newly published research and will enhance the existing calculators on myelomarisk.com.

---

## Source Papers

### Paper 1: JCO 2025 Genomics
**File:** `JCO 2025 Genomics.pdf`

**Purpose:** Updates the Multiple Myeloma risk stratification calculator

**Key Changes:**
- New genomic markers
- Updated risk categories
- Refined prognostic scoring
- Enhanced molecular profiling integration

---

### Paper 2: Avet-Loiseau et al. 2025 (IMS-IMWG Consensus)
**File:** `avet-loiseau-et-al-2025-international-myeloma-society-international-myeloma-working-group-consensus-recommendations-on.pdf`

**Full Title:** International Myeloma Society - International Myeloma Working Group Consensus Recommendations

**Purpose:** Provides second Smoldering Myeloma risk stratification model

**Key Features:**
- Based on Figure 5 of the paper
- Uses the simpler **20-2-20 model** (not the complex IMWG2020 scoring currently on website)
- Alternative assessment tool for SMM patients

---

## Implementation Plan

### 1. Multiple Myeloma Calculator Update (JCO 2025)

**Current Calculator:**
- Uses: IGH translocations, 1q gain, Chr 17 abnormality, β-2 microglobulin, elevated LDH
- Reference: Abdallah et al. 2022 (Blood Cancer J)

**Planned Update:**
- Will incorporate new genomic risk factors from JCO 2025 paper
- May add additional molecular markers
- Updated survival estimates based on latest data

**Status:** Awaiting detailed algorithm extraction from paper

---

### 2. Smoldering Myeloma - Second Calculator (Figure 5)

**Current Calculator (IMWG2020 - Complex Model):**
- Uses: M-Protein score (0-4 points)
- FLC ratio score (0-5 points)  
- Bone marrow plasma cell score (0-6 points)
- Cytogenetic abnormalities (+2 points)
- Total score → 2-year progression risk %

**New Calculator (20-2-20 Model - Simplified):**
Based on Figure 5 from Avet-Loiseau et al. 2025

#### The 20-2-20 Model

**Risk Criteria (3 factors):**

1. **M-Protein ≥ 2 g/dL** (Yes/No)
2. **Free Light Chain (FLC) Ratio ≥ 20** (Yes/No)
3. **Bone Marrow Plasma Cells ≥ 20%** (Yes/No)

**Risk Stratification:**

| Criteria Met | Risk Category | 2-Year Progression Risk |
|--------------|---------------|-------------------------|
| 0 factors | Low Risk | ~5% |
| 1 factor | Low-Intermediate Risk | ~15% |
| 2 factors | High-Intermediate Risk | ~25-35% |
| 3 factors | High Risk | ~50-70% |

*(Note: Exact percentages to be extracted from Figure 5 of the paper)*

---

## Comparison: Current vs New SMM Models

### Model 1: IMWG2020 (Current - Complex Scoring)
```
Inputs:
- M-Protein (g/dL) → scored 0-4
- FLC Kappa level
- FLC Lambda level → ratio calculated → scored 0-5
- Bone Marrow % → scored 0-6
- Cytogenetic abnormalities → +2 if present

Total Score: 0-17 points
Output: 2-year progression risk % (1.3% - 88.9%)
```

### Model 2: 20-2-20 (New - Simplified)
```
Inputs:
- M-Protein ≥ 2 g/dL? (Yes/No)
- FLC Ratio ≥ 20? (Yes/No) 
- Bone Marrow Plasma Cells ≥ 20%? (Yes/No)

Total: 0-3 factors present
Output: Risk category + 2-year progression risk %
```

**Key Difference:** The new model is much simpler—binary thresholds instead of complex scoring.

---

## Website Implementation Strategy

### Option A: Replace Current SMM Calculator
- Remove complex IMWG2020 scoring
- Replace with simpler 20-2-20 model
- **Pros:** Simpler for users, easier to understand
- **Cons:** Loses granularity of 0-17 point scale

### Option B: Offer Both SMM Calculators (RECOMMENDED)
- Keep current complex model as "SMM - Detailed Risk Assessment"
- Add new simple model as "SMM - Simplified 20-2-20 Risk Assessment"
- Let users choose which to use
- **Pros:** Flexibility, comprehensive coverage
- **Cons:** Two calculators for same condition

### Option C: Make 20-2-20 Primary, Complex as Advanced
- New users see 20-2-20 model first
- "Advanced Assessment" link to complex model
- **Pros:** Guides users to simpler tool first
- **Cons:** May confuse returning users

**Recommendation:** **Option B** - Offer both models clearly labeled

---

## Technical Implementation Details

### New SMM Calculator (20-2-20 Model)

#### JavaScript Implementation
```javascript
function calculate2020SMRisk(mProtein, flcRatio, boneMarrowPercent) {
  let factorsPresent = 0;
  
  // Check each 20-2-20 criterion
  if (mProtein >= 2.0) factorsPresent++;
  if (flcRatio >= 20) factorsPresent++;
  if (boneMarrowPercent >= 20) factorsPresent++;
  
  // Map factors to risk category and progression risk
  const riskMapping = {
    0: {
      category: "Low Risk",
      progressionRisk: "~5%",
      description: "Excellent prognosis with low likelihood of progression"
    },
    1: {
      category: "Low-Intermediate Risk",
      progressionRisk: "~15%",
      description: "Favorable prognosis with monitoring recommended"
    },
    2: {
      category: "High-Intermediate Risk",
      progressionRisk: "~25-35%",
      description: "Moderate risk requiring closer monitoring"
    },
    3: {
      category: "High Risk",
      progressionRisk: "~50-70%",
      description: "Significant risk; consider clinical trial or treatment"
    }
  };
  
  return {
    factorsPresent: factorsPresent,
    riskCategory: riskMapping[factorsPresent].category,
    progressionRisk: riskMapping[factorsPresent].progressionRisk,
    description: riskMapping[factorsPresent].description
  };
}
```

#### Python Implementation
```python
def calculate_20_2_20_smm_risk(m_protein, flc_ratio, bone_marrow_percent):
    """
    Calculate SMM risk using simplified 20-2-20 model
    
    Args:
        m_protein: M-Protein level in g/dL
        flc_ratio: Free Light Chain ratio (kappa/lambda or lambda/kappa, whichever is higher)
        bone_marrow_percent: Bone marrow plasma cell percentage
    
    Returns:
        dict with risk category, progression risk, and description
    """
    factors_present = 0
    
    # Check each 20-2-20 criterion
    if m_protein >= 2.0:
        factors_present += 1
    if flc_ratio >= 20:
        factors_present += 1
    if bone_marrow_percent >= 20:
        factors_present += 1
    
    # Risk mapping
    risk_mapping = {
        0: {
            "category": "Low Risk",
            "progression_risk": "~5%",
            "description": "Excellent prognosis with low likelihood of progression"
        },
        1: {
            "category": "Low-Intermediate Risk",
            "progression_risk": "~15%",
            "description": "Favorable prognosis with monitoring recommended"
        },
        2: {
            "category": "High-Intermediate Risk",
            "progression_risk": "~25-35%",
            "description": "Moderate risk requiring closer monitoring"
        },
        3: {
            "category": "High Risk",
            "progression_risk": "~50-70%",
            "description": "Significant risk; consider clinical trial or treatment"
        }
    }
    
    return {
        "factors_present": factors_present,
        "risk_category": risk_mapping[factors_present]["category"],
        "progression_risk": risk_mapping[factors_present]["progression_risk"],
        "description": risk_mapping[factors_present]["description"]
    }
```

---

## UI Mockup for New SMM Calculator

### Page Title
**Smoldering Multiple Myeloma - Simplified Risk Assessment (20-2-20 Model)**

### Description
"This simplified risk model uses three key criteria to assess 2-year progression risk. It is based on the International Myeloma Society and International Myeloma Working Group consensus recommendations (2025)."

### Input Form

**1. M-Protein Level**
- Label: "M-Protein (g/dL)"
- Input Type: Number (decimal)
- Helper Text: "Is your M-Protein level 2 g/dL or higher?"
- Validation: ≥ 0

**2. Free Light Chain Ratio**
- Label: "FLC Ratio (κ/λ or λ/κ)"
- Input Type: Number (decimal)
- Helper Text: "Enter the higher ratio (kappa/lambda or lambda/kappa). Is it 20 or higher?"
- Validation: ≥ 0
- Info Icon: "The FLC ratio is calculated from your free serum kappa and lambda levels. Use the higher of the two ratios."

**3. Bone Marrow Plasma Cells**
- Label: "Bone Marrow Plasma Cell %"
- Input Type: Number (decimal)
- Helper Text: "Is your bone marrow plasma cell percentage 20% or higher?"
- Validation: 0-100

### Results Display

**Output Card:**
```
┌─────────────────────────────────────────┐
│  Risk Assessment Results                 │
│                                          │
│  Criteria Met: X of 3                    │
│                                          │
│  ✓ M-Protein ≥ 2 g/dL                   │
│  ✓ FLC Ratio ≥ 20                       │
│  ✗ Bone Marrow ≥ 20%                    │
│                                          │
│  Risk Category: [Category Name]          │
│  2-Year Progression Risk: [X%]           │
│                                          │
│  [Description text]                      │
│                                          │
│  This assessment is for untreated        │
│  patients and should be discussed with   │
│  your healthcare provider.               │
└─────────────────────────────────────────┘
```

### Reference Citation
"Avet-Loiseau H, et al. International Myeloma Society - International Myeloma Working Group Consensus Recommendations on Risk Stratification in Multiple Myeloma. Blood (2025). [Link to paper]"

---

## Migration Strategy

### Phase 1: Documentation Review (CURRENT)
- ✅ Papers added to repository
- ✅ Initial documentation created
- ⏳ Extract exact figures from papers
- ⏳ Validate risk percentages from Figure 5

### Phase 2: Algorithm Development
- Extract precise risk percentages from Figure 5
- Verify calculation logic with Mayo Clinic team
- Create test cases
- Validate against paper data

### Phase 3: Website Integration
- Add new SMM 20-2-20 calculator page
- Update Multiple Myeloma calculator (JCO 2025)
- Create comparison guide for patients
- Update navigation/menu

### Phase 4: Testing & Validation
- Clinical accuracy review
- User testing
- Accessibility audit
- Cross-browser testing

### Phase 5: Deployment
- Deploy to production
- Update references
- Monitor user feedback
- Iterate as needed

---

## Additional Notes

### Important Clarifications

**1. Why Two SMM Calculators?**
- **Complex Model (Current):** Provides detailed 0-17 point score with granular risk assessment
- **Simple Model (New):** Provides quick, easy-to-understand binary assessment
- Different patients/providers may prefer different approaches

**2. FLC Ratio Calculation**
For the 20-2-20 model:
- User provides Kappa and Lambda values
- Calculate both ratios: Kappa/Lambda AND Lambda/Kappa
- Use the **higher** ratio for the ≥20 threshold
- This matches the approach in the paper

**3. Reference to Same Paper**
The 20-2-20 model comes from the **same paper** (Avet-Loiseau et al. 2025) that we're already referencing for the complex IMWG2020 model. The key difference:
- **Current website:** Uses complex scoring from earlier sections
- **New calculator:** Uses simplified 20-2-20 from Figure 5

---

## Action Items Before Implementation

### Required from Papers

**From Avet-Loiseau et al. 2025 (Figure 5):**
- [ ] Extract exact 2-year progression risk percentages for each risk group
- [ ] Verify if confidence intervals are provided
- [ ] Confirm patient population characteristics
- [ ] Check for any additional criteria or caveats
- [ ] Note sample size and validation cohorts

**From JCO 2025 Genomics:**
- [ ] Extract complete new risk stratification algorithm
- [ ] Identify all new genomic markers
- [ ] Document scoring system
- [ ] Extract survival curves/data
- [ ] Note validation cohorts
- [ ] Identify any contraindications or special populations

### Required from Mayo Clinic Team
- [ ] Clinical review of both new models
- [ ] Approval for implementation
- [ ] Verification of interpretation
- [ ] Educational content review
- [ ] Disclaimer updates

---

## User Education Strategy

### For Website Visitors

**New Page: "Which SMM Calculator Should I Use?"**

| Feature | Complex Model (IMWG2020) | Simple Model (20-2-20) |
|---------|-------------------------|----------------------|
| **Best For** | Detailed prognostication | Quick assessment |
| **Complexity** | Moderate (5 inputs, weighted scoring) | Simple (3 yes/no questions) |
| **Output** | Specific % (1.3% - 88.9%) | Risk category + range |
| **Time Required** | 3-5 minutes | 1-2 minutes |
| **Granularity** | 18 possible scores | 4 risk categories |
| **When to Use** | Initial diagnosis, detailed planning | Quick screening, follow-up |

**Recommendation:** "If you're newly diagnosed, start with the Simple Model for a quick assessment, then use the Complex Model for more detailed prognostication."

---

## File Organization

```
Repository Structure:
├── JCO 2025 Genomics.pdf
├── avet-loiseau-et-al-2025-[...].pdf
├── NEW_RISK_STRATIFICATIONS_2025.md (THIS FILE)
├── LOVABLE_PROMPT.md (Updated with new calculators)
├── TECHNICAL_REFERENCE.md (Updated with new algorithms)
├── CALCULATION_FORMULAS.md (Updated with new formulas)
└── [Other documentation files]
```

---

## Next Steps

### Immediate (This Week)
1. ✅ Create this documentation file
2. ⏳ Review papers in detail to extract Figure 5 data
3. ⏳ Extract JCO 2025 algorithm details
4. ⏳ Create detailed algorithm specifications

### Short Term (Next 2 Weeks)
1. Update LOVABLE_PROMPT.md with new calculators
2. Update TECHNICAL_REFERENCE.md with algorithms
3. Update CALCULATION_FORMULAS.md with code
4. Create test cases for validation

### Medium Term (Next Month)
1. Implement in development environment
2. Clinical team review
3. User testing
4. Refinement based on feedback

### Long Term (Next 2-3 Months)
1. Production deployment
2. User education materials
3. Monitor usage and feedback
4. Iterate and improve

---

## Contact & Collaboration

**For Questions About:**
- **Clinical Accuracy:** Dr. S. Vincent Rajkumar (vincerk@gmail.com)
- **Implementation:** Elhadji Amadou Touré (tourea@carleton.edu)
- **Research Context:** Dr. Shaji Kumar (kumarshaji@hotmail.com)

**Papers Location:**
- Both PDFs in repository root directory
- Available for team review
- Not for public distribution without permission

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| Jan 1, 2026 | 1.0 | Initial documentation created based on paper availability |
| TBD | 1.1 | Add exact risk percentages from Figure 5 |
| TBD | 1.2 | Add JCO 2025 algorithm details |
| TBD | 2.0 | Implementation-ready specifications |

---

## Important Reminders

1. **Clinical Validation Required:** All new calculators must be clinically validated before deployment
2. **Disclaimer Update:** Update legal disclaimer to reflect 2025 research basis
3. **Patient Education:** Provide clear guidance on when to use each calculator
4. **Reference Updates:** Ensure all citations are accurate and linked
5. **FDA Compliance:** Maintain "research tool only" status, not diagnostic device

---

**Status:** Documentation in Progress - Awaiting Detailed Paper Analysis

**Next Action:** Extract specific data from Figure 5 and JCO 2025 paper to complete algorithm specifications

---

**Document Created:** January 1, 2026  
**Last Updated:** January 1, 2026  
**Maintained By:** MyelomaRisk Development Team
