# Image prompts — csharp-async-configureawait

## hero.svg

**Purpose:** Hero image at the top of the post.

**Prompt:**
A clean, dark-background technical diagram illustrating two async continuation paths. On the left side, a box labeled "await (default)" with an arrow flowing upward to a box labeled "SynchronizationContext" — which then tries to route to a "Context Thread" box shown with a BLOCKED indicator (a padlock or red bar). A dashed red feedback line shows a circular deadlock. On the right side, a box labeled "await .ConfigureAwait(false)" with an arrow flowing directly to a "Thread Pool" box shown with a green AVAILABLE indicator. A subtle vertical dividing line separates the two paths. Color accent: muted blue for the left path (blocked), muted green for the right path (free). Dark background (#1a1a2e or similar), monospace labels, flat design, no photography, no gradients.

---

## deadlock-flow.svg

**Purpose:** Inline diagram illustrating the deadlock sequence described in the post.

**Prompt:**
A vertical flowchart on a dark background showing four numbered steps of the classic async deadlock. Step 1: A box labeled "Context Thread" contains "calls .Result" with a downward arrow to a "Blocks here" state (represented with horizontal bars suggesting a stopped thread). Step 2: A box labeled "Async Method" shows "await" capturing a "SynchronizationContext" label with a small capture icon (a net or hook). Step 3: A box labeled "Thread Pool" shows the task completing and routing a continuation arrow toward the SynchronizationContext. Step 4: The continuation arrow reaches a blocked SynchronizationContext gate and a circular arrow connects back to the blocked context thread — labeled "Deadlock". Accent color: red for the deadlock path. Dark background. Flat vector design, sans-serif labels.
