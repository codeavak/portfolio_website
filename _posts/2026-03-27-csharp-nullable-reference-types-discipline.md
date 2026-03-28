---
layout: post
title: "C# Nullable Reference Types: Real Discipline vs Annotation Theater"
date: 2026-03-27 06:00:00 -0700
categories:
  - Software Engineering
  - C#
  - .NET
tags:
  - csharp
  - nullable reference types
  - dotnet
  - code quality
  - domain design
excerpt: "Most teams enabled nullable reference types and then used the null-forgiving operator to silence the warnings. That is not discipline. It is annotation theater with extra steps."
image: "/assets/generated/2026/03/csharp-nullable-reference-types-discipline/hero.svg"
---

Most teams followed the same script after upgrading to .NET 6 or later. They opened the project file, set `<Nullable>enable</Nullable>`, and watched the compiler light up with hundreds of warnings. Then, under deadline pressure, they plastered `= null!` and `!` operators across the codebase until the warnings went away.

The feature was technically enabled. The warnings were technically resolved. The actual null-safety was largely unchanged.

That is annotation theater: the visual appearance of discipline without the underlying design.

<figure class="post-figure">
  <img src="{{ site.baseurl }}/assets/generated/2026/03/csharp-nullable-reference-types-discipline/hero.svg" alt="Code diagram contrasting null-forgiving operator suppression with disciplined nullable design in C#." />
  <figcaption>Enabling the feature and silencing the warnings are two different things.</figcaption>
</figure>

## What nullable reference types actually give you {#what-nrts-give-you}

Nullable reference types are a static analysis contract, not a runtime enforcement mechanism. The compiler tracks nullability through your code and tells you where you have made a promise you cannot keep.

When you declare `string Name`, you are telling the compiler — and every developer who reads that code — that `Name` will never be null. When you declare `string? Description`, you are acknowledging that absence is a legitimate state for that value. That is useful information encoded in the type system, where it cannot go stale the way a comment can.

The concrete benefits are real when you use the feature with intent:

- **API boundaries become honest.** A method signature of `Customer? FindById(int id)` communicates that the caller must handle the not-found case. The compiler enforces that they do.
- **Flow analysis catches real mistakes.** Branching on null, reassigning a nullable to a non-nullable without checking, returning null from a method declared to return a non-nullable — the compiler finds these before the runtime does.
- **The type annotation is documentation that compiles.** In a `string Name` property on a domain entity, the non-nullability is a domain assertion. That entity does not exist in a valid state without a name.

The key word is intent. The compiler is only as useful as the meaning you put behind your annotations.

## Why null-forgiving operators defeat the purpose {#null-forgiving-theater}

The null-forgiving operator `!` tells the compiler: "I know you're uncertain about this, but trust me." The compiler stops warning you. Nothing else changes.

```csharp
// This compiles cleanly with no warnings.
// It will throw a NullReferenceException at runtime if Name was never assigned.
public class Customer
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
}
```

`= null!` is not an idiom for "I'll fill this in later." It is a suppression. You have removed the warning without resolving the condition that triggered it. The object can now be constructed with no name and no email, and the compiler will not tell you until the production exception report does.

The same problem appears in method bodies:

```csharp
public void SendWelcome()
{
    // The compiler is satisfied. The runtime is not impressed.
    var greeting = "Welcome, " + _customer.Name!.ToUpper();
}
```

Sprinkling `!` throughout a codebase is a way of accumulating technical debt that looks like it has been paid off. Every suppressed warning is a decision deferred to production.

## Wrong vs right: a direct comparison {#code-comparison}

The wrong approach treats nullability annotations as a migration tax to be minimized:

```csharp
// Wrong: annotations silenced, design unchanged
public class OrderService
{
    private readonly IOrderRepository _repository = null!;
    private readonly IEmailService _emailService = null!;

    public void ProcessOrder(int orderId)
    {
        var order = _repository!.GetById(orderId);
        if (order != null)
        {
            _emailService!.SendConfirmation(order.CustomerEmail!);
        }
    }
}
```

Every `!` here is a deferred null check. The constructor never ran. The dependencies might be null. The method body checks `order != null` but trusts `CustomerEmail` unconditionally.

The right approach uses constructor injection to establish validity at creation:

```csharp
// Right: validity guaranteed at construction
public class OrderService
{
    private readonly IOrderRepository _repository;
    private readonly IEmailService _emailService;

    public OrderService(IOrderRepository repository, IEmailService emailService)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
    }

    public void ProcessOrder(int orderId)
    {
        var order = _repository.GetById(orderId);
        if (order is null) return;

        _emailService.SendConfirmation(order.CustomerEmail);
    }
}
```

No `!` operators. No `null!` initializers. The compiler is satisfied because the design is correct, not because the analysis was suppressed. If a caller passes a null dependency, they get an `ArgumentNullException` immediately at the injection site — the clearest possible signal.

## Constructor injection: validity at creation {#constructor-injection}

The principle behind the right approach is simple. An object should either exist in a valid state or not exist at all. If a class requires non-null collaborators to function, enforce that at construction.

This works equally well with record types:

```csharp
// The compiler guarantees Name and Email are non-null everywhere this is used.
public record Customer(string Name, string Email);
```

Records are particularly well-suited here. Their concise syntax and immutability combine naturally with the non-nullability contract. A `Customer` record is always a `Customer` with a real name and a real email. There is no half-constructed state.

For mutable entities, the `required` keyword introduced in C# 11 provides similar guarantees without requiring a constructor argument for every property:

```csharp
public class ShippingAddress
{
    public required string Street { get; init; }
    public required string City { get; init; }
    public string? Apartment { get; init; }  // legitimately optional
}
```

`required` properties must be set in object initializers. The compiler enforces it. `Apartment` is `string?` because a shipping address genuinely might not have one — that is an honest modeling choice, not a suppression.

## Factory methods: honest creation that can fail {#factory-methods}

Constructor injection works well when you control the inputs. When creation might fail — for example, when parsing external data — factory methods let you be explicit about the uncertainty:

```csharp
public class Customer
{
    public string Name { get; }
    public string Email { get; }

    private Customer(string name, string email)
    {
        Name = name;
        Email = email;
    }

    public static Customer? TryCreate(string? name, string? email)
    {
        if (string.IsNullOrWhiteSpace(name)) return null;
        if (string.IsNullOrWhiteSpace(email)) return null;
        return new Customer(name, email);
    }
}
```

The private constructor means no partially valid `Customer` can exist. `TryCreate` returns `Customer?`, which forces callers to handle the failure case. The `!` operator never appears because the `null` check happens before the construction — there is nothing to suppress.

The caller receives a clear contract:

```csharp
var customer = Customer.TryCreate(nameInput, emailInput);
if (customer is null)
{
    return ValidationProblem("Name and email are required.");
}
// customer is non-null here, and the compiler knows it
```

<figure class="post-figure">
  <img src="{{ site.baseurl }}/assets/generated/2026/03/csharp-nullable-reference-types-discipline/design-patterns.svg" alt="Diagram showing three paths: constructor injection for required dependencies, factory methods for conditional creation, and Result types for explicit error propagation." />
  <figcaption>Three patterns that design null out rather than around it.</figcaption>
</figure>

## Option and Result types: modeling absence explicitly {#option-result-types}

For cases where `null` and "not found" and "failed validation" are conceptually distinct — and conflating them would lose information — Result and Option types give you richer vocabulary.

A simple Result type:

```csharp
public readonly record struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }

    private Result(T value) { IsSuccess = true; Value = value; }
    private Result(string error) { IsSuccess = false; Error = error; }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error) => new(error);
}
```

Usage communicates intent clearly:

```csharp
public Result<Customer> RegisterCustomer(RegistrationRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Result<Customer>.Failure("Name is required.");

    if (!IsValidEmail(request.Email))
        return Result<Customer>.Failure("Email address is not valid.");

    var customer = new Customer(request.Name, request.Email);
    _repository.Save(customer);
    return Result<Customer>.Success(customer);
}
```

The caller gets a `Result<Customer>`. They cannot accidentally treat the value as valid without checking `IsSuccess`. There is no null, no exception for a control flow decision, and no ambiguity between "customer not found" and "customer invalid."

Libraries like `CSharpFunctionalExtensions` offer production-ready implementations of this pattern with monadic chaining if you want richer composition. The concept scales whether you roll your own or bring in a library.

## The design question to ask instead {#design-question}

The pattern becomes clearer once you shift from "how do I handle null here?" to "why could this be null in the first place?"

When the answer is "because this field is genuinely optional in the domain," then `string?` is correct and deliberate. A product description might be optional. A middle name might be optional. A secondary email might be optional.

When the answer is "because the object just hasn't been initialized yet" or "because we haven't wired up the tests properly," that is not a nullable type problem. That is a design problem wearing a type system mask.

<div class="post-note">
  <strong>The practical test:</strong> if you cannot explain in one sentence why a field is nullable in terms of the domain — not in terms of the code — it probably should not be nullable. It should be required, or it should not exist until the object is in the state where it is meaningful.
</div>

## Treat warnings as design signals {#warnings-as-signals}

When the compiler warns you about a potential null dereference, it is not being pedantic. It is telling you that your type annotations do not match your code's behavior, which means either the annotations are wrong or the code is wrong. Either way, there is a discrepancy worth understanding.

The discipline is straightforward:

- If a warning indicates a property that should always be non-null, fix the construction path so the compiler can verify it.
- If a warning indicates a genuinely nullable value, handle the null case explicitly until the compiler can prove the path is safe.
- If you reach for `!` or `= null!`, treat it as a code smell requiring a comment explaining why the suppression is justified — and plan to remove it.

That last constraint is a useful forcing function. Requiring an explanation for every suppression is how you distinguish the legitimate uses — interop with uninitialized reflection, legacy migration paths, tests scaffolded for brevity — from the habitual ones.

Teams that do this consistently find that the feature pays off. Not because null becomes impossible, but because the points where null is possible are explicit, visible, and deliberate. The type system carries the documentation, and the analysis enforces it.

That is what the feature was designed to do. The annotation theater version just makes the warnings go quiet.

---

*Interested in more posts on writing C# that's honest about its contracts? Follow along — the next few weeks cover async patterns, LINQ discipline, and dependency injection that ages well.*

**Meta description:**
Most teams enabled nullable reference types and then silenced the warnings with null-forgiving operators. That is annotation theater. This post explains what the feature actually buys you and the patterns — constructor injection, factory methods, Result types — that let you design null out of your domain.

**SEO keyword ideas:**
1. C# nullable reference types best practices
2. null forgiving operator antipattern csharp
3. csharp design null out of domain
4. nullable reference types discipline dotnet
5. C# result type option type pattern
