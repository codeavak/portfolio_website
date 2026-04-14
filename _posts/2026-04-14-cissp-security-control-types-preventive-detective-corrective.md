---
layout: post
title: "CISSP #29: Security Control Types — Preventive, Detective, and Corrective in Practice"
date: 2026-04-14 12:00:00 +0000
categories: [security, cissp]
tags:
  [
    cissp,
    domain-1,
    domain-3,
    security-controls,
    preventive,
    detective,
    corrective,
    defense-in-depth,
    risk-management,
  ]
excerpt: "Security controls are not just technical tools—they are the backbone of risk management. Understanding preventive, detective, and corrective controls (and their real-world overlap) is essential for CISSP success and practical security leadership."
image: /assets/generated/2026/04/cissp-security-control-types-preventive-detective-corrective/hero.svg
---

Security controls are the backbone of every security program, but they are also one of the most misunderstood topics in CISSP and in real organizations.

Most engineers and managers can name a few controls—firewalls, access reviews, backups—but fewer can explain why controls are grouped into types, how those types interact, and why the distinction matters for both exam questions and real-world risk reduction.

This post breaks down the classic control types—preventive, detective, corrective (plus deterrent and compensating)—with practical examples, exam mindset tips, and guidance for applying them in layered security architectures.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-control-types-preventive-detective-corrective/hero.svg" alt="Layered diagram showing preventive, detective, and corrective controls as concentric rings around business assets.">
  <figcaption>Security controls work best in layers. Each type addresses a different stage of risk.</figcaption>
</figure>

## Why control types matter (for CISSP and for real risk)

CISSP exam questions love to test your understanding of control types—not just definitions, but how to apply them in context. In practice, knowing the difference helps you design defenses that do more than just check a compliance box.

- **Preventive controls** try to stop incidents before they happen.
- **Detective controls** identify and alert when something goes wrong.
- **Corrective controls** restore normal operations after an incident.
- **Deterrent controls** discourage unwanted actions (often psychological or policy-based).
- **Compensating controls** fill gaps when primary controls are impractical.

The exam will often ask: "Which control is best in this scenario?" The right answer depends on the risk, the business context, and what other controls are already in place.

## The classic trio: Preventive, Detective, Corrective

### Preventive controls

These are your first line of defense. Their job is to block threats before damage occurs.

**Examples:**

- Firewalls (block unauthorized network traffic)
- Access control lists (restrict who can access what)
- Security awareness training (reduce risky behavior)
- Physical locks and badge readers
- Encryption (prevents data disclosure if stolen)

**Exam tip:** Preventive controls are proactive. They do not wait for an incident—they try to make it impossible or much harder.

### Detective controls

These controls do not stop incidents, but they tell you when something has happened (or is happening).

**Examples:**

- Intrusion detection systems (IDS)
- Security event logging and monitoring
- CCTV cameras
- File integrity monitoring
- Audit trails

**Exam tip:** Detective controls are about visibility. They are essential for incident response, compliance, and continuous improvement.

### Corrective controls

These controls help you recover from an incident and restore normal operations.

**Examples:**

- Backups and restore procedures
- Incident response plans
- Patch management (after a vulnerability is exploited)
- Removing malware from infected systems
- Updating firewall rules after a breach

**Exam tip:** Corrective controls are about minimizing impact and learning from incidents. They often work hand-in-hand with detective controls.

## Beyond the basics: Deterrent and Compensating controls

### Deterrent controls

These controls discourage attackers or insiders from attempting unwanted actions, often by increasing the perceived risk of detection or punishment.

**Examples:**

- Warning signs ("Area under surveillance")
- Security policies with clear consequences
- Visible security guards
- Legal agreements and NDAs

### Compensating controls

When a primary control is not feasible (due to cost, legacy systems, or business constraints), compensating controls provide an alternative way to reduce risk.

**Examples:**

- Increased monitoring when strong authentication is not possible
- Manual reviews when automated controls are lacking
- Segmentation to limit exposure when full encryption is impractical

## How control types interact in layered security

No single control is perfect. Real security comes from layering different types so that the failure of one does not mean total compromise.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-control-types-preventive-detective-corrective/inline1.svg" alt="Matrix mapping common controls to their types: firewall (preventive), IDS (detective), backup (corrective), etc.">
  <figcaption>Most real-world controls serve more than one purpose. Layering is what makes them effective.</figcaption>
</figure>

**Example scenario:**

- Preventive: A firewall blocks most attacks.
- Detective: An IDS alerts when suspicious traffic is detected.
- Corrective: An incident response plan guides containment and recovery.
- Deterrent: Security policy and visible monitoring discourage insider threats.
- Compensating: Manual log reviews fill gaps when automated alerting is not available.

## Exam mindset: Best-answer thinking

CISSP questions often present scenarios where multiple controls could apply. The "best" answer is usually the one that:

- Addresses the risk most directly
- Fits the business context
- Complements existing controls
- Follows the principle of defense in depth

**Watch for traps:** Sometimes a control can be both preventive and detective (e.g., security cameras). The exam may want you to pick the primary function in the scenario.

## Practical tips for engineers and leaders

- Always ask: What is this control actually doing? Is it stopping, detecting, correcting, deterring, or compensating?
- Map your controls to types to identify gaps and overlaps.
- Use layered controls to reduce reliance on any single safeguard.
- Document compensating controls clearly for audits and risk acceptance.
- Review and update controls as threats and business needs evolve.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-security-control-types-preventive-detective-corrective/inline2.svg" alt="Flowchart showing preventive, detective, and corrective controls in the lifecycle of a security incident.">
  <figcaption>Controls work together: prevention blocks, detection alerts, correction restores.</figcaption>
</figure>

## Subtle CTA

If you are preparing for CISSP or building a security program, take time to map your controls by type. It is one of the fastest ways to spot weaknesses and improve your defense-in-depth strategy.

---

**Meta description:**
A practical CISSP guide to security control types—preventive, detective, corrective, deterrent, and compensating—with real-world examples, exam tips, and advice for building layered defenses.

**SEO keyword ideas:**

- security control types
- preventive detective corrective controls
- CISSP control classification
- defense in depth
- compensating controls
