---
name: security-and-hardening
description: "Applies STRIDE-lite threat framing and Always/Ask/Never security boundaries, treating LLM output as untrusted. Use when designing auth, trust boundaries, or reviewing security-sensitive changes. Do not use as a full OWASP course or for pure performance work."
tier: discipline
---

# Security and Hardening

## Overview

Security-first practices for features that accept untrusted data, manage sessions, or integrate externally. Treat every external input as hostile, every secret as sacred, and every authorization check as mandatory. **LLM output is untrusted input** — the same validation and encoding rules apply as for user-supplied data.

This skill applies STRIDE-lite framing and an Always/Ask/Never boundary system. It is not a full OWASP course and does not cover pure performance optimization.

## When to Use

- Building anything that accepts user input
- Implementing authentication or authorization
- Storing or transmitting sensitive data
- Integrating external APIs, webhooks, or file uploads
- Reviewing security-sensitive changes before merge
- Features that call an LLM (chat, summarization, agents, RAG)

Skip when:

- Pure performance tuning with no trust-boundary change
- The user wants a general security training curriculum instead of actionable hardening

## Process

### Step 1: STRIDE-lite threat model (five minutes)

Before hardening, map the feature:

1. **Trust boundaries** — where untrusted data enters: HTTP requests, uploads, webhooks, third-party APIs, message queues, **LLM output**, and values that look internal because the OS delivered them (another process's environment, shared-volume paths, job payloads). Trust follows who *wrote* a value, not which channel delivered it.
2. **Assets** — credentials, PII, payment data, admin actions
3. **STRIDE lens** per boundary:

| Threat | Ask | Typical mitigation |
|---|---|---|
| **S**poofing | Can someone impersonate a user/service? | Authentication, signature verification |
| **T**ampering | Can data be altered in transit or at rest? | Integrity checks, parameterized queries, HTTPS |
| **R**epudiation | Can an action be denied later? | Audit logging of security events |
| **I**nformation disclosure | Can data leak? | Encryption, field allowlists, generic errors |
| **D**enial of service | Can it be overwhelmed? | Rate limiting, input size caps, timeouts |
| **E**levation of privilege | Can a user gain unearned rights? | Authorization checks, least privilege |

4. **Abuse cases** — for each feature, ask "how would I misuse this?" and make that a test.

If you cannot name trust boundaries, you are not ready to secure the feature.

### Step 2: Always / Ask / Never boundaries

**Always do:**

- Validate external input at system boundaries
- Parameterize database queries — never concatenate user input into SQL
- Encode output to prevent XSS (use framework auto-escaping)
- Hash passwords with bcrypt/scrypt/argon2
- Use HTTPS for external communication
- Set security headers (CSP, HSTS, X-Frame-Options)
- Use httpOnly, secure, sameSite cookies for sessions
- Run the package manager's native audit against the committed lockfile before release

**Ask first** (requires human approval):

- New authentication flows or auth logic changes
- Storing new categories of sensitive data
- New external service integrations
- CORS changes, file upload handlers, rate-limit changes
- Granting elevated permissions or roles

**Never do:**

- Commit secrets to version control
- Log sensitive data (passwords, tokens, full card numbers)
- Trust client-side validation as a security boundary
- Disable security headers for convenience
- Use `eval()` or `innerHTML` with user-provided or model-provided data
- Store auth tokens in client-accessible storage (localStorage)
- Expose stack traces or internal errors to users

Concrete code patterns for each control live in
[references/hardening-patterns.md](references/hardening-patterns.md). Open the
section you need when you reach that code, not before.

### Step 3: LLM output as trust boundary

When the app calls an LLM:

- **Treat all model output as untrusted input.** Never pass it straight into SQL, a shell, `eval`, `innerHTML`, or a file path without validation and encoding.
- **Prompt injection:** untrusted text in the context (user messages, fetched pages) can carry instructions. Enforce permissions in code, not in the prompt alone.
- **Keep secrets and cross-tenant data out of prompts.** Anything in context can be echoed.
- **Scope tool permissions minimally.** Require confirmation for destructive or irreversible actions; validate every tool argument.
- **Bound consumption:** cap tokens, rate, and loop depth.

### Step 4: Dependency and supply-chain hygiene

- One authoritative lockfile; CI uses frozen/immutable install
- Triage audit findings by reachability and severity — never auto-apply forced remediation without review
- Block dependency install scripts until inspected and approved
- Review new dependencies: ownership, publish history, release age, typosquats

### Step 5: Destructive path safety

Before delete/move/overwrite on a path derived from external or cross-process data:

- Resolved target sits under an **allowlisted root** (after symlink resolution)
- Target is at least one level **below** that root
- **Ownership evidence** read before the operation

A shape check ("absolute path, one directory deep") is not authorization.

## Rationalizations

| Rationalization | Reality |
|---|---|
| "Internal tool, security doesn't matter" | Internal tools get compromised; attackers target weakest links |
| "We'll add security later" | Retrofit is harder than building in from the start |
| "The framework handles security" | Frameworks provide tools, not guarantees |
| "It's just LLM output, only text" | That text can be SQL, script tags, or shell commands |
| "The audit passed, dependency is safe" | Audits match known advisories, not newly malicious packages |

## Red Flags

- User input passed directly to queries, shell, or HTML rendering
- Secrets in source or commit history
- Protected endpoints without authentication and authorization
- Wildcard CORS or missing rate limiting on auth endpoints
- Server fetches user-supplied URLs without allowlist (SSRF)
- LLM output passed into query, DOM, shell, or `eval`
- Secrets or PII placed inside an LLM context window
- Destructive operation guarded only by path shape, not allowlisted root + ownership

## Verification

- [ ] Trust boundaries named; STRIDE-lite lens applied
- [ ] Always/Ask/Never boundaries respected for the change
- [ ] All user input validated at system boundaries
- [ ] Authentication and authorization on every protected endpoint
- [ ] No secrets in source or git history
- [ ] LLM output validated and encoded before use (if AI features present)
- [ ] Native audit has no unmitigated reachable critical/high findings
- [ ] Destructive filesystem operations verify allowlisted root, minimum depth, and ownership
- [ ] Rate limiting on auth endpoints uses shared store when multiple instances serve traffic
