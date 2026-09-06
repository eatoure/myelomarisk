# MyelomaRisk

MyelomaRisk provides risk stratification calculators for plasma cell disorders, including smoldering multiple myeloma, multiple myeloma, MGUS, amyloidosis, frailty assessment, and Waldenstrom macroglobulinemia. The app is built with React, TypeScript, and Vite.

## Quick start

```sh
npm install
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

## Reviewer preview

Calculators awaiting clinical sign-off are gated at `/#/preview` and are not
listed on the home page. See `docs/REVIEWER_PREVIEW.md` for how to configure
the password and promote a calculator to live. Note that the gate is
obfuscation for a static site, not a security control.

## Docs and references

- `docs/CALCULATION_FORMULAS.md` - Core formulas and reference implementations
- `docs/TECHNICAL_REFERENCE.md` - Detailed algorithms, UI structure, and data handling
- `docs/NEW_RISK_STRATIFICATIONS_2025.md` - Future update notes for 2025 models
- `docs/QUICK_REF_20-2-20.md` - 20-2-20 SMM model summary
- `docs/REVIEWER_PREVIEW.md` - Password-gated preview for calculators under review
- `docs/JCO 2025 Genomics.pdf` - Genomics paper reference
- `docs/avet-loiseau-et-al-2025-international-myeloma-society-international-myeloma-working-group-consensus-recommendations-on.pdf` - IMS/IMWG consensus reference
