---
layout: post
title: "CISSP #5: Least Privilege Is Easy to Praise and Hard to Practice"
date: 2026-04-03 12:05:00 +0000
categories: [security, cissp]
tags:
  [
    cissp,
    domain-5,
    access-control,
    least-privilege,
    separation-of-duties,
    zero-trust,
  ]
excerpt: "Least privilege sounds obvious until it collides with deadlines, legacy access, and cloud sprawl. This CISSP-focused guide explains how least privilege, need to know, and separation of duties actually work in real organizations. Post 5 of 60 in my CISSP study series."
image: /assets/generated/2026/04/cissp-least-privilege-separation-of-duties/hero.svg
---

Least privilege is one of those security ideas that nobody argues with in theory. Of course people should only have the access they need. Of course admin rights should be restricted. Of course no single person should be able to request, approve, and execute every sensitive action alone.

Then real systems show up.

Legacy applications need broad service accounts. Deadlines create "temporary" exceptions that never get cleaned up. Managers want fewer approval steps. Engineers inherit group memberships that made sense two roles ago. Before long, the organization still _talks_ about least privilege while running on accumulated convenience.

That tension is exactly why this topic matters for CISSP and for real security work.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-least-privilege-separation-of-duties/hero.svg" alt="Diagram showing least privilege, need to know, and separation of duties reducing blast radius and improving accountability.">
  <figcaption>Least privilege is not one control. It is a discipline that limits blast radius, mistakes, and silent abuse.</figcaption>
</figure>

## Least privilege is not about distrust

A lot of teams treat least privilege as if it were a cultural insult: _"Do you not trust your people?"_ That framing misses the point.

Least privilege is not a statement about whether employees are good or bad. It is a statement about how organizations manage risk under normal human conditions:

- people make mistakes
- accounts get phished
- malware runs with the privileges it inherits
- insiders sometimes abuse access
- emergency exceptions have a habit of becoming permanent

If an account has more power than it actually needs, every one of those failure modes becomes more expensive.

That is why CISSP keeps returning to access control as a risk-reduction discipline. The goal is not to make work miserable. The goal is to reduce unnecessary exposure while keeping the business functional.

## Three concepts people keep blending together

CISSP expects you to separate **least privilege**, **need to know**, and **separation of duties**. They support each other, but they are not synonyms.

### Least privilege

Least privilege means a subject should receive only the permissions necessary to perform its assigned tasks, and no more.

That applies to:

- end users
- administrators
- developers
- service accounts
- applications
- APIs and machine identities

If a developer needs read access to logs and deployment rights in staging, that does not automatically mean they should have production database admin rights or global cloud ownership.

### Need to know

Need to know is narrower. It focuses on access to information, even when someone has a broad role or high level of trust.

A user may be cleared, employed, and generally authorized, but still should only access specific information when there is a legitimate business need.

This matters in environments with sensitive legal, HR, health, defense, or executive information. It also matters in ordinary companies. Not everyone in engineering needs access to customer support transcripts, payroll records, or acquisition plans just because they work for the same organization.

### Separation of duties

Separation of duties prevents one person from controlling an entire sensitive process alone.

The classic reason is fraud prevention, but the principle also reduces accidental harm and makes review more meaningful. Examples include:

- one person requests elevated access, another approves it
- one engineer writes a production change, another reviews or deploys it
- the person reconciling financial records is not the same person issuing payments
- a security administrator should not be the sole approver of their own privileged exception

CISSP likes this concept because it reflects a bigger pattern: good security is not just about technical restriction. It is about accountable process design.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-least-privilege-separation-of-duties/access-control-model.svg" alt="Three-column model distinguishing least privilege, need to know, and separation of duties with practical examples.">
  <figcaption>These ideas overlap, but each solves a slightly different problem.</figcaption>
</figure>

## Why organizations still get this wrong

Least privilege is conceptually simple and operationally annoying. That is usually where the drift starts.

A few common failure patterns show up everywhere:

### Permission creep

People change teams, projects, and responsibilities, but their old access is rarely removed with the same urgency used to grant new access. Over time, one account reflects five historical jobs instead of one current role.

### Standing privilege

Organizations often leave high-level permissions in place because it feels faster than requesting elevation when needed. That makes everyday accounts far more valuable to attackers.

### Shared or vague ownership

When nobody clearly owns access recertification, exceptions pile up. Managers assume IT is reviewing them. IT assumes the business still wants them. The result is stale privilege that remains invisible until an audit or incident exposes it.

### Overpowered service accounts

Human access is not the only risk. Applications and automation often run with far broader permissions than necessary because scoping machine identities takes effort. In cloud environments especially, that creates quiet, high-impact attack paths.

The exam version of this topic is clean. Real life is messy. But the underlying lesson is the same: excessive privilege increases blast radius.

## A realistic scenario: the temporary admin role that never goes away

Imagine a platform engineer is granted broad cloud administrator rights late on a Friday to troubleshoot a production deployment issue. The incident is resolved, but the access is never removed because nobody wants to slow future troubleshooting.

Three months later, that engineer's laptop is compromised through a convincing phishing flow. The attacker does not need a zero-day. They simply inherit the standing privilege already attached to the account.

Now the attacker can:

- create new privileged identities
- weaken logging or retention settings
- access secrets stores
- modify network rules
- interfere with evidence collection

At that point, the problem is not just weak phishing resistance. It is weak privilege discipline.

A stronger design would have looked like this:

- time-box the elevated access
- require approval for privileged activation
- log the session and high-risk actions
- use a separate admin account instead of a daily-use identity
- review whether the engineer needed full admin rights or only a narrower operational role

That is the practical version of least privilege. Not theory. Not slogans. Design choices that limit the cost of inevitable failures.

## What the CISSP exam is really testing here

On the exam, least privilege is rarely just a vocabulary question. It is usually part of a better-answer pattern.

CISSP wants you to recognize that the more secure answer often does one or more of the following:

- reduces access to the minimum necessary level
- assigns ownership and approval to the right authority
- prevents one person from controlling a critical function end to end
- favors accountability and auditability over convenience
- protects the business without granting unnecessary power

That is why answers grounded in governance and process often beat answers that sound merely technical.

If a question asks which control best reduces fraud risk in a sensitive workflow, separation of duties is usually stronger than simply adding more logging. If it asks how to limit damage from compromise, least privilege is usually better than broad default access with monitoring alone.

## Where zero trust fits — and where people overstate it

This is one place where established principles and recent developments fit together well.

The core principles are old and stable:

- least privilege
- need to know
- separation of duties
- explicit approval and review
- accountability for privileged actions

What has evolved is the operating model around them. NIST SP 800-207 describes zero trust as moving defenses away from static, network-based trust assumptions and toward decisions centered on users, assets, and resources. That shift reinforces least privilege. It does not replace it.

In practice, modern access control programs increasingly use:

- just-in-time privileged access
- conditional access based on context
- stronger identity verification
- shorter-lived tokens and sessions
- continuous review of entitlements

Those are modern implementation patterns for a very old idea: stop giving broad, persistent access when narrower and more accountable access will do.

One mistake teams make is talking about zero trust as if buying a product automatically creates least privilege. It does not. If roles are still too broad, approvals are weak, and exceptions never expire, the labels have changed more than the reality.

## What good access discipline looks like in practice

A mature program usually does a few boring things consistently well:

- defaults new access to the minimum required role
- uses separate privileged accounts for administrative work
- reviews access periodically with manager or data-owner accountability
- time-boxes emergency or elevated access
- removes access promptly when job responsibilities change
- scopes service accounts and application permissions tightly
- logs high-risk actions well enough to support investigation and deterrence

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-least-privilege-separation-of-duties/privilege-review-cycle.svg" alt="Privilege review cycle showing request, approval, time-boxing, logging, recertification, and removal.">
  <figcaption>Least privilege works best as a lifecycle, not as a one-time provisioning task.</figcaption>
</figure>

None of this is glamorous. That is probably why it gets neglected. But it is some of the highest-leverage security work an organization can do.

## What the exam wants vs what work demands

The exam usually gives you a cleaner world than production does.

On CISSP questions, you can often assume:

- access should be role-appropriate and justified
- sensitive tasks should not rest with one unchecked individual
- the proper owner should approve access
- the best answer reduces risk while preserving business need

In real organizations, you will also have to deal with:

- legacy applications that do not support granular roles well
- political resistance to access removal
- emergency access paths that are necessary but poorly governed
- cloud platforms where a single overbroad role quietly implies dozens of capabilities

That does not make the CISSP model unrealistic. It makes it useful. The cleaner exam framework helps you see where real environments are compensating for convenience instead of controlling risk deliberately.

## The pattern worth remembering

If you are studying for CISSP, do not memorize least privilege as a slogan and move on.

Treat it as a design question:

**Who really needs this access, for how long, under what approval, and what happens if that account is compromised?**

That question improves your exam answers, your architecture decisions, and your judgment in real security work.

And the longer I work through CISSP material, the more that seems to be the real pattern: mature security is often less about adding dramatic controls and more about tightening the ordinary decisions that quietly shape risk every day.

---

_Post 5 of 60 in my CISSP study series._

---

<!--
**Meta description:** Learn how least privilege, need to know, and separation of duties actually work in CISSP and real-world security, including where zero trust and just-in-time access fit.

**SEO keyword ideas:**
1. CISSP least privilege explained
2. separation of duties cybersecurity examples
3. need to know vs least privilege CISSP
4. zero trust and least privilege access control
5. CISSP Domain 5 access control concepts -->
