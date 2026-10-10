---
name: handoff
description: "Compact the current conversation into a handoff document for another agent. Use when the user explicitly wants a handoff for a fresh session. Do not use as an automatic end-of-turn ritual."
disable-model-invocation: true
tier: session
---

# Handoff

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows) — not the current workspace.

**Front-load path:line, then stop.** Lead with the concrete file locations (and line ranges when known) the next agent must open; then stop expanding narrative around them. Reference other artifacts by path instead of pasting them.

Include a "suggested skills" section in the document, naming which skills the next agent should load via the `skill` tool (kebab-case names).

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
