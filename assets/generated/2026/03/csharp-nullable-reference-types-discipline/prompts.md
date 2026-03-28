# Image prompts — csharp-nullable-reference-types-discipline

## hero.svg

**Purpose:** Hero image at the top of the post.

**Prompt:**
A clean, dark-background technical diagram split into two halves. Left half is labeled "Annotation Theater" and shows a code snippet with red-tinted `null!` and `!` operator highlights, with a warning suppressed icon (a silenced bell or struck-through warning triangle). Right half is labeled "Real Discipline" and shows a constructor signature with green-tinted non-nullable type declarations and a checkmark. A subtle dividing line separates the two halves. Minimal, precise, no photography. Monochrome except for the red/green accent highlights. Font: monospace for code, sans-serif for labels.

---

## design-patterns.svg

**Purpose:** Inline image illustrating the three design patterns described in the post.

**Prompt:**
A three-column diagram on a dark background. Each column represents one pattern. Column 1: "Constructor Injection" — shows an arrow from "uncertain input" to a constructor box to a "guaranteed valid object" output. Column 2: "Factory Method" — shows an input flowing into a static `TryCreate` box, branching into `T?` (null path, labeled "handle absence") and `T` (success path). Column 3: "Result Type" — shows input flowing into a method box, branching into `Result.Failure` and `Result.Success`. Each column has a subtle background tint in desaturated blue. Labels use sans-serif font, code elements use monospace. No photography, no gradients, flat design.
