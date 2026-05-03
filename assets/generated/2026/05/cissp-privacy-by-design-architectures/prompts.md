# Image Prompts for CISSP #50: Privacy by Design and Privacy-Preserving Architectures

## Hero Image (hero.svg)

**Current:** SVG with concentric circles representing Privacy by Design layers
**Concept:** Concentric rings showing the layers of Privacy by Design: data minimization at center, then access controls, encryption, and audit/transparency at the outer layers. Professional blue/purple gradient background with title "Privacy by Design: Architecture From the Ground Up"

If regenerating with DALL-E:

- "Professional diagram showing concentric rings labeled with Privacy by Design principles: center ring 'Data Minimization', next ring 'Access Controls', outer ring 'Encryption', outermost 'Audit & Transparency'. Dark blue background (Pantone 533), gradient to slate. Clean, architectural style. Text overlay: 'Privacy by Design' and 'Architecture From the Ground Up' in white at bottom."

## Inline Image 1: Data Separation Pattern (data-separation.svg)

**Current:** SVG showing two separate data pipelines side-by-side
**Concept:** Left pipeline (pink/magenta) shows personal data (names, emails) going through end-to-end encryption to tightly controlled storage. Right pipeline (blue) shows operational data (events, analytics) being hashed before going to analytics platform. Center divider emphasizes "Separate Systems."

If regenerating with DALL-E:

- "Technical architecture diagram showing two parallel data flows: Left side (magenta/pink): 'User Identity' box with names/emails flowing through 'End-to-End Encryption' to 'Tightly Controlled Storage'. Right side (bright blue): 'Events & Analytics' flowing through 'Hashing' to 'Analytics Platform'. Center vertical divider labeled 'Separate Systems'. Light gray background, professional tech style."

## Optional Additional Image: Privacy-Preserving Technology Matrix

**Not currently in post, but could be added**

Concept: A 2x3 or 2x4 grid showing privacy-preserving technologies positioned by:

- X-axis: Research → Production (maturity level)
- Y-axis: Computational Cost (Low → High)
- Items: Differential Privacy, Homomorphic Encryption, Federated Learning, Secure Multi-Party Computation, K-Anonymity, Encryption (traditional)

This would support the "Privacy-Preserving Technologies" section visually.

---

## Note

The SVG assets are created locally. To regenerate with DALL-E (requires OPENAI_API_KEY):

```
python scripts/make_blog_image.py "prompt" assets/generated/2026/05/cissp-privacy-by-design-architectures/image_name.png
```
