---
layout: post
title: "CISSP #51: Secure SDLC — Security Belongs in Every Phase, Not Just Testing"
date: 2026-05-04 12:00:00 +0000
categories: [CISSP, Software Development Security, Secure SDLC]
tags:
  [
    CISSP,
    Secure SDLC,
    Software Development Security,
    SAST,
    DAST,
    DevSecOps,
    Domain 8,
    Software Assurance,
  ]
excerpt: "Most teams treat security as a testing-phase concern. CISSP Domain 8 has a different view: secure software is engineered from requirements onward. This guide walks every SDLC phase and shows what security work belongs at each one."
image: /assets/generated/2026/05/cissp-secure-sdlc-security-every-phase/hero.svg
---

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-secure-sdlc-security-every-phase/hero.svg" alt="CISSP #51 Secure SDLC: Security at every phase from requirements through maintenance" class="blog-hero" />

Developers do not intend to ship vulnerabilities. They intend to ship features. Security enters the picture later — often much later — when a test team runs a scan, a penetration tester finds an injection flaw, or a customer's security team sends an uncomfortable questionnaire.

The Secure Software Development Lifecycle exists to change that structural problem. From the CISSP perspective, this is Domain 8 territory: Software Development Security. The core idea is straightforward. Security requirements, reviews, and controls belong in every phase of development — not as a final checkpoint that gates release.

If you have followed this series through privacy by design, threat modeling, and defense in depth, the Secure SDLC is where those concepts land inside a working development process.

## What Domain 8 Expects You to Reason About

The CISSP exam is not asking you to recite a tool list. Domain 8 tests your ability to think about security at the organizational and process level. Where does security get embedded in the development lifecycle? Who owns it at each phase? What controls exist, and what happens when they are absent?

You need to understand:

- How security requirements connect to business risk
- Why testing alone does not produce secure software
- What controls belong at design, implementation, testing, and deployment
- How software assurance differs from a penetration test
- What maturity looks like versus just running a scanner

The exam mindset: secure software is engineered from requirements onward, not inspected into existence at the end.

## Phase 1: Requirements

Security that is not required is optional. That is the practical problem with skipping security at requirements time.

Functional requirements define what the system must do. Security requirements define what the system must not allow. Both belong in the same document, reviewed by the same stakeholders, before a single line of code is written.

This means identifying data sensitivity early — what personal, financial, or operational data will this system handle? Classification at requirements time drives protection requirements throughout the lifecycle. It also means writing abuse cases alongside use cases. A login use case has a corresponding brute-force abuse case. An API endpoint has a corresponding parameter manipulation case. Regulatory and compliance requirements — GDPR, HIPAA, PCI-DSS — do not emerge during testing. They are constraints from day one.

A security requirement captured at this phase costs a conversation. The same requirement discovered during a production penetration test can cost weeks of rework, customer communication, and potential regulatory attention.

## Phase 2: Design

Design is where security architecture becomes concrete.

This is the phase for threat modeling. The questions here are structural: what are the trust boundaries, where is authentication enforced, how are sensitive data flows isolated, what does the attack surface look like? Design-phase security work surfaces issues while they are still architectural decisions rather than code changes.

Key design-phase controls include trust boundary analysis — which components trust which other components, and on what basis — and privilege minimization: does every component request only the access it actually needs? Secure defaults also belong here. Are error states, unconfigured states, and edge cases fail-safe? What does the system do when a dependency is unavailable?

Dependency choices made at design time — frameworks, libraries, external APIs — carry their own risk surfaces. Those choices are cheaper to revisit before implementation begins than after a product is in production.

## Phase 3: Implementation

This is where most developers spend most of their time, and where many vulnerabilities are introduced.

Secure coding is not a style preference. It is the application of well-established knowledge about how software fails under adversarial conditions. OWASP maintains the most widely referenced taxonomy of web application vulnerabilities. Language-specific secure coding standards exist for C, C++, Java, .NET, Python, and others. Developers who understand common failure patterns write substantially different code than those who do not.

Beyond developer knowledge, implementation-phase security controls include:

**Static Application Security Testing (SAST)** runs against source code without executing the application. It catches common patterns — injection sinks, hardcoded credentials, dangerous API usage, missing input validation. SAST can run in a local development environment or as a CI/CD pipeline gate. It produces false positives and requires tuning, but the feedback loop is fast enough to be useful during active development.

**Software Composition Analysis (SCA)** examines third-party dependencies for known vulnerabilities. When a developer adds a library, that library brings its entire dependency tree into the application. SCA tools cross-reference those dependencies against public vulnerability databases. This matters more than it once did: software supply chain attacks have made the dependency layer a primary attack vector, and a secure application can ship compromised components without any developer writing a vulnerable line.

**Code review** is a control, not just a quality activity. A peer reviewer with a security lens catches logic flaws, authorization gaps, and subtle trust assumptions that automated tools miss. It is also where separation of duties begins in development — the person who writes the code should not be the only person who reviews it.

## Phase 4: Testing

Testing is where many organizations first encounter security — which is already late, but far better than finding vulnerabilities in production.

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-secure-sdlc-security-every-phase/inline-1.svg" alt="Chart showing relative cost to fix security defects grows significantly in later SDLC phases" class="blog-inline" />

**Dynamic Application Security Testing (DAST)** runs against a live application and exercises it like an attacker would. It finds vulnerabilities that require execution to surface — misconfigurations, authentication bypass issues, runtime injection points. DAST does not require access to source code, which makes it applicable to third-party and black-box components.

**Penetration testing** is a deeper, human-driven evaluation. A skilled tester explores the application and infrastructure for chains of vulnerabilities that automated tools miss — logical access control flaws, business logic abuse, privilege escalation paths. This is not a replacement for SAST and DAST; it is a complement that exercises judgment where tools cannot.

**Security regression testing** ensures that previously fixed vulnerabilities do not return as the codebase evolves. It belongs in the test suite alongside functional regression tests, treated as a permanent quality baseline rather than a one-time audit artifact.

The exam distinguishes clearly between these types of testing. Knowing which technique is suited to which class of problem — and what each cannot find — is Domain 8 fundamentals.

## Phase 5: Deployment

A secure application can be deployed insecurely. Deployment is where security controls are often overlooked because the focus has shifted to availability and configuration correctness.

**Secure configuration management** applies at deployment time. Default credentials must be changed, unnecessary services disabled, and hardening applied. For many platforms, Center for Internet Security benchmarks provide a practical starting point.

**Secrets management** is a deployment-phase control with implementation roots. API keys, database passwords, and certificates must not live in source code, configuration files checked into version control, or environment variables visible to unauthorized parties. A dedicated secrets management service handles rotation and access control outside the application's codebase.

**Infrastructure as code scanning** applies when infrastructure is defined programmatically. If a Terraform or CloudFormation template misconfigures a storage bucket or network rule, that misconfiguration can be caught before deployment rather than after.

**Deployment approval controls** bring separation of duties to operations. The developer who writes code should not have unilateral authority to deploy it to production. A second set of eyes — automated, human, or both — is a control, not bureaucracy.

## Phase 6: Operations and Maintenance

Secure SDLC does not end at deployment. Software runs in an environment that changes, and vulnerabilities are discovered in components that were considered secure when originally assessed.

Maintenance-phase security includes monitoring for newly disclosed CVEs affecting dependencies and platform components, risk-based patch prioritization, application-level security monitoring integrated with broader detection infrastructure, and explicit end-of-life planning. Software components and platforms reach end of support. Continuing to run unsupported components is a risk decision that must be made explicitly, not by organizational inertia.

From a CISSP perspective, operations-phase security closes the loop. The lifecycle is not a waterfall ending at deployment — it is continuous.

## Shift Left: The Principle and Its Limits

"Shift left" is the principle that security activities should move earlier in the SDLC, toward the left side of a development timeline. The directional logic is sound: remediating a security defect gets progressively more expensive the later it is discovered. A requirements-phase issue is a conversation. A production-phase issue involves incident response, customer notification, and in some cases regulatory scrutiny.

Shift left does not mean handing all security responsibility to developers and eliminating security teams. It means security expertise must be available at every phase, automated controls must provide fast feedback where possible, and developers must have the tools and knowledge to avoid common mistakes. Security teams shift their focus toward building those capabilities rather than being the sole reviewers at the end.

The exam tests whether you understand this tradeoff. Security shifted left is more cost-effective. Security concentrated only at testing or production is reactive.

## Exam Mindset vs. Real Practice

The CISSP exam frequently models the SDLC in a sequential, idealized form. Real development is messier. Agile sprints collapse phases. Continuous deployment means code moves to production multiple times a day. Some teams have no formal SDLC at all.

The underlying principles apply regardless of methodology. In Agile development, security requirements belong in the backlog and sprint planning. Threat modeling happens at architecture boundaries and when significant features change. SAST runs on every pull request. Penetration tests happen on regular release cycles aligned to risk.

The exam also consistently tests whether you recognize that security cannot be retrofitted cheaply. This is a thread that runs through multiple domains: defense in depth, privacy by design, secure design principles, and secure SDLC are all expressions of the same idea — build in, do not bolt on.

## Software Assurance as an Outcome

Software assurance is the goal underneath all of this: building justified confidence that software behaves as intended and nothing else. It is not a tool you buy or a checklist you complete. It emerges from how systematically security is integrated into process and culture across every phase.

Organizations with mature software assurance programs find fewer vulnerabilities in production, respond more efficiently when vulnerabilities are reported, and operate with a clearer picture of their own risk. They have processes for each phase rather than heroes who fix things at the end.

From a CISSP perspective, that is what Domain 8 is pointing toward. Not the names of tools. The structure of a process that produces trustworthy software by design.

---

*Part of an ongoing CISSP study series. If Secure SDLC connects to your current work, a useful exercise is auditing your own pipeline: where are the security gates, and where are the gaps?*

---

**Meta description:** Secure SDLC integrates security requirements, code review, static and dynamic analysis, and deployment controls into every development phase. This CISSP Domain 8 guide explains what security work belongs at each stage and why testing alone is never enough.

**SEO keyword ideas:**
1. Secure software development lifecycle CISSP
2. CISSP Domain 8 software development security
3. SAST DAST software security testing
4. shift left security development
5. software assurance secure SDLC
