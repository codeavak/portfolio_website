---
layout: post
title: "CISSP #10: Provisioning and Deprovisioning Are Security Controls, Not IT Chores"
date: 2026-04-04 12:10:00 +0000
categories: [security, cissp]
tags:
  [
    cissp,
    domain-5,
    iam,
    identity-lifecycle,
    provisioning,
    deprovisioning,
    least-privilege,
    zero-trust,
  ]
excerpt: "Many access-control failures start long before an incident—when access is granted too broadly, reviewed too rarely, or removed too late. This CISSP-focused guide explains identity lifecycle management, joiners/movers/leavers, and why access reviews still matter. Post 10 of 60 in my CISSP study series."
image: /assets/generated/2026/04/cissp-provisioning-deprovisioning-identity-lifecycle/hero.svg
---

A lot of access-control failures do not begin with an advanced attacker.

They begin with something much less dramatic: a contractor account that stayed active after the project ended, a role change that left old permissions in place, or a service identity that accumulated broad rights because nobody wanted deployment friction.

That is why identity and access management in CISSP is not just about passwords, MFA, or login prompts. It is also about **lifecycle discipline**: how access is requested, approved, granted, reviewed, changed, and removed over time.

In real organizations, that is often where access control quietly succeeds or fails.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-provisioning-deprovisioning-identity-lifecycle/hero.svg" alt="Illustration showing access requests moving through approval, provisioning, review, and deprovisioning as part of a secure identity lifecycle.">
  <figcaption>Strong identity security is not just about who gets in. It is about how access changes across the full account lifecycle.</figcaption>
</figure>

## Why this topic matters more than teams admit

Security teams often talk about authentication because it is visible.

Lifecycle failures are quieter. They sit in ticket queues, directory groups, cloud roles, vendor accounts, and long-lived service principals. They are less exciting than a new security product, but they shape a lot of real risk.

That is why CISSP expects you to understand identity lifecycle management as part of broader access control discipline. If the wrong access is granted, never reviewed, or not removed promptly, the quality of the login process only solves part of the problem.

A perfectly authenticated user can still do too much.

## What CISSP means by identity lifecycle management

At a practical level, this topic covers the ordinary but high-impact controls around the lifecycle of identities and entitlements.

That includes:

- **provisioning** access for new users, contractors, and services
- **modifying** access when responsibilities change
- **reviewing** access periodically for continued business need
- **revoking** access promptly when employment, assignments, or third-party relationships end
- **documenting approval and ownership** so the business, not just IT, is accountable for sensitive access decisions

You will often hear this framed as **joiners, movers, and leavers**.

That sounds administrative until you notice how many incidents trace back to one of those transitions being handled poorly.

## Three places access control quietly breaks down

### 1. Joiners get broad access because it feels faster

New employees need to become productive quickly, so organizations often solve the problem with convenience:

- oversized default roles
- inherited group membership from the team rather than the job
- emergency access that becomes permanent
- one starter profile used for many different responsibilities

This is how overprovisioning starts. It usually feels efficient in the moment and expensive later.

A better pattern is role-appropriate baseline access, data-owner approval for sensitive resources, and a clear separation between ordinary access and privileged access.

### 2. Movers keep old permissions long after their role changed

This is one of the most common real-world failures.

Someone moves from one team to another, gets added to the new groups, but their old permissions are never removed with the same urgency. Over time, the account reflects three or four historical jobs instead of one current role.

That is **permission creep**, and it quietly undermines least privilege.

It also creates a misleading sense of legitimacy because every individual permission may once have been approved. The problem is that the combination no longer matches the user's actual need.

### 3. Leavers and third parties stay around too long

When an employee leaves, a vendor engagement ends, or a temporary assignment is complete, access should be revoked promptly.

But in practice, delays happen because:

- HR updates and technical deprovisioning are not tightly connected
- system owners assume someone else removed the access
- service accounts have no clear owner
- third-party access lives outside the normal identity governance process

This is where stale accounts become an attacker's gift. An old account with residual access is often much easier to abuse than a freshly defended front door.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-provisioning-deprovisioning-identity-lifecycle/lifecycle-loop.svg" alt="Diagram showing joiner, mover, and leaver events feeding into approval, provisioning, review, and deprovisioning controls.">
  <figcaption>Identity lifecycle discipline matters most at the transitions: new access, changed access, and removed access.</figcaption>
</figure>

## A realistic example: the engineer who never really changed roles

Imagine a senior engineer starts in application development. They get access to source code, lower environments, build systems, and a few production troubleshooting tools.

A year later, they move into a platform role and receive broader cloud permissions to support deployments. Then they take on temporary on-call coverage and receive a few more emergency privileges.

Individually, each approval made sense.

The problem is what happens next: nobody removes the earlier access because nothing looks obviously wrong. The engineer now has a blended entitlement set across development, operations, and emergency administration.

If that account is compromised, the attacker inherits a much wider attack path. If the engineer makes a mistake, the blast radius is larger than anyone intended.

The root issue is not poor intent or weak authentication. It is weak lifecycle management.

A stronger model would:

- assign a role-aligned baseline for each position
- time-box temporary elevation
- require review when responsibilities change
- separate daily-use access from privileged administration
- remove old entitlements as deliberately as new ones are added

That is exactly the kind of reasoning CISSP wants you to practice.

## Why machine identities make this harder now

This topic used to feel mostly human.

It no longer is.

Modern environments are full of **non-human identities**:

- service accounts
- cloud roles and service principals
- CI/CD identities
- API keys and tokens
- automation accounts used by infrastructure and integrations

These identities often have broad, persistent permissions because tightening them takes work. They also tend to be reviewed less rigorously than human access, even though they may hold some of the most sensitive privileges in the environment.

That is one reason current identity discussions increasingly focus on short-lived credentials, scoped workload identities, and stronger ownership of machine access. The principle is not new; the scale of the problem is.

## Where zero trust and just-in-time access fit

This is one of those CISSP topics where established principles and current direction line up well.

The established principles are familiar:

- least privilege
- need to know
- separation of duties
- periodic review
- prompt revocation when access is no longer justified

The newer operational framing is more identity-centered. NIST SP 800-207 continues to describe zero trust as shifting attention away from static network perimeters and toward users, assets, and resources. That reinforces the idea that access should be evaluated deliberately and continuously, not assumed safe because someone is already "inside."

That is also why just-in-time access, shorter-lived elevation, and tighter entitlement review keep showing up in modern identity programs.

But it is worth saying plainly: **zero trust is not a substitute for cleanup**.

An organization can adopt modern language and still leave stale roles, standing privilege, and ownerless service accounts all over the environment. Good identity lifecycle management is what keeps access discipline grounded in reality.

## What the CISSP exam is really testing here

On the exam, this topic is usually wrapped inside a broader best-answer pattern.

CISSP wants you to think like someone managing business risk, not just like someone approving a ticket faster.

That means the stronger answer often:

- gives access based on documented business need
- uses the proper owner or manager for approval
- limits privileges to the minimum necessary scope
- reviews access periodically
- removes or adjusts access promptly when roles change or end
- avoids concentrating sensitive functions in one unchecked identity

If a question asks what should happen when an employee transfers roles, the best answer is rarely "just add the new access." It is usually something closer to **re-evaluate and provision only what the new role requires while removing what no longer fits**.

That is a very CISSP way of thinking: risk-aware, process-aware, and bigger than the immediate technical action.

## A practical checklist for real teams

A few questions go a long way here:

- Who owns this access decision?
- Is the access tied to a current role or to historical convenience?
- Does this identity still need the privilege today?
- Is privileged access separated from daily-use access?
- Are temporary exceptions time-boxed and reviewed?
- If a contractor leaves tomorrow, what would automatically shut off?
- Which machine identities have powerful permissions but weak ownership?
- Are periodic access reviews actually removing anything, or just rubber-stamping the current state?

Those are not glamorous questions. They are exactly the kind that prevent ordinary drift from turning into a meaningful incident.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-provisioning-deprovisioning-identity-lifecycle/access-review-cycle.svg" alt="Access review cycle showing request, owner approval, provisioning, time-boxing, review, and removal of stale entitlements.">
  <figcaption>Access control works best as a lifecycle with ownership, review, and removal built in—not as a one-time provisioning event.</figcaption>
</figure>

## The pattern worth remembering

A lot of security failures are not really authorization design failures or authentication failures alone.

They are **lifecycle failures**.

The organization granted access too broadly, changed it too casually, reviewed it too weakly, or removed it too late. CISSP is right to treat that as security work rather than administrative cleanup, because access governance shapes risk long before an attacker tries to exploit it.

If you are studying too, this is one of the topics worth learning as an operating habit, not just an exam answer.

---

_Post 10 of 60 in my CISSP study series._

---

<!--
**Meta description:** Learn why provisioning, deprovisioning, and identity lifecycle management are core CISSP access-control concepts for real-world security teams.

**SEO keyword ideas:**
1. CISSP identity lifecycle management
2. provisioning and deprovisioning security controls
3. joiners movers leavers access control
4. least privilege access review CISSP
5. IAM lifecycle management best practices -->
