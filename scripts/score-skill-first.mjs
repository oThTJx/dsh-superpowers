#!/usr/bin/env node
/**
 * Offline skill-first (and parent wait) compliance score for a session.v3.jsonl.
 *
 * For each turn with a real user prompt, reports whether the first tool/call
 * was `skill` (pass) or something else (fail). Injected catalog / runtime-context
 * user messages are ignored. Tiny-edit and subagent turns are not auto-excused —
 * humans interpret fails against task type.
 *
 * Also flags same-turn `list_agents` spam after a `subagent` / `subagent_fork`
 * dispatch (warn when count >= 3; fail exit when count >= 10).
 *
 * Usage:
 *   node packages/skill/superpowers/scripts/score-skill-first.mjs path/to/session.v3.jsonl
 *   node packages/skill/superpowers/scripts/score-skill-first.mjs path/to/session.v3.jsonl --json
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const LIST_AGENTS_WARN = 3
const LIST_AGENTS_FAIL = 10

const args = process.argv.slice(2).filter((a) => a !== '--json')
const asJson = process.argv.includes('--json')
const path = args[0]
if (!path) {
  console.error('Usage: score-skill-first.mjs <session.v3.jsonl> [--json]')
  process.exit(2)
}

const events = readFileSync(resolve(path), 'utf8')
  .trim()
  .split(/\n/)
  .map((line) => JSON.parse(line))

function isInjectedUserMessage(event) {
  if (event.type !== 'user/message') return false
  const text = (event.data?.content ?? []).map((c) => c.text ?? '').join('\n')
  if (text.includes('<available_skills>') || text.includes('<system-reminder>')) return true
  if (text.includes('Current runtime context.')) return true
  const source = event.data?.source
  if (source && typeof source === 'object' && source.kind === 'plugin') return true
  return false
}

function isRealUserPrompt(event) {
  if (event.type !== 'user/message') return false
  if (isInjectedUserMessage(event)) return false
  const source = event.data?.source
  return source?.kind === 'user' || source === undefined
}

/** @type {Map<number, { turn: number, prompts: string[], firstTool?: string, skillCalls: string[], listAgents: number, dispatchedSubagent: boolean }>} */
const turns = new Map()
let currentTurn

for (const event of events) {
  if (event.type === 'turn/start') {
    currentTurn = event.data.turn
    turns.set(currentTurn, {
      turn: currentTurn,
      prompts: [],
      skillCalls: [],
      listAgents: 0,
      dispatchedSubagent: false,
    })
    continue
  }
  if (event.type === 'turn/end') {
    currentTurn = undefined
    continue
  }
  const turn = event.data?.turn ?? currentTurn
  if (typeof turn !== 'number') continue
  let bucket = turns.get(turn)
  if (!bucket) {
    bucket = {
      turn,
      prompts: [],
      skillCalls: [],
      listAgents: 0,
      dispatchedSubagent: false,
    }
    turns.set(turn, bucket)
  }
  if (isRealUserPrompt(event)) {
    const text = (event.data.content ?? []).map((c) => c.text ?? '').join('\n').trim()
    if (text) bucket.prompts.push(text.slice(0, 200))
  }
  if (event.type === 'tool/call') {
    const name = event.data.name
    if (bucket.firstTool === undefined) bucket.firstTool = name
    if (name === 'skill') {
      let skillName
      try {
        skillName = JSON.parse(event.data.arguments ?? '{}').name
      } catch {
        skillName = undefined
      }
      bucket.skillCalls.push(skillName ?? '(parse-error)')
    }
    if (name === 'subagent' || name === 'subagent_fork') {
      bucket.dispatchedSubagent = true
    }
    // Count only list_agents calls that occur after a dispatch in this turn.
    if (name === 'list_agents' && bucket.dispatchedSubagent) {
      bucket.listAgents += 1
    }
  }
}

const rows = [...turns.values()]
  .filter((t) => t.prompts.length > 0 || t.firstTool !== undefined)
  .map((t) => {
    const verdict = t.firstTool === 'skill' ? 'pass' : 'fail'
    let wait = 'ok'
    if (t.dispatchedSubagent && t.listAgents >= LIST_AGENTS_FAIL) wait = 'fail'
    else if (t.dispatchedSubagent && t.listAgents >= LIST_AGENTS_WARN) wait = 'warn'
    else if (t.dispatchedSubagent && t.listAgents > 0) wait = 'note'
    return {
      turn: t.turn,
      verdict,
      firstTool: t.firstTool ?? '(none)',
      skillCalls: t.skillCalls,
      prompt: t.prompts[0] ?? '(no user prompt text)',
      listAgents: t.listAgents,
      dispatchedSubagent: t.dispatchedSubagent,
      wait,
    }
  })

const pass = rows.filter((r) => r.verdict === 'pass').length
const fail = rows.filter((r) => r.verdict === 'fail').length
const waitFail = rows.filter((r) => r.wait === 'fail').length
const waitWarn = rows.filter((r) => r.wait === 'warn').length

if (asJson) {
  console.log(JSON.stringify({
    path: resolve(path),
    pass,
    fail,
    waitFail,
    waitWarn,
    turns: rows,
  }, null, 2))
} else {
  console.log(`session: ${resolve(path)}`)
  console.log(`turns scored: ${rows.length}  pass: ${pass}  fail: ${fail}  waitFail: ${waitFail}  waitWarn: ${waitWarn}`)
  for (const row of rows) {
    const skills = row.skillCalls.length ? row.skillCalls.join(',') : '-'
    const waitPart = row.dispatchedSubagent
      ? `\twait=${row.wait}\tlist_agents=${row.listAgents}`
      : ''
    console.log(
      `T${row.turn}\t${row.verdict}\tfirst=${row.firstTool}\tskills=[${skills}]${waitPart}\t${JSON.stringify(row.prompt)}`,
    )
  }
}

process.exit(fail > 0 || waitFail > 0 ? 1 : 0)
