/**
 * REAL-composition: boot test-only cordis.yml through Loader + Include and
 * assert the Superpowers provider plus default bootstrap assemble path from
 * the shipped plugin export.
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import SkillRegistry from '@deepseek-ai/dsh-skill'
import type { Agent } from '@deepseek-ai/dsh-agent'
import * as Superpowers from '@firefly0621/dsh-superpowers'

let root: string | undefined
let context: Context | undefined

afterEach(async () => {
  await context?.fiber.dispose()
  context = undefined
  if (root !== undefined) await rm(root, { recursive: true, force: true })
  root = undefined
})

function agentStub(origin: 'user' | 'subagent' = 'user'): Agent {
  return {
    session: {
      header: { origin, cwd: process.cwd() },
      snapshotEvents: () => [],
    },
  } as unknown as Agent
}

async function loadComposition(options: { bootstrap?: boolean } = {}): Promise<Context> {
  root = await mkdtemp(join(tmpdir(), 'dsh-superpowers-loader-'))
  const configPath = join(root, 'cordis.yml')
  const lines = [
    "- name: '@deepseek-ai/dsh-system-prompt'",
    "- name: '@deepseek-ai/dsh-skill'",
    '- id: superpowers',
    "  name: '@firefly0621/dsh-superpowers'",
  ]
  if (options.bootstrap === false) {
    lines.push('  config:', '    bootstrap: false')
  }
  lines.push('')
  await writeFile(configPath, lines.join('\n'))

  const ctx = new Context()
  context = ctx
  ctx.baseUrl = pathToFileURL(root).href + '/'
  await ctx.plugin(Loader)
  ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([
    ['@deepseek-ai/dsh-system-prompt', SystemPrompt],
    ['@deepseek-ai/dsh-skill', SkillRegistry],
    ['@firefly0621/dsh-superpowers', Superpowers],
  ])
  ctx.loader.internal = {
    version: 'v2',
    async import(specifier: string) {
      if (!modules.has(specifier)) throw new Error(`unexpected Loader import: ${specifier}`)
      return modules.get(specifier)
    },
  } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({
    name: 'cordis:include',
    config: { path: pathToFileURL(configPath).href },
  })
  await ctx.loader.await()
  return ctx
}

describe('superpowers real composition', () => {
  it('boots from cordis.yml and registers packaged skills', async () => {
    const ctx = await loadComposition({ bootstrap: false })
    const names = (await ctx.skills.list()).map(skill => skill.name)
    expect(names).toContain('brainstorming')
    expect(names).toContain('using-superpowers')
  })

  it('default bootstrap prepends skill:superpowers on assemble', async () => {
    const ctx = await loadComposition()
    const assembly = await ctx.systemPrompt.assemble({
      agent: agentStub('user'),
      signal: new AbortController().signal,
    })
    expect(assembly.sections[0]?.name).toBe('skill:superpowers')
    expect(assembly.sections[0]?.text).toContain('You have superpowers.')
    expect(assembly.sections[0]?.text).toContain('## Standing order (before any tool call)')
    expect(assembly.sections[0]?.text).toContain('DeepSeek Harness platform adaptation')
  })

  it('default bootstrap prepends skill:superpowers-worker for subagent origin', async () => {
    const ctx = await loadComposition()
    const assembly = await ctx.systemPrompt.assemble({
      agent: agentStub('subagent'),
      signal: new AbortController().signal,
    })
    expect(assembly.sections[0]?.name).toBe('skill:superpowers-worker')
    expect(assembly.sections[0]?.text).toContain('worker** subagent')
    expect(assembly.sections.some(section => section.name === 'skill:superpowers')).toBe(false)
  })
})
