# Content Package: CISSP #41 — Security Models — Bell-LaPadula, Biba, and the Logic Behind Access Rules

**Date:** 2026-04-20
**Slug:** cissp-security-models-bell-lapadula-biba
**Post file:** `_posts/2026-04-20-cissp-security-models-bell-lapadula-biba.md`

---

## 1. Positioning Summary

**Topic:** Formal security models — Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash — and how to reason about them on the CISSP exam and in real systems.

**Why this topic:** Security models are one of the hardest CISSP Domain 3 areas for engineers because they look like memorization tasks but are actually reasoning tasks. This post teaches the models through their _purpose_, making the exam scenarios approachable and giving engineers vocabulary they can apply to real access control design.

**Target audience:** CISSP candidates, software engineers moving toward security, security architects, hiring managers evaluating depth in Domain 3.

**Brand alignment:** Demonstrates strong security architecture fundamentals. Shows the ability to reason formally about access control — a credibility marker for security-focused roles.

---

## 2. Research Summary

**Bell-LaPadula:**

- Developed at MITRE in the early 1970s by David Bell and Leonard LaPadula under a U.S. Air Force contract.
- Purpose: enforce multilevel security (MLS) for classified government/military environments.
- Simple Security Property: No Read Up. Star Property: No Write Down.
- Discretionary Security Property: access also requires explicit permission in access matrix.
- Limitation: models confidentiality only; says nothing about integrity.

**Biba:**

- Developed by Kenneth Biba at MITRE in 1977.
- Purpose: address the integrity gap left by Bell-LaPadula.
- Simple Integrity Property: No Read Down. Star Integrity Property: No Write Up.
- More naturally maps to commercial/financial environments where data corruption is the primary concern.

**Clark-Wilson:**

- Developed by David Clark and David Wilson in 1987.
- Purpose: commercial integrity — enforcement through controlled procedures rather than formal levels.
- Key concepts: CDIs (protected data), UDIs (unvalidated input), TPs (validated transformation procedures), IVPs (integrity verification procedures).
- Enforces separation of duties; no subject completes sensitive transaction alone.
- Natural fit for financial, healthcare, compliance systems.

**Brewer-Nash (Chinese Wall):**

- Published 1989 by Brewer and Nash.
- Purpose: dynamic conflict-of-interest prevention.
- Access to a competitor's data is blocked after accessing data from one company in the same competitive class.
- Maps to financial services information barriers, consulting ethics, legal firewalls.

**CISSP exam context:**

- Primary domain: Domain 3 — Security Architecture and Engineering.
- Exam tests scenario-based application of rules, not memorization alone.
- Common trap: reading _down_ under BLP is not a violation. The model blocks reading _up_.

---

## 3. Detailed Blog Post

_(See `_posts/2026-04-20-cissp-security-models-bell-lapadula-biba.md`)_

---

## 4. LinkedIn Post

---

The CISSP exam has a reputation for testing security models in a way that surprises engineers.

Bell-LaPadula. Biba. Clark-Wilson.

Most people memorize the rules. The exam tests whether you understand which rule applies to which scenario — and why.

Here is the mental frame that makes it click:

**Bell-LaPadula** solves confidentiality. No Read Up. No Write Down. Built for military classification systems. The concern is preventing classified data from flowing to lower-classification destinations.

**Biba** solves integrity. No Read Down. No Write Up. The concern is preventing high-integrity data from being corrupted by low-integrity sources. If your untrusted external feed can write directly to a production database — that is a Biba violation.

**Clark-Wilson** solves commercial integrity. Not through formal levels, but through controlled processes. All modifications go through validated procedures. Separation of duties applies. This is the model behind financial dual-approval workflows and healthcare dispensing controls — most engineers have implemented it without knowing the name.

**Brewer-Nash** solves conflict of interest. Once you access data from one company, the wall goes up. You cannot access a competitor's data. This is the formal model behind investment bank information barriers.

The models are abstract by design. Once you understand what each one is protecting, the exam scenarios become much more approachable — and the real-system applications become obvious.

Post 41 in the CISSP series. Links to the full post in the comments.

What security model concepts have you actually applied in production systems?

#CISSP #SecurityArchitecture #InformationSecurity #CyberSecurity #SoftwareEngineering

---

## 5. Extra Content Assets

### Image prompts

**Hero image** (`hero.svg`):

> A clean dark-background technical illustration showing four labeled security model cards arranged in a 2x2 grid. Top left: "Bell-LaPadula" with a downward-facing lock icon and the text "Confidentiality." Top right: "Biba" with an upward-facing shield icon and the text "Integrity." Bottom left: "Clark-Wilson" with a process/flow icon and the text "Commercial Integrity." Bottom right: "Brewer-Nash" with a wall/barrier icon and the text "Conflict of Interest." Color palette: navy, blue, white. Minimal and professional, no clutter.

**Inline image 1** (`inline-1.svg`):

> A side-by-side comparison diagram. Left side labeled "Bell-LaPadula (Confidentiality)": shows three classification tiers (Top Secret, Secret, Unclassified) with a green arrow allowing read DOWN and a red blocked arrow on read UP, and a red blocked arrow on write DOWN. Right side labeled "Biba (Integrity)": same three-tier structure labeled High/Medium/Low Integrity, with green arrow allowing write DOWN and red blocked arrows on read DOWN and write UP. Clean, minimal, dark navy background with blue/red arrows.

**Inline image 2** (`inline-2.svg`):

> A decision-tree style diagram titled "Which Security Model Applies?" with four branches: "Confidentiality / classification concern" → Bell-LaPadula; "Integrity / corruption concern (formal levels)" → Biba; "Integrity via controlled processes / separation of duties" → Clark-Wilson; "Conflict of interest / competing entities" → Brewer-Nash. Dark navy background, clean sans-serif type, blue connecting lines.

### SEO and metadata

**Meta description:** A practical CISSP guide to formal security models — Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash. Understand what each model protects, the core access rules, and how the exam tests them.

**SEO keywords:**

1. CISSP security models Bell-LaPadula Biba
2. Bell-LaPadula no read up no write down
3. Biba integrity model CISSP
4. Clark-Wilson model separation of duties
5. CISSP Domain 3 formal security models
