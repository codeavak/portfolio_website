---
layout: post
title: "SQL Injection in 2026: Still Real, Just Better Hidden"
date: 2026-03-29 00:10:00 -0700
categories:
  - Security
  - Software Engineering
  - SQL
tags:
  - sql injection
  - owasp
  - secure coding
  - database security
  - orm
excerpt: "SQL injection did not disappear when teams adopted parameterized queries. It moved into dynamic ORDER BY clauses, dynamic identifiers, ORM interpolation paths, and stored procedures that quietly build dynamic SQL."
image: "/assets/generated/2026/03/sql-injection-2026-hidden-risks/hero.png"
---

A lot of teams treat SQL injection as a solved 2005 problem. They know to parameterize values, they use modern ORMs, and they assume the category is mostly handled by defaults.

That confidence is understandable. It is also where the risk hides.

In 2026, SQL injection still shows up in production systems. It just rarely appears as obvious `WHERE id = '" + input + "'` code anymore. It appears in dynamic sorting, dynamic identifiers, convenience interpolation in ORM escape hatches, and stored procedures that build dynamic SQL internally.

<figure class="post-figure">
  <img src="{{ site.baseurl }}/assets/generated/2026/03/sql-injection-2026-hidden-risks/hero.png" alt="Diagram showing modern SQL injection paths: dynamic ORDER BY, dynamic table names, ORM raw SQL interpolation, and stored procedures with dynamic SQL." />
  <figcaption>Most modern SQL injection issues are design and review failures, not lack-of-awareness failures.</figcaption>
</figure>

OWASP's guidance is still clear: injection remains a core risk category, and primary defenses are still parameterization, allow-list validation, and safe query construction patterns. The difference is where disciplined teams still slip.

## Why "we use parameters" is not enough {#not-enough}

Parameterized queries protect data values. They do not automatically protect SQL syntax elements.

That distinction matters.

When an attacker controls a value like `@UserId`, parameters are the correct defense because the database treats the value as data, not executable SQL. But some parts of a SQL statement are not values and cannot be parameterized in the same way:

- Column names
- Table names
- Sort direction (`ASC` / `DESC`)
- SQL keywords and fragments

As soon as code starts composing those pieces dynamically, you leave the safety of value parameterization and enter a territory where allow-listing and strict query shape control are mandatory.

This is exactly where many "we already fixed injection" systems are still exposed.

## Where teams still get it wrong {#where-it-hides}

### 1) Dynamic ORDER BY clauses {#dynamic-order-by}

Sorting is one of the most common places engineers accidentally create SQL injection surface.

A typical pattern looks like this:

```csharp
// Vulnerable pattern
var sql = $@"
SELECT Id, Name, CreatedAt
FROM Users
ORDER BY {sortColumn} {sortDirection}";

var users = await connection.QueryAsync<User>(sql);
```

Even if `WHERE` predicates elsewhere are parameterized, this query is injectable because `sortColumn` and `sortDirection` are inserted as SQL syntax.

Safer pattern:

```csharp
var allowedColumns = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
{
    ["name"] = "Name",
    ["created"] = "CreatedAt",
    ["email"] = "Email"
};

var safeColumn = allowedColumns.TryGetValue(sortBy ?? "created", out var col)
    ? col
    : "CreatedAt";

var safeDirection = string.Equals(direction, "asc", StringComparison.OrdinalIgnoreCase)
    ? "ASC"
    : "DESC";

var sql = $@"
SELECT Id, Name, CreatedAt
FROM Users
ORDER BY {safeColumn} {safeDirection}";
```

This still uses string interpolation, but only after mapping input through a strict allow-list to known static SQL tokens.

<figure class="post-figure">
  <img src="{{ site.baseurl }}/assets/generated/2026/03/sql-injection-2026-hidden-risks/dynamic-order-by.png" alt="Before-and-after diagram of dynamic ORDER BY handling showing unsafe direct interpolation versus allow-listed column and direction mapping." />
  <figcaption>For SQL syntax fragments, allow-listing is the defense. Parameterization is not enough.</figcaption>
</figure>

### 2) Dynamic table names and schema selectors {#dynamic-identifiers}

Multi-tenant or reporting systems often need to target different datasets. Teams sometimes model this as user-supplied table or schema names.

```sql
SELECT * FROM ${tableName} WHERE TenantId = @TenantId
```

This is high-risk unless `tableName` comes from a controlled internal mapping and never directly from user input. In practice, the safe approach is one of these:

- Route through predefined query paths per dataset
- Resolve logical names to physical identifiers in server-side code
- Reject unknown identifiers and never pass raw input through

If a design requires dynamic identifiers, treat identifier resolution as a security-critical component with unit tests and logging, not as a small string helper.

### 3) String interpolation in ORM "raw SQL" paths {#orm-interpolation}

Modern ORMs reduce injection risk by default when you stay inside their query APIs. The sharp edge appears when developers step into raw SQL convenience methods.

For example in EF Core, the safe and unsafe paths look similar at a glance:

- `FromSqlInterpolated(...)` can parameterize interpolated values safely
- `FromSqlRaw(...)` executes raw SQL text and can be dangerous when combined with interpolation

The same pattern exists in many ecosystems: there is a safe parameterized method and a lower-level raw method. Under deadline pressure, teams choose the flexible one and move on.

The core rule is simple: if you are in a raw SQL API, verify exactly how parameters are bound. Do not assume because the API name includes "SQL" that interpolation is safe.

### 4) Stored procedures that build dynamic SQL internally {#stored-proc-dynamic-sql}

"We only call stored procedures" is often treated as proof against SQL injection. It is not.

Stored procedures are safe when they use static SQL and typed parameters. They become risky when they concatenate input into dynamic SQL strings.

```sql
CREATE PROCEDURE dbo.SearchUsers
  @SortColumn NVARCHAR(50)
AS
BEGIN
  DECLARE @sql NVARCHAR(MAX) =
    N'SELECT Id, Name, Email FROM dbo.Users ORDER BY ' + @SortColumn;

  EXEC(@sql);
END
```

This can be exploitable exactly like application-side concatenation.

If dynamic SQL is required in SQL Server, use `sp_executesql` with parameters for values and an allow-list for identifiers. OWASP's cheat sheet and SQL Server security guidance are aligned on this point: dynamic SQL is not forbidden, but unconstrained dynamic SQL is a direct injection vector.

## How ORMs create false confidence {#false-confidence}

ORM adoption removes a lot of accidental risk. It can also create blind spots.

The blind spot is governance, not tooling.

Teams assume:

- "The ORM handles this"
- "This code path is internal"
- "It is only an admin endpoint"
- "The user cannot realistically send that value"

Attackers do not care whether a route is elegant or legacy. They care whether untrusted input can influence executable SQL shape.

The most useful mindset is this:

- ORM-managed query builders reduce exposure
- Escape hatches reintroduce exposure
- Any place query shape is dynamic needs explicit review

That framing keeps teams practical. You can use ORMs and raw SQL responsibly. You just cannot treat either as automatic proof of safety.

## Practical review checklist for SQL injection surface {#checklist}

Use this checklist in code reviews, security reviews, and production incident hardening.

1. **Find all query construction paths**
   Search for raw SQL APIs, command text assignment, string interpolation, and stored procedure calls.

2. **Classify each dynamic input by role**
   Is it a value, identifier, keyword, or query fragment? Values should be parameterized. Non-values should come from strict allow-lists.

3. **Verify API semantics, not assumptions**
   Confirm whether the specific method call binds parameters safely (`Raw` vs `Interpolated`, positional vs named parameter APIs, etc.).

4. **Review stored procedures for internal dynamic SQL**
   Stored procedure boundaries are not trust boundaries. Inspect for concatenation, `EXEC(@sql)`, and unvalidated identifiers.

5. **Check dynamic ORDER BY / filter / pagination builders**
   These are common injection points because they feel "not dangerous" compared to `WHERE` values.

6. **Validate error handling and logging**
   Avoid leaking SQL details in responses. Log enough context for investigation without exposing secrets.

7. **Test with malicious payloads in integration tests**
   Include payloads in sort fields, filter operators, and identifier-like parameters. Do not test only value fields.

8. **Map findings to OWASP guidance**
   Use OWASP SQL Injection Prevention Cheat Sheet controls as acceptance criteria: parameterization, allow-listing, least privilege, and defense in depth.

<figure class="post-figure">
  <img src="{{ site.baseurl }}/assets/generated/2026/03/sql-injection-2026-hidden-risks/review-checklist.png" alt="Checklist-style visual for reviewing SQL injection surface in modern applications." />
  <figcaption>Security reviews improve when injection checks are systematic instead of intuition-driven.</figcaption>
</figure>

## A practical rule of thumb {#rule-of-thumb}

If user input can influence SQL **shape**, stop and design the control explicitly.

- SQL values: parameterize
- SQL identifiers and keywords: allow-list map to known tokens
- Dynamic SQL: constrain, parameterize values, and audit aggressively

This is not alarmism. It is just engineering discipline applied where modern systems still fail.

SQL injection in 2026 is less visible than it used to be, but not less real. The teams that avoid it are not the teams with the fanciest stack. They are the teams that treat query construction as a security-critical part of application design.

---
<!-- 
*If this was useful, the next security-focused post will go deeper on code review patterns for catching AI-assisted security bugs before they ship.*

---

**Meta description:** SQL injection is still a live risk in 2026, especially in dynamic ORDER BY, identifier handling, ORM raw SQL paths, and stored procedures with dynamic SQL. Practical checklist included.

**SEO keywords:**
- SQL injection 2026
- dynamic ORDER BY SQL injection
- ORM raw SQL injection risks
- OWASP SQL injection prevention checklist
- stored procedure dynamic SQL security -->
