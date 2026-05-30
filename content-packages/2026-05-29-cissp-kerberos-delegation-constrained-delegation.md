# Content Package: CISSP #78 - Kerberos Delegation Is a Trust Boundary, Not an SSO Convenience

**Slug:** `2026-05-29-cissp-kerberos-delegation-constrained-delegation`
**Post date:** 2026-05-29
**Series:** CISSP Domain 5 - Identity and Access Management (Post 78)

---

## 1. Positioning summary

This post intentionally breaks the recent Domain 4 sequence and moves the series into Domain 5. It positions Kerberos delegation as a privileged trust design problem rather than an implementation detail of single sign-on.

The article is aimed at readers who understand authentication basics but want a clearer practical model for delegation scope, service-account risk, and why broad downstream impersonation is dangerous. It translates a commonly under-explained IAM topic into CISSP best-answer logic.

**Target audience:** CISSP candidates, identity architects, AD administrators, enterprise security engineers, application platform teams
**Primary promise:** A practical framework for understanding unconstrained vs constrained delegation, service trust scope, and delegation abuse response
**Differentiator:** Connects CISSP least-privilege reasoning to operational issues like SPN governance, service-account ownership, and abnormal downstream impersonation paths

---

## 2. Research summary

### Established principles

- Least privilege should apply to delegated service trust as well as direct access.
- Authentication and authorization remain distinct control decisions.
- Machine and service identities need ownership, review, and lifecycle control.
- Delegation settings are privileged trust relationships, not mere convenience features.

### Recent developments and current practice

- Multi-tier and hybrid apps increased reliance on delegated user context across services.
- Resource-based constrained delegation better matches some modern service ownership models.
- Identity monitoring has improved visibility into unusual service-account behavior.
- Organizations are treating machine identities and delegated trust more like privileged access pathways.

### Credible reference basis used

- CISSP Domain 5 IAM principles
- Long-standing Kerberos trust and delegation architecture patterns
- Current enterprise practices for service-account governance and delegated trust monitoring

### Established vs recent distinction used in the article

- **Established:** least privilege, accountability, service trust review, credential governance
- **Recent:** broader distributed-service dependency on delegation, resource-based trust models, stronger identity telemetry for machine accounts

### CISSP best-answer implications

- Prefer delegation designs that preserve business function while narrowing downstream trust.
- Choose explicit constrained trust over broad service impersonation when possible.
- Treat service-account governance and delegation governance as one problem, not two.

---

## 3. Detailed blog post

### Title

CISSP #78: Kerberos Delegation Is a Trust Boundary, Not an SSO Convenience

### Full draft

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

### Meta description

CISSP Domain 5 guide to Kerberos delegation: unconstrained vs constrained delegation, service-account trust, SPN governance, and incident response for delegation abuse.

### SEO keyword ideas

1. CISSP Kerberos delegation explained
2. constrained delegation vs unconstrained delegation
3. service account trust and SPN security
4. resource based constrained delegation security
5. CISSP Domain 5 identity architecture

---

## 4. LinkedIn post

The recent CISSP posts have been heavy on Domain 4 because they were following one network-security arc.
Post #78 deliberately shifts to Domain 5.

Kerberos delegation is one of those identity topics that sounds administrative until you look at the trust it creates.

This post covers:

- why unconstrained delegation is usually a bad security trade
- how constrained delegation better matches least privilege
- why service accounts and SPN governance matter as much as protocol theory
- how to respond when delegated trust is abused

If you had to tighten one area first, would it be delegation scope, service-account governance, or detection of unusual service hops?

#CISSP #IdentitySecurity #IAM #SecurityArchitecture #CyberSecurity

---

## 5. Extra content assets

### Generated images

- `assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/hero.svg`
- `assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/inline-delegation-models.svg`
- `assets/generated/2026/05/cissp-kerberos-delegation-constrained-delegation/inline-delegation-abuse-response.svg`

### Image intent notes

- **Hero:** end-to-end delegated trust path from user auth through front-end service to approved back-end targets
- **Inline 1:** comparison of delegation models by trust scope and blast radius
- **Inline 2:** response workflow for suspicious service impersonation and delegation misuse

### Optional short-form snippets

- "Delegation is not just app plumbing. It is privileged trust by another name."
- "If one service can impersonate users broadly, your trust boundary is broader than you think."
- "Constrained delegation is not perfect, but it is far more defensible than unconstrained trust."
