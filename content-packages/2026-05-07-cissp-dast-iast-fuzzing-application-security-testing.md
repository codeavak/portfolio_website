# Content Package: CISSP #56 - DAST, IAST, and Fuzzing

---

## 1. Positioning Summary

This post continues the CISSP Domain 8 series with a focused treatment of dynamic application security testing — DAST, IAST, and fuzzing. It is positioned for engineers who are comfortable with static analysis but less familiar with runtime testing techniques, and for CISSP candidates who need to distinguish between these methods clearly on the exam.

The angle: static analysis is necessary but not sufficient. The post builds a coherent mental model of when each method applies and what each one can and cannot find.

---

## 2. Research Summary

**DAST (Dynamic Application Security Testing)**
- Tests a running application from the outside without requiring source code access
- Black-box approach; simulates external attacker perspective
- Finds: injection flaws, authentication/session weaknesses, runtime misconfigurations
- Common tools: OWASP ZAP, Burp Suite, Nikto
- Best applied in staging/pre-production environments
- Limitation: no visibility into internal code paths; can only observe HTTP-level behavior

**IAST (Interactive Application Security Testing)**
- Deploys an instrumentation agent inside the running application
- Monitors code execution while the application is being tested
- Combines SAST (internal code visibility) with DAST (runtime behavior)
- Lower false positives than either method alone
- Requires compatible instrumentation; introduces some performance overhead
- Best used during integration testing

**Fuzzing**
- Generates unexpected, malformed, or boundary-condition inputs
- Observes crashes, hangs, data leaks, and anomalous behavior
- Coverage-guided fuzzing (AFL, libFuzzer) biases input toward unexplored code paths
- Effective against: file parsers, protocol implementations, serialization handlers, APIs
- Finds: memory safety bugs (native code), unhandled exceptions, input validation gaps
- Not suited for business logic or stateful multi-step workflow testing

**CISSP Domain 8 Context**
- All four methods (SAST, DAST, IAST, fuzzing) appear in Domain 8 (Software Development Security)
- Exam typically tests: which method applies to a given scenario; what each method requires; what each method can and cannot find
- DAST is the most exam-prominent of the dynamic methods

---

## 3. Detailed Blog Post

*(Full post is in `_posts/2026-05-07-cissp-dast-iast-fuzzing-application-security-testing.md`)*

**Title:** CISSP #56: DAST, IAST, and Fuzzing - Application Security Testing Beyond Static Analysis

**Word count:** ~1,450 words

**Sections:**
1. Opening hook — SAST's boundary condition
2. Why Static Analysis Alone Is Not Enough
3. DAST: Testing the Running Application from the Outside
4. IAST: Instrumentation from the Inside
5. Fuzzing: Probing Boundaries with Unexpected Input
6. How These Testing Methods Fit Together
7. What the CISSP Exam Is Likely Testing
8. The Engineering Takeaway

**Images:**
- Hero: DAST scanner probing a running web application from the outside
- Inline-1 (after IAST section): SAST/DAST/IAST comparison showing when each runs and what it observes
- Inline-2 (after fuzzing integration section): Fuzzing pipeline diagram

---

## 4. LinkedIn Post

Static analysis is in most CI pipelines now. It finds real things — hardcoded credentials, dangerous function calls, SQL injection patterns in code.

What it can't do is test the application while it's running.

That's where DAST, IAST, and fuzzing come in — and why the CISSP exam distinguishes them carefully.

**DAST** probes the running app from the outside. No source code needed. It finds what an external attacker would find: authentication gaps, injection points, session issues, and deployment misconfigs.

**IAST** instruments the app from the inside. An agent runs alongside your code during testing and watches what actually executes in response to inputs. Better accuracy, more context.

**Fuzzing** throws unexpected and malformed input at your app and watches what breaks. File parsers, APIs, protocol handlers — fuzzing finds the edge cases that nobody thought to test explicitly.

None of these replaces static analysis. Each one finds a class of vulnerabilities the others miss.

The discipline is using them in sequence: SAST in the build pipeline, DAST in staging, IAST during integration testing, fuzzing against input-handling components.

What's your team's testing stack? Most I've seen still stop at static analysis.

#CISSP #ApplicationSecurity #DevSecOps #SecurityEngineering #DAST

---

## 5. Extra Content Assets

**Social graphic text (for image card):**
```
Testing method   |  Needs source code?  |  Needs running app?
SAST             |  Yes                 |  No
DAST             |  No                  |  Yes
IAST             |  No                  |  Yes (+ agent)
Fuzzing          |  No                  |  Varies
```

**Thread expansion (optional LinkedIn follow-up):**

The most common mistake I see in security testing programs: treating DAST as "the security scan we run before go-live."

DAST is valuable. But running it once, right before deployment, means:
- Issues found at the worst possible time to fix them
- No coverage of staging-only logic
- No fuzzing of edge cases
- No insight into what happens during integration tests

The better model: each testing method has a home in the SDLC. SAST lives in the build. DAST lives in staging. IAST lives in integration testing. Fuzzing runs continuously against your most complex input handlers.

The question is never "which one?" It's "which ones, and where?"

**CISSP exam quick-reference:**
- SAST = code review without running the app (pre-execution)
- DAST = black-box testing against a live app (post-deployment)
- IAST = agent inside the live app (hybrid; during integration testing)
- Fuzzing = unexpected inputs to find crashes and edge cases
- All four fall under Domain 8: Software Development Security
