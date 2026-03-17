# Quick Reference: 20-2-20 SMM Model

## Overview
The **20-2-20 Model** is a simplified risk stratification system for Smoldering Multiple Myeloma (SMM) based on three key thresholds.

**Source:** Avet-Loiseau et al. 2025 (Figure 5) - International Myeloma Society / International Myeloma Working Group Consensus

---

## The Three Criteria

### 1. M-Protein ≥ **2** g/dL
**Question:** Is the M-Protein level 2.0 g/dL or higher?
- ✅ Yes = 1 point
- ❌ No = 0 points

### 2. FLC Ratio ≥ **20**
**Question:** Is the Free Light Chain ratio 20 or higher?
- ✅ Yes = 1 point
- ❌ No = 0 points

**Calculation:** 
- Ratio = κ/λ OR λ/κ (whichever is higher)
- If κ > λ: use κ/λ
- If λ > κ: use λ/κ

### 3. Bone Marrow Plasma Cells ≥ **20**%
**Question:** Are bone marrow plasma cells 20% or higher?
- ✅ Yes = 1 point
- ❌ No = 0 points

---

## Risk Categories

| Criteria Met | Risk Category | 2-Year Risk* |
|--------------|---------------|--------------|
| **0** | Low Risk | ~5% |
| **1** | Low-Intermediate | ~15% |
| **2** | High-Intermediate | ~25-35% |
| **3** | High Risk | ~50-70% |

*Exact percentages to be confirmed from Figure 5 of the paper

---

## Examples

### Example 1: Low Risk
- M-Protein: 1.5 g/dL ❌
- FLC Ratio: 12 ❌
- Bone Marrow: 18% ❌
- **Result:** 0/3 criteria → Low Risk (~5%)

### Example 2: High-Intermediate Risk
- M-Protein: 2.8 g/dL ✅
- FLC Ratio: 35 ✅
- Bone Marrow: 15% ❌
- **Result:** 2/3 criteria → High-Intermediate Risk (~25-35%)

### Example 3: High Risk
- M-Protein: 3.2 g/dL ✅
- FLC Ratio: 45 ✅
- Bone Marrow: 35% ✅
- **Result:** 3/3 criteria → High Risk (~50-70%)

---

## Comparison to Current IMWG2020 Model

| Feature | IMWG2020 (Current) | 20-2-20 (New) |
|---------|-------------------|---------------|
| **Complexity** | Complex scoring (0-17) | Simple binary (0-3) |
| **M-Protein** | Scored 0-4 | ≥2 g/dL? Yes/No |
| **FLC** | Ratio scored 0-5 | ≥20? Yes/No |
| **Bone Marrow** | Scored 0-6 | ≥20%? Yes/No |
| **Cytogenetics** | +2 if present | Not included |
| **Output** | 18 different risk % | 4 risk categories |
| **Best For** | Detailed assessment | Quick screening |

---

## Key Advantages

✅ **Simplicity:** Only 3 yes/no questions  
✅ **Speed:** 1-2 minutes to complete  
✅ **Easy to Remember:** The "20-2-20" name reflects all three thresholds  
✅ **Clinical Practicality:** Quick bedside assessment  
✅ **Patient-Friendly:** Easier to explain and understand  

---

## Clinical Use

**When to Use:**
- Initial quick assessment
- Follow-up monitoring
- Patient counseling
- Screening for clinical trials

**When to Use Detailed Model Instead:**
- Comprehensive prognostication needed
- Treatment planning
- Research protocols requiring granular data
- High-risk cytogenetics present

---

## Implementation Checklist

- [ ] Extract exact risk percentages from Figure 5
- [ ] Verify FLC ratio calculation method
- [ ] Confirm units (g/dL vs g/L)
- [ ] Clinical team validation
- [ ] Create calculator interface
- [ ] Write patient education materials
- [ ] Test with sample cases
- [ ] Deploy to website

---

## Code Snippet

```javascript
function calculate2020Risk(mProtein, flcRatio, bmPercent) {
  let score = 0;
  if (mProtein >= 2.0) score++;
  if (flcRatio >= 20) score++;
  if (bmPercent >= 20) score++;
  
  const risks = ["~5%", "~15%", "~25-35%", "~50-70%"];
  const categories = ["Low", "Low-Intermediate", 
                      "High-Intermediate", "High"];
  
  return {
    score: score,
    category: categories[score],
    risk: risks[score]
  };
}
```

---

**Reference:** Avet-Loiseau H, et al. IMS-IMWG Consensus Recommendations. Blood (2025).

**Created:** January 1, 2026  
**Status:** Awaiting exact data from Figure 5
