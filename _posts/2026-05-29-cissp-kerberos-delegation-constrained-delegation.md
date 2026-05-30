---
layout: post
title: "CISSP #78: Kerberos Delegation Is a Trust Boundary, Not an SSO Convenience"
date: 2026-05-29 16:00:00 +0000
categories: [CISSP, Identity and Access Management, Security Architecture]
tags:
  [
    CISSP,
    Domain 5,
    Kerberos,
    Delegation,
    Constrained Delegation,
    Resource Based Constrained Delegation,
    Service Accounts,
    Least Privilege,
    Identity Security,
    Incident Response,
    Security Architecture,
  ]
excerpt: "Kerberos delegation can preserve user context across applications, but it also expands service trust if handled poorly. This CISSP Domain 5 guide explains unconstrained vs constrained delegation, service-account risk, and practical abuse response."
image: /assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/hero.svg
---

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/hero.svg" alt="Kerberos delegation architecture showing user authentication, front-end service, constrained delegation policy, and approved back-end services" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">Delegation keeps user context across services, but every allowed downstream hop is also a trust decision with security consequences.</figcaption>
</figure>

The recent posts have been concentrated in Domain 4 because they were following one connected communication-and-network-security arc. Post 78 intentionally breaks that sequence and moves into CISSP Domain 5, where identity architecture raises a similar but distinct question: when one service is allowed to act on behalf of a user, how much trust has the organization really granted?

Kerberos delegation exists for legitimate reasons. Multi-tier applications often need a front-end service to access a back-end database or API while preserving the original user context. The problem is not delegation itself. The problem is treating delegation as plumbing instead of a privileged trust path.

For CISSP preparation, this topic is not about memorizing every Active Directory flag. It is about understanding trust scope. Which service may delegate, to which downstream services, under which constraints, and with what monitoring? Those are the decisions that separate useful identity architecture from avoidable blast radius.

## Why Delegation Matters for Security

When a user authenticates once and a front-end service needs to access a downstream service on that user’s behalf, delegation can preserve accountability and simplify application design.

That value is real.

So is the risk.

Common problems include:

- Services trusted to delegate far more broadly than required
- Service accounts with excessive privilege or poor lifecycle governance
- Weak review of service principal name mappings and delegation settings
- Limited visibility into unusual service-to-service impersonation paths

CISSP best-answer logic favors controls that preserve required business function while narrowing transitive trust as much as possible.

## Unconstrained Delegation Is Broad Trust by Another Name

Unconstrained delegation allows a service to reuse a user’s Kerberos context broadly to other services.

That may be convenient. It also expands risk significantly.

If a service configured for unconstrained delegation is compromised, the attacker may gain access to valuable downstream trust relationships that were never intended to be part of the same exposure surface.

This is why unconstrained delegation is usually the weaker design choice in exam questions and in practice.

The stronger model is almost always narrower.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/inline-delegation-models.svg" alt="Comparison of unconstrained delegation, constrained delegation, and resource-based constrained delegation with different trust scopes" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">The difference between delegation models is not administrative detail. It is how much downstream trust a compromised service can inherit.</figcaption>
</figure>

## Constrained Delegation Aligns Better With Least Privilege

Constrained delegation limits where a service may act on a user’s behalf. Instead of broad downstream reach, the allowed targets are explicitly defined.

That is much closer to sound security architecture.

Benefits include:

- Reduced blast radius if the front-end service is compromised
- Clearer mapping between business need and technical trust
- Easier review of which downstream services are genuinely required
- Better exam alignment with least privilege and need-to-know thinking

This does not eliminate risk. It makes trust more deliberate and more reviewable.

## Resource-Based Constrained Delegation Changes Who Controls Trust

Resource-based constrained delegation goes a step further by allowing the back-end resource to control which front-end services may delegate to it.

That can fit modern ownership models better, especially in environments where service teams manage their own resources.

But the same principle still applies: delegated trust should be explicit, narrow, and governed like privileged access.

The wrong lesson here is “resource-based” means “safe by default.”

The right lesson is that control placement changes, but governance requirements remain.

## Service Accounts Are Part of the Risk Story

Delegation settings do not exist in isolation. They are tied to accounts, SPNs, lifecycle practices, and operational monitoring.

That means strong Kerberos delegation hygiene usually includes:

- Named ownership for service accounts and application identities
- Tight scoping of SPNs and approved downstream services
- Strong credential hygiene and rotation practices
- Review of account changes, privilege changes, and delegation changes together

If service accounts are poorly governed, even well-designed delegation models become harder to trust.

## Detection and Monitoring for Delegation Abuse

Delegation problems often stay quiet until something unusual happens downstream.

Useful detection angles include:

- Unexpected service-ticket requests to high-value SPNs
- New or changed delegation settings on sensitive accounts
- Unusual service hop patterns that do not match normal application flows
- Authentication anomalies tied to service accounts with delegation rights

The practical goal is not to log everything indiscriminately. It is to make delegated trust paths observable enough that misuse is detectable.

## Incident Response for Suspected Delegation Misuse

When teams suspect delegation abuse, speed matters because a compromised service may inherit access beyond its own local boundary.

A practical response sequence:

1. Identify the service account, SPNs, and downstream paths involved.
2. Verify whether the issue is misconfiguration, over-broad trust, or compromise.
3. Narrow or disable affected delegation settings.
4. Rotate associated service account credentials if trust is in doubt.
5. Re-test required application paths with approved constrained settings.
6. Review why the original delegation scope was allowed in the first place.

For CISSP scenarios, strong answers combine immediate containment with longer-term trust reduction.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/inline-delegation-abuse-response.svg" alt="Workflow for detecting suspicious Kerberos delegation, verifying misuse, constraining affected trust, and recovering safely" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">The best delegation response paths reduce trust surgically first, then restore needed application behavior through reapproved settings.</figcaption>
</figure>

## Established Principles vs Recent Developments

### Established principles that still matter

- Least privilege should apply to delegated service trust, not only direct user permissions.
- Authentication and downstream authorization are separate design questions.
- Service accounts and machine identities require ownership and review.
- Delegation settings should be treated as high-value trust relationships.

### Recent developments influencing implementation

- Modern multi-tier and hybrid application architectures increase pressure to preserve user context across services.
- Resource-based delegation models better match distributed ownership in some environments.
- Identity threat detection has improved visibility into unusual service-account behavior.
- Organizations are treating machine identities and delegated trust more like privileged access than background infrastructure.

The practical takeaway: the protocol is mature, but the operational importance of delegated trust has only grown.

## CISSP Best-Answer Mindset for Delegation Questions

When answer options appear similar, prioritize the one that:

1. Reduces delegation scope to only required downstream services.
2. Treats service trust as a privileged relationship that needs review.
3. Preserves accountability without granting unnecessary transitive access.
4. Connects service-account governance to delegation settings.
5. Supports monitoring and targeted rollback when trust is abused.

Pattern examples:

- If a scenario compares broad delegation to restricted delegation, favor the narrower model aligned to business need.
- If a front-end service only needs one back-end service, choose explicit constrained trust rather than broad downstream impersonation.
- If a service account is highly privileged, prioritize reducing both account privilege and delegation scope together.

## Practical Baseline You Can Implement

A realistic baseline:

1. Inventory services and accounts configured for delegation.
2. Eliminate unconstrained delegation where business requirements do not demand it.
3. Prefer constrained or resource-based constrained delegation for defined service paths.
4. Review SPN mappings, service-account ownership, and credential lifecycle together.
5. Alert on delegation changes and unusual downstream ticket use.
6. Rehearse delegation rollback for critical applications before incidents occur.

Kerberos delegation is not just an application convenience. It is an identity trust boundary that deserves the same scrutiny as any other privileged access path.

---

_Part of an ongoing CISSP study series focused on practical security architecture decisions. Posts 73 through 77 followed a Domain 4 network-security arc. Post 78 deliberately shifts into Domain 5 with delegated service trust, Kerberos architecture, and least-privilege identity design._

---

**Meta description:** CISSP Domain 5 guide to Kerberos delegation: unconstrained vs constrained delegation, service-account trust, SPN governance, and incident response for delegation abuse.

**SEO keyword ideas:**

1. CISSP Kerberos delegation explained
2. constrained delegation vs unconstrained delegation
3. service account trust and SPN security
4. resource based constrained delegation security
5. CISSP Domain 5 identity architecture
