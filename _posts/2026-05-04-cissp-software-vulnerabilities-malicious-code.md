---
layout: post
title: "CISSP #52: Software Vulnerabilities and Malicious Code — What the Exam Expects You to Recognize"
date: 2026-05-04 13:00:00 +0000
categories: [CISSP, Software Development Security, Application Security]
tags:
  [
    CISSP,
    Software Vulnerabilities,
    Buffer Overflow,
    Injection,
    XSS,
    CSRF,
    Malicious Code,
    Domain 8,
    Application Security,
  ]
excerpt: "Every security incident traces back to code that did something it should never have been allowed to do. CISSP Domain 8 expects you to recognize the major vulnerability categories — and understand why certain defenses work where others fail."
image: /assets/generated/2026/05/cissp-software-vulnerabilities-malicious-code/hero.svg
---

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-software-vulnerabilities-malicious-code/hero.svg" alt="CISSP #52: Software Vulnerabilities and Malicious Code — five categories with root causes and controls" class="blog-hero" />

Every security incident eventually traces back to code that did something it should never have been allowed to do. A function read past the end of a buffer. A query accepted unescaped user input. A file was renamed between the time it was checked and the time it was used. A developer left a debugging backdoor in place and shipped it to production.

Post #51 covered the Secure SDLC — how security belongs in every phase of development, from requirements through maintenance. This post goes one level deeper into the code itself. Before you can build software that resists attack, you have to understand the specific failure modes that attackers exploit.

CISSP Domain 8 expects you to recognize the major vulnerability categories, understand their root causes, and reason about appropriate controls. The exam does not ask you to write exploit code. It asks you to think like someone responsible for a system's security posture — and that means knowing what can go wrong, and why certain defenses work where others do not.

## The Categories Domain 8 Cares About

Domain 8 organizes software vulnerabilities into recognizable patterns. The specific exam objectives map to:

- Memory management errors
- Injection flaws
- Web application vulnerabilities
- Logic flaws, including race conditions
- Malicious code

Each category has a distinct root cause and a corresponding set of controls. Understanding the connection between root cause and control is what the exam is actually testing.

## Memory Management Errors

Memory management vulnerabilities are among the oldest and most consequential class of software defects. The canonical example is the buffer overflow: a program writes data to a memory buffer without checking whether the data exceeds the buffer's capacity, allowing an attacker to overwrite adjacent memory — including return addresses, function pointers, or other control data.

The consequences range from application crash to arbitrary code execution. In languages like C and C++, developers manage memory manually. There is no automatic bounds checking. A single unchecked `strcpy` call is sufficient to introduce a critical vulnerability. Decades of security incidents — from early worm exploits to embedded system attacks — have root-caused to exactly this pattern.

**Heap spraying** is a related technique where an attacker fills large regions of heap memory with shellcode or exploit payloads, increasing the probability that a memory corruption error lands in attacker-controlled memory. **Use-after-free** vulnerabilities occur when a program continues to use a memory reference after the underlying memory has been freed, potentially pointing at attacker-controlled content by the time it is accessed.

**What CISSP expects**: Understand the root cause (absent bounds checking, manual memory management), the consequence (arbitrary code execution), and the primary control responses — input validation, safe API selection, use of memory-safe languages, and operating system mitigations like Address Space Layout Randomization (ASLR) and Data Execution Prevention (DEP/NX).

## Injection Flaws

Injection flaws share a common root cause: untrusted input is interpreted as a command rather than as data. The application fails to maintain a clear boundary between code and content.

SQL injection is the most well-known example. A query constructed by concatenating user input directly into a SQL string can be manipulated to change the query's structure entirely. The attacker's input escapes the data context and enters the command context. The same structural problem applies to OS command injection (user input passed unsanitized to a shell), LDAP injection (user input embedded in directory queries), and XML injection (user input embedded in XML documents without proper encoding).

The CISSP exam framing here is important. **Parameterized queries and prepared statements** are the correct control for SQL injection — not input sanitization. Sanitization attempts to enumerate and remove dangerous characters. Parameterization eliminates the structural problem: the query structure is fixed, and user input is always treated as data, never as command. The exam may test this distinction directly.

Command injection is often more severe than SQL injection because the attacker gains access to the operating system's command interpreter, not just the database. The control principle is the same: never pass untrusted input to an interpreter. When that is architecturally unavoidable, strict allowlist validation is the minimum acceptable control — not a blocklist.

## Web Application Vulnerabilities

Web application vulnerabilities form a specific subcategory of injection, but they operate at the browser and session layer rather than the database or operating system layer.

**Cross-site scripting (XSS)** occurs when an application reflects or stores user-supplied content in a web page without proper output encoding. A malicious actor injects a script that executes in other users' browsers, potentially stealing session tokens, redirecting navigation, or performing actions on behalf of the victim.

There are two primary forms: **reflected XSS** (the payload is embedded in a URL and reflected immediately in the response) and **stored XSS** (the payload is persisted in the application's data store and delivered to all users who view the affected content). Stored XSS is generally more dangerous because it does not require the victim to click a crafted link — the payload executes on normal navigation.

**Cross-site request forgery (CSRF)** is different in character. The attacker does not inject script. Instead, they trick an authenticated user's browser into making unintended requests to a site where the user has an active session. The browser helpfully includes the user's session cookies, so the server sees what appears to be a legitimate request from the authenticated user. The control is an unpredictable, per-request token — a CSRF token — that the attacker cannot know, combined with same-origin validation and the `SameSite` cookie attribute.

**What CISSP expects**: Know the difference between XSS (attacker injects script that runs in the victim's browser) and CSRF (attacker tricks the victim's browser into making a request on their behalf). Know the primary controls: output encoding for XSS, CSRF tokens and `SameSite` cookie attributes for CSRF.

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-software-vulnerabilities-malicious-code/inline-1.svg" alt="CISSP exam framing: vulnerability categories, root causes, primary controls, and exam focus" class="blog-inline" />

## Logic Flaws and Race Conditions

Logic flaws are harder to categorize because they do not follow a single structural pattern. They represent errors in the application's reasoning about state, time, or authorization — flaws that are correct in isolation but dangerous in combination.

**Race conditions** occur when a program's behavior depends on the sequence or timing of events that are not properly controlled. The classic CISSP example is the **Time-of-Check to Time-of-Use (TOC/TOU)** vulnerability: a program checks a condition — is this file accessible, is this account balance sufficient, does this user have this permission — and then uses the result of that check some time later. If an attacker can change the checked resource in the window between check and use, the program acts on a false assumption.

TOC/TOU vulnerabilities appear in file system operations, financial transaction logic, authentication flows, and anywhere shared mutable state can be modified by multiple actors concurrently. The architectural fix is atomicity: ensure that the check and the use are inseparable, or that the resource cannot be changed between them. Database transactions with appropriate isolation levels address this in data contexts. In file system operations, using file descriptors rather than file paths after a permission check reduces the exploitable window.

**The exam mindset**: Race conditions are not limited to systems programming. They appear in distributed systems, concurrent application logic, and any context where state can be modified between two operations. Recognizing the TOC/TOU pattern in a scenario description is the primary exam skill here.

## Malicious Code

Malicious code is software intentionally designed to cause harm, enable unauthorized access, or both. CISSP Domain 8 distinguishes between types, and the exam expects you to recognize each.

**Backdoors** are unauthorized access mechanisms embedded in code — sometimes planted by attackers who have already compromised a system, sometimes introduced by developers during testing and never removed. The security controls are code review, change management, and binary integrity monitoring. Signed builds and reproducible build processes help establish that what is deployed matches what was reviewed.

**Logic bombs** are malicious code segments that execute when a specific condition is met — a particular date, the absence of a user account, a specific sequence of inputs. They are frequently planted by insiders and designed to cause damage after the attacker has left the organization. Detection requires code review, change control, and behavioral monitoring; a logic bomb may sit dormant in a codebase for months before triggering.

**Trojan horses** carry a hidden malicious payload alongside apparent legitimate functionality. The user installs what appears to be a useful application; they also install whatever the attacker embedded. The control response involves software provenance verification, supply chain controls, and code signing — treating all third-party software as untrusted until integrity is confirmed.

**Rootkits** are designed to conceal other malicious software or unauthorized access by modifying operating system behavior at a low level — potentially subverting the very tools used to detect them. Detection typically requires booting from trusted external media and scanning from a known-good environment, because the rootkit may have compromised the host's inspection capabilities.

**What CISSP expects**: Understand the classification and characteristics of each type. Know that detection and response strategies differ from prevention strategies, and that supply chain integrity is a critical control — malicious code is increasingly introduced through dependencies and third-party components, not only through direct system compromise.

## How the Exam Tests These Topics

The CISSP exam is not a vocabulary test. Questions about software vulnerabilities are typically scenario-based. You will be asked to identify the vulnerability type in a described situation, select the most appropriate control from a set of options, or explain why one defense is preferable to another.

Common patterns to expect:

- A scenario describes input being reflected in a page without encoding — this is XSS, and the control is output encoding, not input filtering alone.
- A scenario describes a query built from concatenated user input — this is injection, and parameterization is the correct control, not sanitization.
- A scenario describes a file operation that reads permissions and then opens the file — TOC/TOU is the pattern, and the answer involves atomicity or descriptor-based access.
- A scenario asks about code found in a production deployment that was not present in the approved design — this describes a backdoor, and the response involves integrity verification and code review processes.

The exam rewards the ability to connect root cause to control, and to distinguish between controls that address symptoms versus controls that eliminate the structural problem.

## The Engineering Perspective

These vulnerability categories are not exotic or rare. They recur across decades because the underlying structural problems — unvalidated input, manual memory management, race-prone state logic, absent integrity verification — are easy to introduce and require deliberate effort to prevent.

The CISSP framework asks you to think about these problems at a category level: what class of flaw is this, what is its root cause, and what class of control addresses that root cause? That is also a useful way to think as an engineer. Not every code review surfaces a known CVE. But an engineer who recognizes injection patterns, thinks about memory safety tradeoffs in systems code, and considers TOC/TOU risks in concurrent logic is building something materially more defensible than one who does not.

If you are following this series, you have been building toward this view steadily: security is an engineering property, not an audit result. Understanding vulnerability categories is the technical foundation of that stance.

---

*Meta description: CISSP Domain 8 requires recognizing software vulnerability categories — buffer overflows, injection flaws, XSS, CSRF, race conditions, and malicious code. This post explains each root cause and the controls the exam expects you to apply.*

*SEO keywords: CISSP software vulnerabilities, buffer overflow CISSP, injection flaws Domain 8, XSS CSRF CISSP exam, malicious code CISSP study*
