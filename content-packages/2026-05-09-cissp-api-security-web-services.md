# CISSP #58: API Security and Web Service Security Content Package

## Positioning Summary

APIs are the interface between applications and attackers. Post #57 covered secure coding practices—input validation, error handling, authorization logic. This post shows how those principles apply to APIs, where the attack surface is public, the stakes are high, and the mistakes are predictable.

CISSP Domain 8 expects you to understand that securing an API is not separate from securing the application. It is securing the application where it is most exposed.

---

## Research Summary

**API Security Landscape**

- APIs have become the primary interface for application interaction (internal, partner, public)
- API attacks target authentication bypass, data exposure, injection, rate limiting failures, broken error handling
- OWASP Top 10 for APIs (2023) identifies the most critical risks
- CISSP Domain 8 treats APIs as a direct extension of application security

**CISSP Coverage Areas**

- Authentication and authorization specifically for API consumers
- Rate limiting and abuse prevention
- Input validation at API boundaries
- Secrets management (API keys, tokens, credentials)
- Monitoring and logging API access
- Error handling and information disclosure
- Injection attacks (SQL, XML, command) through API parameters
- Data classification and what should/should not be exposed

**Key Distinction**

- API security is not a separate practice; it is application security applied at the integration point
- APIs inherit all the secure coding practices but add: consumer authentication, rate limiting, abuse detection, tight output control

---

## Detailed Blog Post

### CISSP #58: API Security and Web Service Security — Where Your Code Meets Attackers

#### The API is Your Attack Surface

Every application has a network boundary. When that boundary is an API, it becomes a public invitation for testing.

Not testing in the good sense. Testing in the sense of: _Here is a documented interface. Let me see what happens when I send it bad data. Let me see what happens when I do it a thousand times a second. Let me see what the error messages reveal._

APIs are where secure coding practices meet attackers directly. A field that accepts a phone number is now accepting a phone number from anyone with network access. Code that handles empty input is now handling empty input from adversaries. An error message that reveals your database schema is now visible to the internet.

Post #57 taught you input validation, error handling, and authorization logic. This post shows why those practices are non-negotiable in APIs and what breaks when they slip.

#### Authentication: You Cannot Authorize Without It

Here is a distinction CISSP makes clear: authentication and authorization are not the same thing.

Authentication answers: _Are you who you claim to be?_
Authorization answers: _What are you allowed to do?_

APIs fail when either one is weak. But authentication failures in APIs are particularly costly because APIs are often the last gate before data.

**API Key Mismanagement**
Many teams treat API keys as passwords with infinite lifetime. That is a mistake.

An API key that:

- Never expires makes compromise permanent
- Is shared across multiple clients makes it impossible to revoke one without breaking others
- Is stored in source code or configuration files leaks at scale
- Is logged in error messages or monitoring means every log server becomes a secret store

CISSP expects you to understand that API keys are credentials. They require the same lifecycle management, rotation, and protection as passwords.

**OAuth and Token-Based Auth**
In contrast to static API keys, OAuth and bearer tokens add:

- Token expiration (forcing regular refresh)
- Scoped permissions (not all-or-nothing access)
- The ability to revoke a token without invalidating all others
- Support for refresh tokens (so access tokens can be short-lived)

But tokens are only secure if:

- They are short-lived (minutes to hours, not days)
- The refresh token is protected as carefully as a password
- The token is never transmitted over plain HTTP
- The client does not store the token in browser localStorage (vulnerable to XSS)

#### Authorization: Not Missing, Not Broken

Once you know who the API consumer is, the next question is: what can they do?

The authorization failures in APIs follow the same patterns as in applications, but they are exposed more visibly:

**Broken Object-Level Authorization**
An API endpoint might be `/api/users/{id}/profile`. A common mistake: trusting that the `id` parameter is the intended user.

```
GET /api/users/5/profile → returns user 5's data
GET /api/users/6/profile → if not authorized, returns user 6's data anyway
```

This is trivial for an attacker to exploit. Change the ID in the URL and see what data is accessible.

CISSP calls this broken access control. The fix: every API endpoint must validate that the authenticated user has permission to access the specific resource, regardless of what the parameter claims.

**Missing Authorization Context**
Some endpoints have no meaningful authorization at all.

```
POST /api/invoices/{id}/send
```

Who can send an invoice? The owner? Any authenticated user? The system should check. If it does not, anyone with a valid authentication token can send anyone's invoices.

This is why CISSP emphasizes that authorization decisions belong in code, not in infrastructure. A firewall cannot tell if user A is authorized to modify user B's record. Only the application knows.

**Default Deny**
The CISSP principle of least privilege applies directly: if authorization is not explicitly granted, it should be denied.

Do not ask: "Is the user authorized?" Ask: "Has this user been explicitly authorized for this action?" If the answer is not a clear yes, the answer is no.

#### Data Exposure: APIs as Information Disclosure

APIs are excellent at returning data. That is their purpose. But they are often too excellent at it.

**Excessive Data Exposure**
An API endpoint returns user data:

```json
{
  "id": 12345,
  "email": "user@example.com",
  "phone": "555-0123",
  "password_hash": "bcrypt$...",
  "internal_id": "INT-98765",
  "credit_card_last_four": "4111",
  "payment_token": "stripe_pm_...",
  "admin_notes": "Angry customer, high risk",
  "ip_logs": [...]
}
```

How much of that should be exposed to the API consumer?

If the API is for the user to view their own profile, maybe they need email and phone. They do not need the password hash, internal ID, credit card token, or admin notes.

If the API is for an app to display a list of users, it should return even less: just name and ID.

CISSP calls this data classification in action. The application should return only what the consumer is authorized to see and what they actually need. Not everything the database contains.

**Error Messages as Information Disclosure**
An API receives a malformed request. What should it return?

Bad: `{"error": "SQL syntax error near 'users' table"}`
Better: `{"error": "Invalid request parameters"}`

The first one reveals your database schema. The second one tells the client nothing useful and an attacker nothing either.

Errors should be specific enough for legitimate clients to debug (include a request ID so support can look up what happened) and generic enough that attackers learn nothing about the system.

#### Rate Limiting: Preventing Abuse

APIs are fast. They are too fast. An attacker can make 10,000 requests per second to your authentication endpoint testing passwords, or to your data endpoint enumerating user IDs.

Rate limiting is not optional for public APIs. It is a security control.

**Effective Rate Limiting**

- Limits per authenticated user (if a user is abusing, cut them off)
- Limits per IP address (catches unauthenticated scanning)
- Limits per endpoint (testing passwords might be limited more tightly than fetching public data)
- Graceful degradation (tell the client they have hit the limit and when they can try again)

Without rate limiting, an attacker can:

- Brute-force authentication tokens or API keys
- Enumerate all user IDs by testing `/api/users/{id}` for IDs 1 through 1 million
- Extract data from endpoints that return partial results by requesting millions of pages
- Exhaust your infrastructure in a denial-of-service attack

Rate limiting makes these attacks so expensive that they are not worth the attacker's time.

#### Input Validation at API Boundaries

Post #57 covered input validation as a practice. In APIs, it is non-negotiable.

Every parameter—whether in the URL, query string, request body, or headers—is untrusted input. If your code trusts it, you have a vulnerability.

**Injection Attacks Through APIs**
An API that accepts a search parameter:

```
GET /api/users?name=alice
```

If the name is directly inserted into a SQL query without parameterization:

```sql
SELECT * FROM users WHERE name = 'alice'
```

An attacker sends:

```
GET /api/users?name='; DROP TABLE users; --
```

And the query becomes:

```sql
SELECT * FROM users WHERE name = ''; DROP TABLE users; --
```

Parameterized queries prevent this. So do input validation (whitelist what characters are allowed in a name) and output encoding (escape special characters before inserting into queries).

The vulnerability is the same as in #57. The attack surface is just more visible because the API is public.

#### Monitoring and Logging APIs

You cannot secure what you do not observe.

**What to Log**

- Every authentication attempt (successful and failed)
- Every authorization decision (especially failures)
- Unusual patterns (a single user accessing thousands of records, an IP making requests at rates that suggest scanning)
- Errors and exceptions (especially those that might indicate attack attempts)

**What NOT to Log**

- Authentication tokens or API keys (defeats the purpose of protecting them)
- User passwords or sensitive data (creates a secondary exposure point)
- Full request bodies if they contain secrets (use masking or sampling instead)

**Detection Patterns**
Legitimate API use follows patterns. Abusive use deviates:

- A user who normally makes 100 requests per day suddenly makes 100,000
- An API consumer requesting data for users outside their organization
- Multiple failed authentication attempts followed by a successful one (credential guessing)
- Rate of errors suddenly spiking (indicates either an attack or a bug)

These patterns become your first line of defense because they often catch attacks before damage is done.

#### The CISSP Perspective

CISSP Domain 8 treats APIs not as a separate security problem but as an application security problem applied at a public interface.

The principles are the same as post #57:

- Input validation (verify every parameter)
- Authorization (check every access)
- Error handling (reveal nothing dangerous)
- Logging (know what happened)

The stakes are higher because APIs are network-facing. The attacker is not a disgruntled insider with console access. The attacker is anyone on the internet testing your boundaries.

The discipline required is identical. The consequences of skipping it are visible faster.

#### Key Takeaways

1. **Authentication is necessary but not sufficient.** Prove who you are, then prove you are authorized for what you are asking.

2. **Rate limiting is a security control.** Without it, an attacker can test passwords at scale, enumerate data, or exhaust your infrastructure.

3. **Every parameter is untrusted.** Validate at the boundary. Do not trust the client.

4. **Return only what is necessary.** Do not expose internal IDs, configuration data, or sensitive fields just because the database has them.

5. **Monitor for patterns.** Legitimate API use is predictable. Abnormal patterns are your early warning system.

6. **Errors are secrets.** Reveal nothing about your architecture, database, or infrastructure in error messages.

APIs are where secure coding practices meet the network. When they meet attackers, the cost of shortcuts becomes clear. CISSP expects you to treat API security not as an afterthought, but as a direct application of secure development principles.

---

## LinkedIn Post

The API is your application's front door. And just like a front door, it needs security.

Post #57 covered secure coding practices: input validation, authorization, error handling. Those principles are critical in every part of your code. But they are _essential_ at API boundaries, where code meets attackers directly.

Here's what breaks:

- APIs that accept input without validation (injection attacks)
- APIs that return more data than the consumer should see (data exposure)
- APIs with weak authentication or missing authorization checks
- APIs without rate limiting (brute-force, enumeration, abuse)
- Error messages that reveal database schema or internal structure

And here's what matters: API security is not a separate problem. It is application security applied at the most exposed interface.

CISSP Domain 8 expects you to understand that you cannot separate coding discipline from API design. Input validation, output encoding, authorization logic, error handling—they all apply. The consequences of skipping them are just more visible.

The strongest teams treat every API endpoint as if a security auditor is testing it right now. Because they are.

**What's your experience with APIs? Do you see these failures in real systems?**

#CISSP #APISecurity #ApplicationSecurity #DomainExpertise

---

## Extra Content Assets

### Common API Vulnerabilities Quick Reference

1. Broken Authentication – weak/missing API key/token management
2. Broken Object-Level Authorization – accessing resources you do not own
3. Excessive Data Exposure – returning more fields than necessary
4. Lack of Rate Limiting – allowing brute force, enumeration, DoS
5. Broken Function-Level Authorization – accessing functions you are not authorized for
6. Injection Attacks – SQL, command, XML injection through parameters
7. Improper Asset Management – exposed API documentation, versioning issues
8. Insufficient Logging and Monitoring – cannot detect attacks in progress

### API Security Checklist

- [ ] Every parameter is validated (whitelist, not blacklist)
- [ ] Authentication is required and tokens/keys are properly managed
- [ ] Authorization is checked on every endpoint (not just at infrastructure level)
- [ ] Rate limiting is implemented per user and per IP
- [ ] API returns only data the consumer is authorized to see
- [ ] Error messages reveal nothing about system architecture
- [ ] All requests are logged (including failed auth attempts)
- [ ] Unusual patterns are monitored and alerted
- [ ] API documentation does not leak secrets
- [ ] Tokens/keys are never stored in code or config files

---

## Meta Description (for blog post)

"APIs are where secure coding practices meet attackers. CISSP Domain 8 expects you to understand authentication, authorization, rate limiting, and data exposure as critical security controls—not as options."

## SEO Keywords

1. API security best practices
2. Web service security CISSP
3. API authentication and authorization
4. Rate limiting and abuse prevention
5. API data exposure risks
