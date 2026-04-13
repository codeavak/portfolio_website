---
layout: post
title: "CISSP #27: Network Segmentation Limits the Blast Radius"
date: 2026-04-13 12:00:00 +0000
categories: [security, cissp]
tags:
  [
    cissp,
    domain-4,
    network-security,
    segmentation,
    defense-in-depth,
    microsegmentation,
  ]
excerpt: "Segmentation is not a firewall rule. It is an architectural decision about how far a compromise can travel—and the answer matters far more after a breach than before one."
image: /assets/generated/2026/04/cissp-network-segmentation-limits-blast-radius/hero.svg
---

Breaches happen.

That sentence is not pessimism. It is the risk premise that should sit behind every network architecture decision.

Once you accept it, the interesting question is not "how do we stop every attacker?" It is "if something inside this network is compromised, how much damage can it do before we contain it?"

That question has a name: blast radius.

And the architectural answer to blast radius control is network segmentation.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-network-segmentation-limits-blast-radius/hero.svg" alt="Two diagrams side by side: a flat network where a compromised laptop can reach every resource, and a segmented network where the same compromise is contained within a single zone.">
  <figcaption>Flat networks fail completely when any node is compromised. Segmented networks limit how far that failure can propagate.</figcaption>
</figure>

## The flat network problem

A flat network is one where all hosts share the same broadcast domain and can communicate directly. There are no meaningful internal boundaries.

In a flat network, a compromised workstation can often reach:

- the file server
- the database
- the backup system
- the domain controller
- whatever sensitive function the organization runs

This is not a theoretical concern. The majority of damaging breaches involve lateral movement: the attacker enters through one weak point and then navigates freely toward higher-value targets. The initial entry point is rarely the prize. The movement after it is.

Flat networks are still common. They exist in legacy environments, in networks that grew organically, and in systems where convenience consistently beat security discipline. CISSP does not expect you to solve organizational inertia. It does expect you to understand why flat networks are a risk and what a properly segmented architecture looks like instead.

## What segmentation actually means

Segmentation is the practice of dividing a network into zones with enforced boundaries between them.

Not VLANs alone. Not routing rules. Enforced boundaries — meaning that traffic crossing a zone boundary passes through a control point that can inspect, allow, or deny it.

The goal is not to make internal communication impossible. Most real systems require services to talk to each other. The goal is to ensure that every zone crossing is a deliberate policy decision, not an architectural accident.

A segmented network answers questions like:

- Can the web tier make direct database connections, or does it only talk to the application tier?
- Can a workstation on the general staff network reach the invoicing system directly?
- Does a breach in the e-commerce platform affect the payroll system?

If the answer to any of those is "yes, by default," the segmentation model has a gap.

## The classic security zone model

The standard security zone model establishes tiers of trust with explicit enforcement between them.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-network-segmentation-limits-blast-radius/zone-model.svg" alt="A four-layer zone diagram: external zone, DMZ, internal zone, and restricted zone, with firewall checkpoints drawn at each boundary transition.">
  <figcaption>Each zone boundary is a deliberate policy decision. What can cross it, and under what conditions, defines the security model.</figcaption>
</figure>

**External (untrusted):** The public internet. No implicit trust. Traffic entering from here is scrutinized.

**DMZ (demilitarized zone):** A semi-trusted segment. Public-facing services — web servers, edge APIs, mail relays — live here. External users can reach these services. But a compromise in the DMZ should not grant direct access to the internal network.

**Internal:** General corporate or application network. Users, workstations, and internal services. Trust is higher than the DMZ but not unconditional.

**Restricted:** High-value or high-sensitivity assets. Databases, secrets management systems, financial processing, sensitive data stores. Access is tightly controlled and explicitly granted, never assumed.

The DMZ exists specifically because some services must be reachable externally while the internal network must not be. A compromised web server in the DMZ should be a bad day — not a catastrophic one. If the DMZ is properly isolated, the damage stops there.

CISSP will test whether you understand the _why_ behind the DMZ, not just the _what_. The DMZ does not protect the web server. It protects everything else from the web server.

## VLANs are logical separation, not security enforcement

VLANs are commonly misunderstood as a security control. They separate broadcast domains and reduce collision traffic. They do not enforce security policy on their own.

VLAN hopping — where traffic jumps from one VLAN to another — is a known attack technique, typically achieved through double-tagging or rogue trunk negotiation on misconfigured switches.

More practically, a VLAN with no firewall at the crossing point gives you logical separation without enforced boundaries. Traffic crossing from one VLAN to another passes through a router, but whether that crossing is actually controlled depends on whether firewall rules or ACLs sit on that path.

The rule for CISSP questions about segmentation:

- VLANs reduce broadcast scope and assist with organization, but do not constitute security enforcement on their own.
- Firewall controls at zone crossings — inspecting traffic by source, destination, protocol, and state — constitute enforcement.
- The question to ask: if a host in VLAN A is compromised, what can it reach in VLAN B, and what actually controls that answer?

## Microsegmentation extends the model east-west

Traditional network security was predominantly perimeter-focused. Strong controls on what enters and leaves the network. Inside the perimeter, east-west traffic moved with fewer restrictions.

That model worked when most threats came from outside. It fails when threats originate inside — from phishing, insider risk, compromised cloud workloads, or lateral movement from an already-breached endpoint.

Microsegmentation applies policy at the individual workload or service level. Instead of a single trust boundary around the perimeter, you define what each service is allowed to communicate with. A payment processing service can reach the database it needs. It cannot reach the HR system. The HR system cannot reach the payment database.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/04/cissp-network-segmentation-limits-blast-radius/microsegmentation.svg" alt="Comparison of north-south perimeter control versus east-west microsegmentation, showing how granular policy between services limits lateral movement.">
  <figcaption>Protecting the perimeter controls what enters. Microsegmentation controls what moves after something gets in.</figcaption>
</figure>

Cloud environments and software-defined networking make microsegmentation practical in ways that were harder to achieve in purely physical infrastructure. Security groups, Kubernetes network policies, and service mesh configurations are all implementations of this principle.

Zero trust architecture takes it further still: every request must be authenticated and authorized, regardless of where it originates. Being on an internal network grants nothing by itself. This is the logical end of the segmentation progression — from "external vs. internal" to "contextual trust for every connection."

CISSP awareness here means understanding the spectrum: perimeter → segmented zones → microsegmented services → zero trust. Each step limits blast radius more tightly. Each step also increases design and operational overhead. The right point on that spectrum depends on the risk tolerance and asset value of what you are protecting.

## What CISSP tests on segmentation

The exam frames network segmentation as a _risk management decision_, not a technical configuration task.

Common themes in CISSP questions:

**Purpose, not mechanics:** Why does a DMZ exist? Not because it is best practice — because it limits the consequences of a breach in a publicly reachable service. The exam rewards answers that explain the risk rationale, not the firewall rule syntax.

**Placement decisions:** Where should a web server sit? Where should a database sit? Which control goes _between_ them? These questions test zone architecture understanding, not implementation details.

**Blast radius thinking:** If a specific system is compromised, what can the attacker now reach? CISSP questions ask you to evaluate scenarios and determine whether a proposed architecture adequately limits exposure.

**Vocabulary:** Know these terms cold — DMZ, screened subnet, bastion host, screening router, stateful inspection firewall, network access control — and know the relationships between them, not just the definitions.

The mindset shift: stop asking whether the firewall is correctly configured, and start asking whether the architecture, if compromised at any single point, contains the damage to an acceptable scope.

## The engineering translation

If you build systems that handle sensitive data, segmentation is already your responsibility whether you use that vocabulary or not.

Ask yourself:

- Can the web-facing component of your application make a direct connection to the database?
- Can a compromised container in your deployment communicate with your secrets store without any access control layer in between?
- If an attacker takes over the application service account, how many systems does that account have access to?
- Does your staging environment have network paths that could reach production systems?

Those are segmentation questions. The security engineering answer in each case starts with: design so that a compromise at this point cannot reach that point without explicit, enforced permission.

CISSP makes this explicit as architecture. It is worth applying before the breach, not only as a lesson learned after one.

## The principle that holds across every scale

Segmentation does not require a large budget or a complex SDN platform. It requires discipline at the architecture level: decide what should talk to what, enforce those decisions at explicit chokepoints, and revisit the assumptions whenever the system changes significantly.

The value is not an impenetrable network. The value is a network where a breach becomes an incident measured in hours and contained within a zone — not a catastrophe measured in weeks and limited only by what the attacker chose to exfiltrate.

Design like a breach is already underway somewhere inside.
Build the boundaries that make the answer manageable.

---

_This post is part of my CISSP study series — working through the domains and writing up what actually sticks. Domain 4: Communication and Network Security._
