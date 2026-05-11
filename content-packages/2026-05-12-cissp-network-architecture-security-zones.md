# Content Package — CISSP #61: Network Architecture Models and Security Zones

**Date:** 2026-05-12  
**Slug:** cissp-network-architecture-security-zones  
**Domain:** 4 — Communication and Network Security  
**Series position:** First dedicated D4 post in the series

---

## 1. Positioning Summary

This is the first post in a planned D4 sequence, targeting the most underrepresented CISSP domain in the current series. Posts 1–60 covered substantial ground in D1 (governance, risk), D2 (asset security), D3 (architecture and engineering), D5 (IAM), D6 (assessment and testing), D7 (operations), and D8 (software development security). Domain 4 has received only passing coverage — basic network segmentation in earlier posts. This post establishes the architectural foundation for D4: OSI security framing, security zone design rationale, boundary enforcement mechanisms, and CISSP exam mindset for network architecture questions.

**Target reader:** Software engineers moving into security, early security practitioners, CISSP candidates preparing for Domain 4.

**Brand positioning:** Demonstrates systems-level thinking, security architecture literacy, and the ability to explain foundational concepts without making them feel like flashcards. The post is practical and exam-useful without being a memorization guide.

---

## 2. Research Summary

### OSI Model — Security Frame

- **Layer 7 (Application):** Highest attack volume in modern threat landscape. OWASP Top 10 attacks are almost entirely Layer 7. WAFs and input validation are the primary controls.
- **Layer 6 (Presentation):** TLS stripping and downgrade attacks are real and well-documented. Protocol downgrade attacks (POODLE, BEAST) exploit cipher negotiation. Enforcing minimum TLS versions is a control most security-mature organizations have implemented.
- **Layer 5 (Session):** Session hijacking and replay attacks have long histories. Session fixation was a common attack against PHP and similar platforms. Modern mitigation: token-based sessions with short expiry.
- **Layer 4 (Transport):** SYN flood DDoS is a baseline threat. SYN cookies are a standard mitigation. Port scanning is recon, not an attack in isolation, but informs subsequent attack planning.
- **Layer 3 (Network):** IP spoofing is constrained by BCP38 (anti-spoofing filtering) in most major networks but remains relevant. BGP route poisoning (BGP hijacking) has caused real-world routing incidents. RPKI addresses the authentication gap.
- **Layer 2 (Data Link):** ARP spoofing is a staple of internal network attacks and penetration testing. Dynamic ARP inspection is a well-established countermeasure. VLAN hopping is a known but often over-relied-upon attack in practice — proper switch configuration neutralizes it.
- **Layer 1 (Physical):** Physical security is often underappreciated. Fiber is harder to tap than copper. Physical access control is the ultimate defense.

### Security Zones

The five-zone model (Internet, DMZ, Internal, Restricted, Management) is a standard reference framework, not a vendor or standards-body mandate. The dual-firewall screened-subnet architecture is the reference model for secure DMZ design. Single-firewall DMZs with dual interfaces are a recognized anti-pattern in CISSP exam content.

The management plane separation concept is well-established in network security — NIST, CIS Controls, and NSA guidance all recommend dedicated out-of-band management networks for infrastructure devices.

### Firewall Types

Three-type taxonomy (packet filtering, stateful inspection, application gateway / NGFW) maps directly to CISSP CBK content. The exam expects candidates to match the firewall type to the threat it addresses, not to configure rules.

### NAT

CISSP explicitly distinguishes NAT as an addressing mechanism rather than a security control. Candidates sometimes mistake NAT for a form of access control; the exam tests this misconception.

---

## 3. Detailed Blog Post

_See `_posts/2026-05-12-cissp-network-architecture-security-zones.md` for the full article._

Word count: ~1,550 words  
Reading time: ~7 minutes  
H2 sections: 4 major sections + exam mindset section  
Images: 3 SVGs (hero + 2 inline)

### Key themes:

- OSI model reframed as an attack surface map, not a protocol taxonomy
- Security zone design grounded in trust decisions, not topology preferences
- Dual-firewall DMZ as the reference architecture (with explanation of why single-firewall DMZ fails)
- Firewall type → threat mapping (exam mindset)
- NAT ≠ security control (common exam trap)
- Practical bridge: application developers and zone design decisions

---

## 4. LinkedIn Post

---

Most engineers learn the OSI model for interviews.

CISSP Domain 4 uses it differently.

Each layer isn't just a protocol spec. It's an attack surface. And the CISSP exam expects you to reason about which attacks live at which layer — and which controls address them.

A few things that look obvious but trip candidates up:

**Layer 2 (Data Link)** — ARP spoofing enables man-in-the-middle attacks on the local segment. VLAN hopping via double tagging crosses security boundaries that were supposed to be enforced at the switch.

**Layer 3 (Network)** — IP spoofing is constrained by ingress/egress filtering in most large networks. BGP hijacking is still a real and periodic incident type, not a theoretical threat.

**Layer 4 (Transport)** — SYN floods exploit connection state exhaustion. Stateful firewalls with SYN cookies address this. Packet filters don't.

**Layer 7 (Application)** — Where most modern attacks land. WAFs and input validation live here. Stateful inspection doesn't touch this.

On top of the OSI framing, Domain 4 introduces security zones — the architectural expression of trust.

Internet → DMZ → Internal → Restricted → Management.

Every boundary is a policy decision. The exam consistently tests one failure mode in particular: the single-firewall DMZ. One device, two interfaces, DMZ hosts that can reach the internal network. When the DMZ is compromised, there's no interior boundary. Proper design uses two distinct firewall enforcement points: one for Internet-to-DMZ, one for DMZ-to-Internal.

And NAT doesn't count. NAT is an addressing mechanism. It is not an access control.

Writing these posts as I work through the domains — if you're on the same path, what's the trickiest D4 concept you've run into?

#CISSP #NetworkSecurity #SecurityArchitecture #Domain4 #Cybersecurity

---

## 5. Extra Content Assets

### Images Created

| File                                                                                             | Description                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/generated/2026/05/cissp-network-architecture-security-zones/hero.svg`                    | Five-zone security architecture diagram (Internet → DMZ → Internal → Restricted → Management) with firewall indicators, zone contents, and boundary type legend |
| `assets/generated/2026/05/cissp-network-architecture-security-zones/inline-osi-attacks.svg`      | OSI model layers 1–7 annotated with common attacks and primary controls per layer                                                                               |
| `assets/generated/2026/05/cissp-network-architecture-security-zones/inline-zone-transitions.svg` | Zone transition control diagram showing Internet→DMZ, DMZ→Internal, Internal→Restricted boundary enforcement with key principle callouts and NAT clarification  |

### Teaching Notes

**Common exam traps on this topic:**

1. **Single-firewall DMZ** — The exam describes a network with a DMZ using one firewall and two interfaces. The correct identification: no interior boundary. The fix: two firewalls (or equivalent distinct enforcement policies).

2. **NAT as access control** — Candidates conflate NAT with zone isolation. NAT obscures addressing, not traffic flow. A compromised DMZ host can still reach internal resources if the firewall permits it.

3. **Packet filter vs. stateful vs. NGFW** — The exam asks which type addresses which threat. Packet filter = header-only, no state. Stateful = session-aware. NGFW = application-aware. The question "which firewall should inspect HTTP traffic for injection?" has one answer: application-layer / NGFW.

4. **Management plane separation** — The exam describes management traffic (device configs, SSH to routers) flowing over the production network. The missing control: dedicated out-of-band management zone.

5. **"Screened subnet"** — Synonym for dual-firewall DMZ architecture. Know this terminology.

**For future D4 posts in this sequence:**

- VPNs: IPSec vs. SSL/TLS VPN, split tunneling, site-to-site vs. remote access
- Wireless security: WPA3, enterprise vs. personal, EAP variants, rogue AP detection
- Network protocols and their security implications: DNS security (DNSSEC), DHCP snooping, BGP security
- Cloud networking: VPCs, security groups, NACLs, transit gateways
- Network monitoring and detection: IDS/IPS, NetFlow, packet capture, SIEM integration

### SEO Keywords

1. CISSP Domain 4 network security zones
2. OSI model security attacks by layer
3. DMZ design dual firewall screened subnet
4. firewall types CISSP exam packet filter stateful NGFW
5. network segmentation trust zones security architecture

### Meta Description

CISSP Domain 4 — network architecture models and security zones. OSI model as an attack surface map, DMZ design rationale, firewall type selection, and zone transition enforcement. Covers both exam mindset and practical application.
