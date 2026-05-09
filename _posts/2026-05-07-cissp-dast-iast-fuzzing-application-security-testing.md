---
layout: post
title: "CISSP #56: DAST, IAST, and Fuzzing - Application Security Testing Beyond Static Analysis"
date: 2026-05-07 14:30:00 +0000
categories: [cissp, security]
tags:
  [
    cissp,
    dast,
    iast,
    fuzzing,
    application-security,
    security-testing,
    domain8,
    sdlc,
  ]
excerpt: "Static analysis catches code patterns. It cannot test what happens when the application is actually running. DAST, IAST, and fuzzing fill that gap — and the CISSP exam expects you to know the difference."
image: /assets/generated/2026/05/cissp-dast-iast-fuzzing-application-security-testing/hero.svg
---

Static analysis has become a standard part of most modern CI pipelines. Linters run on commit. SAST tools flag risky patterns before the build finishes. That is meaningful progress.

But static analysis only sees the code as text. It cannot observe what happens when the application is actually running — how it handles unexpected input, whether authentication logic can be bypassed, or whether a deployed API behaves the way the code suggests it should.

DAST, IAST, and fuzzing address that gap. The CISSP exam tests these concepts directly, and understanding the distinction between them is more useful than memorizing definitions.

![DAST scanner probing a running web application from the outside](/assets/generated/2026/05/cissp-dast-iast-fuzzing-application-security-testing/hero.svg)

---

## Why Static Analysis Alone Is Not Enough

SAST (Static Application Security Testing) operates on source code, bytecode, or binaries before execution. It is fast, integrates early in the SDLC, and catches a real class of vulnerabilities: hardcoded credentials, SQL string concatenation, dangerous function calls, and similar code-level patterns.

What it cannot do is simulate a real attacker interacting with a running system. It has no visibility into how the application behaves at runtime, how session tokens are issued and validated, how business logic responds to unexpected sequences of requests, or what an endpoint actually returns when given malformed input.

That is not a flaw in SAST. It is a boundary condition. The tools are doing what they are designed to do. The error is treating them as a complete testing program rather than one layer of it.

---

## DAST: Testing the Running Application from the Outside

Dynamic Application Security Testing operates against a running application. The tester — or the automated tool — sends HTTP requests, examines responses, and infers vulnerabilities from observable behavior. No source code access is required.

This black-box perspective makes DAST uniquely capable of finding things that static analysis structurally cannot: authentication weaknesses, session management flaws, injection vulnerabilities that only manifest at runtime, security misconfigurations in the deployed environment, and issues introduced by the hosting infrastructure.

DAST is most effective in staging and pre-production environments, after the application is fully assembled. Tools like OWASP ZAP and Burp Suite are widely used for this purpose.

The limitation is the inverse of SAST's strength. DAST has no visibility into internal code paths. It can only probe what is externally observable. Logic errors buried in server-side code that never surface through HTTP responses may be invisible to DAST entirely.

---

## IAST: Instrumentation from the Inside

Interactive Application Security Testing takes a different approach. An agent is deployed inside the running application — typically as a library or framework plugin — and monitors the application from within as tests are executed against it.

Because IAST has visibility into both the inbound requests and the internal code execution responding to them, it combines characteristics of SAST and DAST. It can observe which lines of code are executed in response to a particular input, trace tainted data flows from input through processing to output, and flag vulnerabilities with more context than either static or dynamic analysis alone.

![Comparison of when SAST, DAST, and IAST run in the SDLC and what each observes](/assets/generated/2026/05/cissp-dast-iast-fuzzing-application-security-testing/inline-1.svg)

The trade-off is complexity. IAST requires instrumentation that must be compatible with the application's runtime and framework. It typically runs during integration testing rather than in production. Some implementations introduce performance overhead that makes them unsuitable for production environments without careful configuration.

For the CISSP exam, the key distinction is that IAST requires an agent inside the running application and provides a hybrid perspective that neither SAST nor DAST can deliver independently.

---

## Fuzzing: Probing Boundaries with Unexpected Input

Fuzzing takes a fundamentally different approach from all three. Rather than analyzing code or sending well-formed requests, a fuzzer generates large volumes of unexpected, malformed, random, or boundary-condition input and observes whether the application crashes, hangs, leaks data, or behaves in ways it should not.

The goal is not to confirm that expected inputs produce expected outputs. It is to discover what happens when the application encounters input it was not designed to handle gracefully.

Modern coverage-guided fuzzers — like AFL and libFuzzer — use instrumentation to track which code paths an input exercises and bias subsequent input generation toward unexplored paths. This makes them substantially more effective than purely random fuzzing at finding edge cases in complex code.

Fuzzing is particularly effective against file parsers, protocol implementations, serialization handlers, and APIs that process structured input. It excels at finding memory safety issues in native code: buffer overflows, use-after-free conditions, null pointer dereferences. In higher-level languages, it surfaces logic errors, unhandled exceptions, and input validation gaps.

It is less suited to testing application-level business logic, authentication flows, or stateful multi-step workflows. Those require testers who understand the application's intended behavior.

---

## How These Testing Methods Fit Together

A mature application security testing program is not a choice between these methods. It is a sequenced combination of them applied at appropriate stages.

SAST belongs early — in the IDE, on commit, or in the CI build. It catches vulnerabilities before they travel any further down the pipeline.

DAST belongs in staging and pre-production. Once the application is assembled and deployed in an environment that approximates production, DAST can probe it the way an external attacker would.

IAST belongs during integration testing, where an instrumented application is exercised by automated test suites or manual exploratory testing. The agent adds observability without requiring a separate scanning phase.

Fuzzing belongs wherever the application processes structured external input: APIs, file upload handlers, message parsers, serialization boundaries. It can run continuously in a dedicated fuzzing environment against interface targets.

No single method finds everything. SAST misses runtime behavior. DAST misses internal logic. IAST requires compatible instrumentation. Fuzzing cannot test business logic. The question for any program is: what are we not testing, and what does that leave exposed?

![Fuzzing pipeline showing input generation, target application, and anomaly detection](/assets/generated/2026/05/cissp-dast-iast-fuzzing-application-security-testing/inline-2.svg)

---

## What the CISSP Exam Is Likely Testing

The exam distinguishes clearly between SAST, DAST, IAST, and fuzzing. Expect questions that require you to identify which method applies to a given scenario.

The key distinguishing facts:

- **SAST** operates on source code or binaries before execution. No running application required. Finds code-level patterns.
- **DAST** operates against a running application from the outside. No source code required. Finds runtime behavior vulnerabilities.
- **IAST** uses an agent inside the running application. Requires instrumentation. Combines internal code visibility with runtime behavior.
- **Fuzzing** sends unexpected or malformed input to find crashes and unexpected behavior. Effective against parsers, protocols, and input-handling code.

DAST appears most frequently in exam questions. Know that it requires a running application, operates from the outside, and is appropriate for testing deployed systems rather than source code.

Domain 8 situates these techniques within the secure SDLC. The exam may ask which technique is most appropriate at a given phase of development, or which method would identify a specific class of vulnerability.

---

## The Engineering Takeaway

The engineers who benefit most from understanding these techniques are not the ones building a dedicated security testing team — they are the ones deciding what their CI/CD pipeline should do before code ships.

Static analysis in the build pipeline is a reasonable floor. DAST in staging before any production deployment raises it meaningfully. Fuzzing against APIs and parsers finds the edge cases that neither method would surface.

The broader discipline here is the same as defense in depth applied to testing: no single control is sufficient, no single method covers everything, and the gaps between methods are exactly where vulnerabilities tend to live.

---

_Meta description: DAST tests running applications from the outside. IAST instruments them from within. Fuzzing probes with unexpected input. This post explains how each works, when to use them, and what the CISSP exam tests on dynamic application security testing._

_SEO keywords: DAST vs SAST CISSP, dynamic application security testing, IAST instrumented testing, fuzzing security testing, CISSP Domain 8 application security testing_
