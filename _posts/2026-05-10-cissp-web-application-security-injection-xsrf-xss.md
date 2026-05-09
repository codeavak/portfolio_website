---
layout: post
title: "CISSP #59: Web Application Security — XSS, CSRF, Injection, and the Boundary Between Code and User Data"
date: 2026-05-10 12:30:00 +0000
categories: [CISSP, Software Development Security, Application Security]
tags:
  [
    CISSP,
    Domain 8,
    Web Application Security,
    XSS,
    CSRF,
    SQL Injection,
    Command Injection,
    Insecure Deserialization,
    OWASP,
    CWE,
  ]
excerpt: "Web applications are where the boundary between code and user data breaks down. XSS, CSRF, injection attacks, and insecure deserialization are not separate vulnerabilities—they are what happens when input and output validation slip. CISSP Domain 8 expects you to see the pattern, not memorize the exploits."
image: /assets/generated/2026/05/cissp-web-application-security-injection-xsrf-xss/hero.svg
---

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-web-application-security-injection-xsrf-xss/hero.svg" alt="Web Application Security: the boundary between code and data, showing input validation, output encoding, and trust boundaries" class="blog-hero" />

Post #57 taught you that secure coding is a discipline. Post #58 showed you why that discipline is non-negotiable in APIs. This post is about what happens when the boundary between code and data collapses in a web application—and why CISSP wants you to understand the pattern, not just memorize vulnerability names.

The core concept is simple: code and data are different things. Code is executable. Data is not. But in web applications, attackers spend enormous energy trying to turn data into code.

## The Pattern: Confusion of Code and Data

Every major web application vulnerability traces back to the same fundamental error: somewhere in the application, data was treated as code.

Your application receives a user's search term. It builds an SQL query by concatenating strings:

```sql
query = "SELECT * FROM users WHERE username = '" + userInput + "'"
```

The developer believed this code would only create data—a query string with a username embedded in it. But the attacker sent `admin' --` as the username. Suddenly, the string is no longer just data. It is code. The query became:

```sql
SELECT * FROM users WHERE username = 'admin' --'
```

The `--` tells the database: treat the rest as a comment. The query now returns the admin account. The boundary collapsed.

This is SQL injection. But it is not unique to databases.

## SQL Injection and Command Injection: Code Execution Through Data

Injection attacks happen wherever the application builds code by concatenating untrusted data.

**SQL Injection** is the most famous case. The attacker embeds SQL syntax into input fields. If the application builds queries using string concatenation instead of parameterized queries, the attacker's input becomes executable SQL.

**Command Injection** follows the same pattern. Your application builds a shell command:

```python
os.system("convert image.png --output " + userFilename)
```

The attacker provides a filename like `test.png; rm -rf /`. The application executes the conversion and then deletes the filesystem. Attackers turned data into shell commands.

**LDAP Injection**, **XPath Injection**, and others follow the same logic: anywhere the application builds code from concatenated data, an attacker can inject syntax that breaks out of the data context.

CISSP's lesson here is clear: parameterized queries, prepared statements, and safe APIs prevent injection because they keep code and data separate. The query structure is defined in code. The data goes into a different channel. An attacker cannot turn their input into executable code because it is never parsed as code.

The control is not: _Check if the user's input looks like SQL._ The control is: _Do not build code from data, ever._

## Cross-Site Scripting (XSS): Executing Code in the Browser

Web applications do not just execute server-side code. They send code to the browser. HTML, JavaScript, CSS—all of it is code that runs on the user's machine.

Cross-Site Scripting (XSS) is what happens when an attacker injects malicious JavaScript into a page that the browser will execute.

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-web-application-security-injection-xsrf-xss/inline-xss.svg" alt="XSS flow: attacker injects script tag, server renders without encoding, browser executes malicious JavaScript" class="blog-hero" />

A user writes a comment: `<script>alert('XSS')</script>`. Your application stores that comment in the database and later displays it on the page. If the application sends it to the browser without encoding it, the browser parses the `<script>` tag and executes the JavaScript. The attacker's code runs in the context of the victim's browser session.

From there, the attacker can:

- Steal the user's session cookie.
- Modify the page to trick the user into entering credentials.
- Redirect to a phishing site.
- Exfiltrate sensitive data visible in the page.

There are three flavors of XSS:

**Stored XSS**: The attacker injects malicious code that is stored in your database and executed every time the page is viewed. This is the most severe because it affects all users.

**Reflected XSS**: The attacker crafts a malicious URL where the payload is in the query string. Your application reflects that parameter back in the response without encoding it. The victim clicks the link, and the attacker's script runs. This requires social engineering but is still critical.

**DOM-based XSS**: Modern JavaScript frameworks manipulate the page using the Document Object Model (DOM). If the application writes user input directly to the DOM without encoding, XSS is possible even if the server never touches the data.

The control is output encoding. Before sending any user-controlled data to the browser, encode it so the browser parses it as text, not code. `<script>` becomes `&lt;script&gt;`. The browser sees the angle brackets as literal characters, not markup.

## CSRF: Making the Browser Attack Itself

Cross-Site Request Forgery (CSRF) is a different kind of attack. The attacker does not inject code. Instead, the attacker tricks the browser into making a request on the attacker's behalf.

Here is the scenario:

Your application has a `POST /transfer-money` endpoint. A user logs in, and the browser stores a session cookie. That cookie is automatically included in every request to your domain.

The attacker creates a webpage and tricks the user into visiting it. On that page, the attacker includes an invisible form:

```html
<form
  action="https://yourapp.com/transfer-money"
  method="POST"
  style="display:none;"
>
  <input name="amount" value="10000" />
  <input name="to-account" value="attacker-account" />
  <input type="submit" />
</form>
<script>
  document.forms[0].submit();
</script>
```

When the user visits the attacker's page, JavaScript automatically submits the form. The browser makes a POST request to your application and automatically includes the session cookie. Your application processes the request and transfers money to the attacker's account.

The user never intended this action. Their browser did it.

<img src="{{ site.baseurl }}/assets/generated/2026/05/cissp-web-application-security-injection-xsrf-xss/inline-csrf.svg" alt="CSRF flow: attacker trick user to visit malicious site, browser makes unwanted request to target site using victim's cookies" class="blog-hero" />

The control is CSRF tokens. Before processing state-changing requests (POST, DELETE, PUT), your application requires the client to send a unique token that:

- Is generated per-user per-session.
- Is not stored in cookies (which the browser sends automatically).
- Must be sent as a form field or header (which cross-origin requests cannot access).

When the form is submitted, the browser includes the token. The attacker's page cannot forge a valid token because the attacker cannot read tokens from your site (same-origin policy). So the transfer does not happen.

The exam often tests the distinction: CSRF tokens protect against requests that come from a different domain. Session cookies alone do not. If your application accepts cross-origin requests without validating a CSRF token, the browser will send the cookie, and the attacker wins.

## Insecure Deserialization: Data That Executes

Serialization is the process of converting an object into bytes so you can store it or send it over a network. Deserialization is the reverse: converting bytes back into an object.

If your application deserializes untrusted data, the attacker can craft bytes that, when deserialized, execute arbitrary code. This is particularly dangerous in languages like Java and Python where serialization formats can include executable instructions.

Example: A Java application deserializes a user-provided object:

```java
ObjectInputStream ois = new ObjectInputStream(userProvidedData);
Object obj = ois.readObject(); // Dangerous
```

If the attacker creates a specially crafted serialized object, the `readObject()` method can trigger code execution. The attacker does not need to break into the application's logic. The deserialization process itself becomes the attack vector.

The control is simple: do not deserialize untrusted data. If you must deserialize, use safe libraries that explicitly allow only whitelisted types. Never use generic deserialization on untrusted input.

## The Exam Perspective: Why CISSP Asks About These

On the CISSP exam, questions about web application security rarely ask: "What is XSS?" Instead, they ask situational questions like:

_Your development team stores user comments in the database and displays them on profile pages. A security review finds that comments are not being HTML-encoded before rendering. What is the primary risk?_

The answer is not just "XSS." The answer is that user-controlled data is being rendered as code, creating a stored XSS vulnerability affecting all users who view the profile.

Or:

_A microservice accepts JSON from external APIs. The team uses a standard JSON deserializer to convert the input into objects. A security team recommends using a JSON schema validator before deserialization. What is the primary concern being addressed?_

The answer is insecure deserialization. The control is input validation and schema enforcement, not just trusting that deserializing is safe.

CISSP questions test whether you understand the control—not just the vulnerability name.

## The Pattern Holds

Look at the progression:

- **Injection attacks**: Code and data are confused because the application builds code from concatenated data.
- **XSS**: Code and data are confused in the browser because the application sends user data as markup or JavaScript.
- **CSRF**: The application trusts the browser to enforce same-origin policy and authenticate requests based only on cookies.
- **Insecure Deserialization**: Code and data are confused because the application deserializes untrusted bytes.

Every single one traces back to the same principle: _Control where the boundary is between code and data, and control what gets executed._

The secure coding practices from Post #57 are the controls:

- Input validation: Know what you expect.
- Output encoding: Ensure data stays data.
- Parameterized queries: Keep code and data separate.
- Secure deserialization: Do not execute untrusted input.

The API security practices from Post #58 apply here too:

- Authentication and authorization: Know who is making the request.
- Logging and monitoring: Detect when the boundaries are breached.
- Rate limiting: Prevent attackers from trying thousands of payloads.

Web application security is not a separate domain. It is the discipline of secure coding applied to the web boundary—where user input becomes HTML, JavaScript, and database queries.

On the CISSP exam, when you see a web application security question, ask yourself: _Where is the boundary between code and data, and is the application protecting it?_

---

_Post 59 of 60 in my CISSP study series._

---

**Meta description:** CISSP #59 explains web application security: XSS, CSRF, SQL injection, command injection, and insecure deserialization as failures to maintain the boundary between code and data.

**5 SEO keyword ideas:**

1. CISSP web application security XSS CSRF injection
2. SQL injection and command injection prevention
3. Cross-site scripting and cross-site request forgery
4. Insecure deserialization vulnerability CISSP
5. Web application security controls OWASP CISSP Domain 8
