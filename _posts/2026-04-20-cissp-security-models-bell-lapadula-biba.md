---
layout: post
title: "CISSP #41: Security Models — Bell-LaPadula, Biba, and the Logic Behind Access Rules"
date: 2026-04-20 14:30:00 +0000
categories: [CISSP, Security Architecture, Access Control]
tags: [CISSP, Bell-LaPadula, Biba, Clark-Wilson, Security Models, Domain 3]
excerpt: "Security models give formal structure to access control policy. Bell-LaPadula, Biba, and Clark-Wilson each solve a different problem — and the CISSP exam expects you to know which one applies where."
image: /assets/generated/2026/04/cissp-security-models-bell-lapadula-biba/hero.svg
---

<img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-models-bell-lapadula-biba/hero.svg" alt="CISSP #41 Security Models — Bell-LaPadula, Biba, and the Logic Behind Access Rules" class="blog-hero" />

There is a section of the CISSP exam that trips up engineers more than almost anything else in Domain 3: formal security models.

The names are memorable. The rules are easy to look up. But the exam does not test the rules — it tests your ability to reason about _why_ they exist and _which one fits a given scenario_. That requires understanding what problem each model was designed to solve.

## Why Formal Models Exist

Before there were security models, access control was ad hoc. Administrators granted permissions, policies were written in natural language, and there was no formal way to prove that a system could or could not leak sensitive data under a given set of rules.

Formal security models emerged from government and military research in the 1970s and 1980s. The goal was to provide a mathematical framework for reasoning about information flow and access control — something that could be verified, not just described.

These models are abstract. They do not describe code or product architecture. They describe _properties that a secure system must maintain_. Understanding them lets you evaluate whether a real system's access policy is sound.

## Bell-LaPadula: Protecting Confidentiality

Bell-LaPadula (BLP) is the oldest and most exam-prominent model. It was developed at MITRE in the 1970s under a U.S. Air Force contract, and it was designed to enforce multilevel security — the classification system used in government and military environments.

The model operates on a simple premise: **confidentiality is the primary concern**. Data has classification levels (Unclassified, Confidential, Secret, Top Secret). Subjects (users, processes) have clearance levels. The model defines two key rules:

**Simple Security Property (No Read Up)**
A subject cannot read data at a higher classification level than their clearance. A Secret-cleared user cannot read Top Secret data.

**Star Property (No Write Down)**
A subject cannot write data to a lower classification level than their current working level. A Top Secret user cannot write notes into an Unclassified document. This prevents declassification through the back door.

There is also a Discretionary Security Property — access must also be permitted by an access control matrix — but the two rules above are what the exam focuses on.

The memory aid is clean: **BLP = No Read Up, No Write Down**. Confidentiality goes in one direction.

### What Bell-LaPadula Does Not Protect

BLP was designed for confidentiality. It says nothing about integrity. A Top Secret user under BLP can corrupt or modify Top Secret data freely, as long as they do not write it down. That was considered acceptable for the original threat model — the concern was information leakage upward in classification, not internal corruption.

That gap is exactly what the next model addresses.

<img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-models-bell-lapadula-biba/inline-1.svg" alt="Bell-LaPadula vs Biba: confidentiality and integrity rules compared" class="blog-inline" />

## Biba: Protecting Integrity

The Biba model inverts Bell-LaPadula. Instead of classification levels, it uses integrity levels. Instead of protecting confidentiality, it protects data integrity — ensuring that high-integrity data is not corrupted by low-integrity sources.

**Simple Integrity Property (No Read Down)**
A subject cannot read data at a lower integrity level than their own. A high-integrity process should not ingest data from a low-integrity source that could corrupt its outputs.

**Star Integrity Property (No Write Up)**
A subject cannot write to a higher integrity level than their own. A low-integrity process cannot modify high-integrity data.

The memory aid: **Biba = No Read Down, No Write Up**. Integrity flows in one direction.

Think of it in software terms: a background job that reads unvalidated external input is a low-integrity source. Biba says that job should not be able to write directly to the authoritative transaction database. If it does, you cannot trust the integrity of that database.

### BLP and Biba Together

The two models are complementary and intentionally designed to work in opposite directions:

| Property          | Bell-LaPadula (Confidentiality) | Biba (Integrity) |
| ----------------- | ------------------------------- | ---------------- |
| Read restriction  | No Read Up                      | No Read Down     |
| Write restriction | No Write Down                   | No Write Up      |
| Primary concern   | Information leakage             | Data corruption  |

In practice, most real systems need both. Military systems implemented BLP for classification. Financial and healthcare systems are more naturally modeled with Biba — where authoritative records must not be corrupted by untrusted inputs.

## Clark-Wilson: Integrity Through Process

Clark-Wilson (1987) was developed specifically for commercial environments where Biba's mathematical formalism was too rigid. It focuses on integrity too, but it takes a different approach — integrity through _controlled processes_, not just access rules.

Two key concepts:

**Constrained Data Items (CDIs)**: data whose integrity must be protected — a transaction record, a financial balance, an audit log.

**Unconstrained Data Items (UDIs)**: data not yet in a protected state — raw input coming from an external source.

**Transformation Procedures (TPs)**: the only allowed operations on CDIs. TPs are formally validated procedures that ensure CDIs remain in a consistent, valid state after modification.

**Integrity Verification Procedures (IVPs)**: procedures that verify CDIs are in a valid state.

The model also enforces **separation of duties** — no single subject can perform a complete sensitive transaction alone. This directly mirrors real-world requirements in financial systems (the four-eyes principle, dual approval for transfers) and healthcare (prescribing and dispensing roles are separated).

Clark-Wilson is the model that software engineers working in regulated industries are most likely to recognize instinctively, even without knowing the name. If your system has: validated inputs, controlled write paths, transaction logs, and role-based access to operations — you are implementing Clark-Wilson concepts.

## Brewer-Nash: The Chinese Wall

One additional model appears on the CISSP exam: **Brewer-Nash**, commonly called the Chinese Wall model. It was published in 1989 and designed for consulting and financial advisory environments where conflicts of interest must be prevented.

The rule: a subject who has accessed data belonging to one company (or competitive class) cannot subsequently access data belonging to a competitor in the same class.

Example: a consultant who reads confidential financial data from Company A cannot later access data from Company B if they are direct competitors. The "wall" grows dynamically as access occurs.

This model is less about classification levels and more about dynamic conflict-of-interest tracking. It maps directly to legal and regulatory requirements in investment banking (information barriers, firewall compliance), consulting, and legal practice.

## What the CISSP Exam Actually Tests

The exam rarely asks you to recite the rules from memory. It presents scenarios and expects you to identify which model applies or which model is being violated.

Common exam patterns:

- **A process at a high classification level writes data to a low-classification file.** → Bell-LaPadula violation (Star Property / No Write Down).
- **A low-integrity external feed is writing directly to a production database.** → Biba violation (Star Integrity / No Write Up).
- **A financial system requires dual approval for large transactions and validates all input before committing.** → Clark-Wilson concepts (TPs, separation of duties).
- **An analyst who worked on a merger deal is now handling a competing firm's data.** → Brewer-Nash / Chinese Wall concern.
- **A user with Top Secret clearance reads Unclassified data.** → This is NOT a BLP violation. BLP allows reading _down_. The exam will test this.

That last one is a common trap. Bell-LaPadula prevents reading _up_, not down. Reading down is allowed by design — the concern is leakage of classified information, not what you do with unclassified data.

<img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-models-bell-lapadula-biba/inline-2.svg" alt="Security model selection guide: which model addresses which concern" class="blog-inline" />

## The Engineering Relevance

These models are not just exam content. Software engineers who understand them build better-designed access control systems.

A few practical connections:

**BLP thinking** shows up in data handling systems where you need to ensure that classified or sensitive data cannot be exported, desensitized, or written to lower-trust stores without a deliberate, audited process. If you work on data pipelines handling sensitive personal or financial records, you are dealing with the same problem BLP formalized.

**Biba thinking** applies anywhere you need to protect the integrity of authoritative data. APIs that accept external input and write to core records should have a formal validation and transformation step before ingestion — exactly what Biba's model requires.

**Clark-Wilson thinking** matches naturally to systems with formal workflows, especially in regulated industries: all modifications go through validated transaction procedures, separation of duties for sensitive operations, and IVPs to confirm state validity. If you have built healthcare, finance, or compliance software, you have almost certainly implemented Clark-Wilson concepts without the label.

The models give you vocabulary and reasoning frameworks. When you can say "this design has a Biba violation because untrusted input can write directly to a high-integrity record," you are communicating with precision rather than intuition.

---

Security architecture questions are some of the harder ones on the CISSP exam because they reward genuine understanding over memorization. The models are abstract by design — the point is to learn how to reason about trust, information flow, and access rules, not to memorize four bullet points.

Once you understand what each model is protecting and why, the scenarios become much more approachable.

_This post is part of an ongoing CISSP study series. If you are working through the domains, the earlier posts on least privilege, defense in depth, and secure design principles pair well with this one._

---

**Meta description:** A practical CISSP guide to formal security models — Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash. Understand what each model protects, the core access rules, and how the exam tests them.

**SEO keywords:** CISSP security models Bell-LaPadula Biba, Bell-LaPadula no read up no write down, Biba integrity model CISSP, Clark-Wilson model, CISSP Domain 3 formal security models
