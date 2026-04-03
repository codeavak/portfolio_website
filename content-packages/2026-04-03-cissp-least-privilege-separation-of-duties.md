# Content Package — CISSP Post 4/60: Least Privilege Is Easy to Praise and Hard to Practice

**Post:** `_posts/2026-04-03-cissp-least-privilege-separation-of-duties.md`
**Published:** 2026-04-03
**Series:** CISSP 60-post study series

---

## 1. Positioning summary

This post continues the CISSP series with a high-value access control topic that resonates with both exam candidates and working engineers: least privilege, need to know, and separation of duties.

The positioning is practical rather than academic. The article frames these concepts as operational disciplines that reduce blast radius, fraud risk, and avoidable exposure in real systems. It is meant to be useful for software engineers moving toward security, early security professionals, and CISSP candidates who want the concepts to stick beyond memorization.

Tone: calm, credible, reflective, and practical. The post avoids bootcamp-style flashcard energy and instead signals mature judgment to recruiters, hiring managers, and security leaders.

---

## 2. Research summary

**Established CISSP-aligned principles used:**
- Least privilege grants only the minimum access necessary to perform a job or system function
- Need to know limits access to information based on a legitimate business requirement
- Separation of duties reduces fraud, abuse, and error by splitting sensitive actions across people or roles
- Privileged access should be approved, controlled, and reviewed rather than granted broadly by default
- Access control is not only a technical issue; it is also a governance and accountability issue

**Current credible references informing the framing:**
- **NIST SP 800-207 (Zero Trust Architecture)** describes the shift from static, perimeter-based trust assumptions toward decisions focused on users, assets, and resources
- **NIST SP 800-53 Rev. 5** continues to treat access control as a foundational security control family across systems and organizations
- **NIST CSF 2.0** reinforces the integration of cybersecurity risk, governance, and operational discipline rather than treating access control as a siloed technical setting

**Freshness note:**
The underlying principles in this post are stable and long-established. What feels more current in 2026 is the implementation layer: cloud IAM sprawl, machine identities, just-in-time privilege, conditional access, and zero-trust-oriented policy decisions. The post distinguishes those newer operating patterns from the older principles they build on.

---

## 3. Detailed blog post

Least privilege is one of those security ideas that nobody argues with in theory. Of course people should only have the access they need. Of course admin rights should be restricted. Of course no single person should be able to request, approve, and execute every sensitive action alone.

Then real systems show up.

Legacy applications need broad service accounts. Deadlines create "temporary" exceptions that never get cleaned up. Managers want fewer approval steps. Engineers inherit group memberships that made sense two roles ago. Before long, the organization still *talks* about least privilege while running on accumulated convenience.

That tension is exactly why this topic matters for CISSP and for real security work.

### Least privilege is not about distrust

Least privilege is not a statement about whether employees are trustworthy. It is a statement about how organizations reduce risk when people make mistakes, accounts get phished, malware runs with inherited permissions, and exceptions live longer than intended.

If an account has more power than it actually needs, every one of those failure modes becomes more expensive.

### Three concepts people keep blending together

**Least privilege** means a subject gets only the permissions necessary to perform assigned tasks.

**Need to know** is narrower and focuses on information access. A person may be authorized broadly but should still only access the specific information required for a legitimate business purpose.

**Separation of duties** prevents one person from controlling a sensitive workflow alone. It is about reducing fraud, abuse, and accidental harm through deliberate process design.

### Why organizations still get this wrong

The patterns are familiar:
- permission creep after role changes
- standing privilege left in place for convenience
- weak ownership of access reviews
- overpowered service accounts and machine identities

The exam version is clean. Real life is messy. But the root lesson holds: excessive privilege increases blast radius.

### A realistic scenario

A platform engineer gets broad cloud admin rights to resolve a Friday production incident. The work finishes, but the access stays. Months later, that engineer's account is compromised through phishing. The attacker inherits the standing privilege and can create new identities, weaken logging, access secrets, and interfere with investigation.

That is not just a phishing problem. It is a privilege-governance problem.

A stronger design would time-box the access, require approval for activation, log high-risk actions, and use a separate admin identity instead of leaving broad privilege attached to a daily-use account.

### What the CISSP exam is really testing

CISSP usually wants the answer that:
- reduces access to the minimum necessary level
- assigns approval to the right authority
- prevents one person from controlling a critical process end to end
- favors accountability and auditability over raw convenience

This is why separation of duties, proper ownership, and least privilege show up so often in better-answer patterns.

### Established principles vs recent developments

The durable principles are unchanged: least privilege, need to know, separation of duties, and accountable approvals.

The more current shift is in implementation. NIST SP 800-207 frames zero trust as moving away from static network trust assumptions and toward decisions centered on users, assets, and resources. In practice, that shows up through just-in-time privilege, contextual access decisions, shorter-lived sessions, and better entitlement review.

Those are modern ways to implement old security discipline. Zero trust does not replace least privilege. It depends on it.

### The core takeaway

If you are studying for CISSP, do not memorize least privilege as a slogan. Turn it into a recurring design question:

**Who really needs this access, for how long, under what approval, and what happens if that account is compromised?**

That question improves both exam judgment and real security work.

---

*Post 4 of 60 in my CISSP study series.*

---

## 4. LinkedIn post

I’m continuing my CISSP study series, and one topic that keeps sounding simple until you apply it is **least privilege**.

Most teams agree with it in theory.
Far fewer run it well in practice.

What breaks it?
- "temporary" access that never gets removed
- broad admin roles left in place for convenience
- weak ownership of access reviews
- no real separation of duties in sensitive workflows

That is why least privilege is more than an IAM checkbox.
It is a way to reduce blast radius when normal failures happen:
- phishing
- mistakes
- stale entitlements
- overpowered service accounts

One thing CISSP gets right here: the best answer is usually the one that reduces unnecessary power *without* breaking the business.

I wrote the next post in the series on how least privilege, need to know, and separation of duties actually fit together in real systems.

Which access-control failure do you see most often in the wild: stale privilege, weak reviews, or overly broad emergency access?

#CISSP #Cybersecurity #AccessControl #ZeroTrust #SecurityLeadership

---

## 5. Extra content assets

**Hero image:** `assets/generated/2026/04/cissp-least-privilege-separation-of-duties/hero.svg`
- Dark-theme visual linking least privilege, need to know, and separation of duties to reduced blast radius and accountability
- Purpose: make the post feel practical and structured at a glance

**Inline image 1:** `assets/generated/2026/04/cissp-least-privilege-separation-of-duties/access-control-model.svg`
- Three-column comparison of least privilege, need to know, and separation of duties
- Purpose: help readers separate concepts that are often blurred together

**Inline image 2:** `assets/generated/2026/04/cissp-least-privilege-separation-of-duties/privilege-review-cycle.svg`
- Lifecycle diagram showing request, approval, time-boxing, logging, recertification, and removal
- Purpose: reinforce that least privilege is an ongoing operating discipline, not a one-time setting
