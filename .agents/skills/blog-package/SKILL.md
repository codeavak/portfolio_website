---
name: blog-package
description: Use this when the user wants a complete Jekyll blog package: choose a topic, research it, write a long-form article, create LinkedIn content, prepare images, and add the content to the local Jekyll repository without committing.
---

## Workflow
1. Choose the best topic if the user did not provide one.
2. Research with current credible sources when freshness matters.
3. Create the full package in the required order.
4. Write the Jekyll post into `_posts/YYYY-MM-DD-slug.md`.
5. Save supporting deliverables into `content-packages/YYYY-MM-DD-slug.md`.
6. If a local image-generation script exists, use it.
7. Otherwise create image prompts in `assets/generated/YYYY/MM/slug/prompts.md` and reference placeholder paths in the post.
8. Show the diff and stop. Do not commit unless asked.

## Topic preference
Prioritize topics that strengthen the user's professional brand:
- AI engineering
- secure software development
- programming lessons
- systems reliability
- career growth for engineers
- certifications and disciplined learning

## Content quality bar
- thoughtful senior-engineer voice
- practical, grounded, credible
- no fake citations
- no inflated claims
- no cheesy influencer language
