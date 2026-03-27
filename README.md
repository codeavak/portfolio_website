# Jekyll Codex Blog Kit

Drop these files into the root of your Jekyll repository.

## What this gives you
- `AGENTS.md` so Codex understands your blog rules automatically
- a repo skill at `.agents/skills/blog-package/SKILL.md`
- a small image helper script at `scripts/make_blog_image.py`
- ready-to-use prompts in `prompts/`
- starter folders for `_posts`, `assets/generated`, and `content-packages`

## Recommended workflow
1. Open your Jekyll repo in the Codex app.
2. Use Worktree mode if available.
3. Paste the prompt from `prompts/manual-run.txt` or `prompts/manual-run-with-theme.txt`.
4. Review the diff.
5. Commit only when you like the result.

## Optional image generation
If you want Codex to generate images through the OpenAI API, set `OPENAI_API_KEY` in your environment and let it call:

```bash
python scripts/make_blog_image.py "Editorial illustration prompt here" assets/generated/2026/03/my-slug/hero.png
```

## Notes
- Your ChatGPT Plus plan can cover Codex app usage, but API-key image generation is billed separately.
- This kit is meant for manual content creation inside your local Jekyll repo, not unattended auto-publishing.
