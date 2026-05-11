---
layout: post
title: "CISSP #62: Secure Network Components: Firewalls, WAFs, Proxies, IDS, IPS, and NAC"
date: 2026-05-13 12:00:00 +0000
categories: [CISSP, Network Security, Security Architecture]
tags:
  [
    CISSP,
    Domain 4,
    Network Security,
    Firewalls,
    WAF,
    IDS,
    IPS,
    NAC,
    Proxy,
    Network Controls,
    Defense in Depth,
    NGFW,
  ]
excerpt: "Post 61 mapped the zones. This post is about the devices that enforce them — and what each one actually does that the others don't. Firewalls, WAFs, proxies, IDS, IPS, and NAC each answer a different question about a different threat."
image: /assets/generated/2026/05/cissp-secure-network-components/hero.svg
---

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-secure-network-components/hero.svg" alt="Diagram showing layered network enforcement devices: NAC, Firewall, IDS/IPS, WAF, and Proxies along a traffic path" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">Each device answers a different question. Selecting the wrong one for the wrong threat is one of the most common CISSP exam errors.</figcaption>
</figure>

Post 61 covered network architecture — how you carve a network into zones, why trust must be explicit, and what the OSI model looks like when you read it as an attack surface. This post goes one level deeper: the actual enforcement devices that sit at those zone boundaries and make the architecture real.

The CISSP exam does not just ask you to define these devices. It puts you in a scenario and asks which one you should deploy. Getting that right requires understanding not just what each device does — but what it cannot do, and why that distinction matters.

## The Firewall Stack: Four Types, Four Threat Models

The word "firewall" covers four meaningfully different technologies. The exam expects you to tell them apart and to select the right one based on the threat being described.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-secure-network-components/inline-firewall-types.svg" alt="Comparison of packet-filter, stateful, application-layer, and next-gen firewall capabilities" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">Each generation adds visibility. More visibility means better decisions — and more processing overhead.</figcaption>
</figure>

**Packet-filter firewalls** operate at Layer 3 and 4. They evaluate each packet in isolation: source IP, destination IP, port, protocol. That is the entire decision. They are fast and computationally inexpensive, which is why they still appear in high-throughput environments and as the first line in router ACLs. Their weakness is statelessness — a packet-filter has no memory of prior packets, which makes it blind to session-level manipulation. A well-crafted RST packet or a fragmented payload can pass through because no single packet triggers a rule.

**Stateful inspection firewalls** add a connection state table. They track whether traffic is part of an established session, whether the sequence makes sense, and whether a return packet was legitimately requested. This stops a wide range of session-hijacking and spoofed-packet attacks that bypass stateless filters. Stateful inspection is the baseline expectation for modern perimeter firewalls.

**Application-layer firewalls** (sometimes called proxy-based or circuit-level gateways, depending on depth) terminate the connection and re-establish it on the far side. Because they sit in the middle of the conversation, they can read the payload — not just the headers. They can validate that HTTP traffic actually looks like HTTP, that DNS requests are well-formed, or that FTP is being used in an expected way. The cost is latency and computational overhead.

**Next-generation firewalls (NGFW)** combine stateful inspection with application awareness, user identity (typically integrated with Active Directory), and a built-in IPS engine. An NGFW can enforce policy based on application type rather than port number — blocking Dropbox uploads while allowing HTTPS browsing on port 443, for instance. Many also support TLS inspection when configured with appropriate certificates.

One important exam boundary: an NGFW is not a WAF. It operates at the network and transport layers with application awareness added on top. It does not deeply inspect HTTP request bodies for injection strings the way a WAF does. If the scenario involves web application attacks, a WAF is the correct device.

## WAFs: A Distinct Control, Not a Firewall Replacement

A Web Application Firewall (WAF) is purpose-built for one job: protecting HTTP and HTTPS applications from application-layer attacks. It sits in front of a web application — either as a reverse proxy, an inline appliance, or a cloud-hosted service — and inspects every request and response at the HTTP level.

Where a network firewall asks "should this packet be routed?", a WAF asks "is this HTTP request malicious?"

WAFs are configured to detect and block patterns associated with SQL injection, cross-site scripting, CSRF, path traversal, HTTP parameter tampering, and other OWASP Top 10 categories. They can enforce positive security models (only allow what is explicitly permitted) or negative models (block what is known bad). Cloud WAF services from major providers add threat intelligence feeds that update rule sets continuously.

The exam signal here is specificity. If the scenario describes attacks against a web application — injection strings in query parameters, malicious JavaScript in form fields, unauthorized access to API endpoints — the answer is a WAF, not a firewall. A firewall will not stop SQLi. It cannot read the database query embedded in a POST request body.

WAFs also have blind spots worth knowing. They require TLS termination to inspect HTTPS traffic. If you deploy a WAF but route encrypted traffic around it, you have a gap. And like any signature-based control, they can be evaded by encoding or obfuscating attack strings. WAFs are essential but not sufficient on their own.

## Proxies: Forward and Reverse, Two Different Threat Directions

A proxy terminates a connection and re-establishes it — the client talks to the proxy, and the proxy talks to the destination. This gives the proxy complete visibility into the traffic, regardless of what port it is on.

**Forward proxies** sit between internal users and the internet. The user's browser sends all traffic to the proxy, which retrieves content on behalf of the user. Security use cases include outbound content filtering (blocking malicious sites, enforcing acceptable use policies), caching to reduce bandwidth, and TLS inspection of outbound encrypted traffic. The proxy is the only system in the organization that directly touches the external internet — all user traffic is mediated.

**Reverse proxies** sit in front of internal servers and handle inbound traffic from the internet. The external client talks to the reverse proxy; the proxy forwards requests to the real server. This hides the internal server's identity and IP address, provides TLS termination (the proxy decrypts before passing to the backend), enables load balancing, and can add authentication or rate limiting before any request reaches the application. A WAF is frequently deployed as or behind a reverse proxy.

From an exam perspective, forward proxies control outbound access from internal users. Reverse proxies control inbound access to internal services. Both are boundary enforcement mechanisms that provide visibility and policy control that a simple packet filter cannot.

## IDS vs IPS: Detection vs Prevention, Placement vs Capability

These two get conflated, but the operational difference is significant — and the CISSP exam tests it directly.

<figure>
  <img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-secure-network-components/inline-ids-ips-nac.svg" alt="IDS out-of-band versus IPS inline placement diagram, and NAC decision flow for device admission" style="width:100%;border-radius:8px;"/>
  <figcaption style="font-size:0.85em;color:#64748b;margin-top:0.5em;">IDS observes. IPS intercepts. NAC decides who gets on the network before a threat even arrives.</figcaption>
</figure>

An **Intrusion Detection System (IDS)** is deployed out-of-band. It receives a copy of traffic — typically via a SPAN port on a switch — and analyzes it for suspicious patterns. When it detects something, it generates an alert. It does not sit in the traffic path, which means it cannot block anything. If an attack passes through, the IDS will log it and alert someone. The attack completes before any response is possible.

An **Intrusion Prevention System (IPS)** is deployed inline. Traffic must pass through the IPS, which means the IPS can intercept and drop packets before they reach the destination. When the IPS detects a malicious pattern, it can block the connection, reset the session, or drop specific packets. The tradeoff is that an inline device creates a single point of failure — if the IPS goes down, traffic stops unless fail-open behavior is configured (which has its own risk profile).

Both systems use two primary detection approaches:

**Signature-based detection** matches traffic against a library of known attack patterns. It has low false-positive rates because every alert corresponds to a known threat. The limitation is that it is blind to attacks that do not match any known signature — zero-days, custom exploit code, or novel attack patterns will pass through undetected.

**Anomaly-based detection** establishes a baseline of normal behavior and alerts when traffic deviates significantly. It can catch threats that signature systems miss, but it generates more false positives — especially in environments with variable or complex traffic patterns. Tuning anomaly thresholds is an operational discipline in itself.

The exam often presents a scenario where the question is whether you need to stop an attack or observe it. If the requirement is active prevention, the answer is IPS. If the requirement is monitoring and alerting without disrupting traffic flow (common in environments where availability is critical), the answer is IDS.

One more exam trap: an IDS cannot block or prevent anything. If a scenario describes a system that detected an intrusion, that is an IDS. If the scenario requires stopping the attack automatically, that requires an IPS.

## NAC: Control Who Gets On the Network at All

Network Access Control is the device that asks the most fundamental question: should this endpoint be allowed on the network in the first place?

A firewall controls traffic between zones. NAC controls admission to those zones. The distinction matters because a firewall assumes the endpoints making requests are at least present on the network. NAC decides whether to allow that presence at all.

NAC operates using 802.1X as its primary authentication framework. When a device connects to a port — wired or wireless — the switch or access point triggers an authentication exchange. The device must present credentials (a certificate, username and password, or both) before it receives network access. A NAC server validates those credentials against a directory.

Beyond authentication, NAC performs **posture assessment**: verifying that the device meets security requirements before granting access. Is antivirus installed and current? Is the OS patched to the required level? Is disk encryption enabled? A device that fails posture assessment can be quarantined to a restricted VLAN — where it may receive a remediation agent or simply be denied access — without ever touching the production network.

This is the key differentiator from a firewall. A firewall does not know whether your laptop has up-to-date AV. NAC does. It also enables role-based access — a contractor's device might be admitted to a guest VLAN while an authenticated corporate device gets full internal access.

The CISSP exam signals NAC with specific scenarios: BYOD policies, unmanaged or guest devices, rogue endpoint detection, or requirements to enforce endpoint compliance before access. If the question involves controlling what connects to the network — not what traffic is allowed once something is connected — the answer is NAC.

## Exam Mindset: Select by Threat, Not by Definition

The practical skill the exam tests is the ability to match a security control to a specific threat in a specific scenario. Memorizing definitions is necessary but not sufficient.

A useful mental model:

- Threat is at the IP/port level and you need high-speed filtering → **Packet-filter firewall**
- Threat involves session manipulation, spoofed packets, or unsolicited inbound connections → **Stateful firewall**
- Threat is a web application attack (SQLi, XSS, CSRF, API abuse) → **WAF**
- Threat requires app-aware, user-aware, network-level policy enforcement → **NGFW**
- Requirement is passive monitoring and forensic visibility without disrupting traffic → **IDS**
- Requirement is active, automated blocking of known attack patterns → **IPS**
- Threat involves unmanaged or non-compliant endpoints connecting to the network → **NAC**
- Users are connecting to external sites and you need visibility and content control on outbound traffic → **Forward proxy**
- External users are reaching your internal services and you want to hide and protect those servers → **Reverse proxy**

The most common mistake on these questions is selecting the most powerful-sounding device rather than the most specific one. A WAF does not need to be backed by an NGFW to stop SQL injection — the WAF is the right answer, and adding an NGFW does not change the WAF requirement.

## These Controls Are Complementary

None of these devices is a substitute for another. A mature network deploys them as a system: NAC decides who gets on, the firewall controls where traffic can go, an IPS watches for attacks in-flight, a WAF protects web applications specifically, and proxies provide visibility and control over encrypted traffic in both directions.

The CISSP exam occasionally tests whether you understand these boundaries — asking what a firewall cannot do, or why a WAF is needed even when an NGFW is present. The answer is always the same: each control has a defined scope, and no single device covers all of it.

Understanding the scope of each control is what separates a security architect from someone who just knows what the acronyms stand for.

---

_Part of an ongoing series working through the CISSP Common Body of Knowledge. Post 61 covered network architecture and security zones. Post 63 will continue in Domain 4._

---

**Meta description:** A practical CISSP Domain 4 breakdown of firewalls, WAFs, proxies, IDS, IPS, and NAC — covering what each device does, what it cannot do, and how to select the right one on the exam.

**SEO keywords:** CISSP Domain 4 network security controls, firewall types CISSP exam, WAF vs firewall difference, IDS vs IPS CISSP, network access control NAC explained
