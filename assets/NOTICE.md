# Third-party notice

This package contains skill content adapted from the sources below. The
commits listed here are **review pins** (the upstream trees last consulted
for licensing and sync planning). They are **not** a claim that every file
under `skills/` is byte-equivalent to those trees.

**Content baseline and open sync debt** live in the package README
(`## Content baseline and sync debt`). Re-port diffs must use that
baseline table plus the debt list — never NOTICE pins alone — or deferred
upstream changes will silently disappear from the next sync.

1. [obra/superpowers](https://github.com/obra/superpowers) (reviewed at `8ca22dba9`, v6.4.2) under the MIT License.
2. [mattpocock/skills](https://github.com/mattpocock/skills) (reviewed at `49dd158d1`) under the MIT License (Copyright 2026 Matt Pocock). Selected skills were adapted into this package as a capability extension on the Superpowers workflow kernel; see package README for the tier whitelist.
3. [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (reviewed at `1401c8b80`) under the MIT License (Copyright 2025 Addy Osmani). Selected lifecycle skills were distilled into this package.
4. [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (reviewed at `bda3c5929`) under the MIT License (Copyright 2025 BMad Code, LLC). Selected product-discovery skills were distilled into this package under functional names (never `bmad-*` prefixes or trademark personas).

Adaptation for DeepSeek Harness: skill bodies under `skills/` were rewritten so foreign-harness tool names and platform references (Claude Code / Codex / Cursor / Pi / Gemini / Antigravity / Hermes) point at dsh equivalents, and the `superpowers:` skill-name prefix was removed. The Cordis plugin code (`src/`) is a separate MIT-licensed work. Invocation and `tier` frontmatter parsing for this provider is implemented privately in `src/index.ts` (upstream `@deepseek-ai/dsh-skill` / `dsh-skill-filesystem` are not modified by this package).

Upstream copyright and license (obra/superpowers):

> Copyright (c) 2025 Jesse Vincent
>
> MIT License
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

Upstream copyright and license (mattpocock/skills):

> Copyright (c) 2026 Matt Pocock
>
> MIT License
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

Upstream copyright and license (addyosmani/agent-skills):

> Copyright (c) 2025 Addy Osmani
>
> MIT License
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

Upstream copyright and license (bmad-code-org/BMAD-METHOD):

> Copyright (c) 2025 BMad Code, LLC
>
> MIT License
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
>
> TRADEMARK NOTICE:
> BMad®, BMad Method®, and BMad Core® are trademarks of BMad Code, LLC, covering all
> casings and variations (including BMAD, bmad, BMadMethod, BMAD-METHOD, etc.). The use of
> these trademarks in this software does not grant any rights to use the trademarks
> for any other purpose. See upstream TRADEMARK.md for detailed guidelines. This
> package grants no trademark license.
