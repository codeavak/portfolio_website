# Image prompts for 2026-03-28-sql-server-indexing-strategy

SVG visuals were authored directly for this post.

- `hero.svg` — Side-by-side B-tree diagram showing key lookup path (left, red) vs fully covered index with INCLUDE columns (right, green). Dark navy background.
- `index-structure.svg` — Comparison diagram: all columns as key (wide, red annotated) vs narrow key + INCLUDE (green annotated), showing where each column type lives in the B-tree levels.

If regenerating with `scripts/make_blog_image.py`, use these prompts:

## Hero prompt

Create a polished dark-background editorial technology diagram for a senior software engineering blog. Show two side-by-side B-tree index structures. On the left, a nonclustered index that requires a key lookup — show an extra dashed arrow going back to the clustered index, labeled in red. On the right, a covering index with included columns — show the leaf node containing all needed columns, with a clean green check mark indicating no extra trip needed. Use deep navy, slate, steel blue, teal, and muted red/green for emphasis. No photos, no robots. Calm and precise.

Suggested output path: `assets/generated/2026/03/sql-server-indexing-strategy/hero.png`

## Inline prompt 1

Create a clean side-by-side technical diagram showing two B-tree index structures. Left side labels all four columns as key columns propagating through root, non-leaf, and leaf levels — annotated in red as "wide key." Right side shows only two key columns propagating, with two INCLUDE columns appearing at the leaf level only — annotated in green as "narrow key + INCLUDE." Dark background, minimal, architecture-diagram style. No brand logos, no text-heavy design.

Suggested output path: `assets/generated/2026/03/sql-server-indexing-strategy/index-structure.png`
