# @firefly0621/dsh-superpowers

[English](README.md) | 中文

可安装的 DeepSeek Harness 插件组合包：把 [obra/superpowers](https://github.com/obra/superpowers) 接入产品会话——打包 skill 目录（**41** 个；`diagnosing-superpowers` 在深 dsh 移植前不进目录），已适配 dsh 工具 + 等价于 SessionStart 的引导注入。

发布名：`@firefly0621/dsh-superpowers`（版本跟随 harness 家族，当前为 `0.1.0-rc.35`）。本 fork 包的源码真源：[github.com/oThTJx/dsh-superpowers](https://github.com/oThTJx/dsh-superpowers)。本包为显式 opt-in，不属于官方 main 的 `dsh-base` 组合。

## 还原的能力

| Superpowers 行为 | dsh 实现 |
|---|---|
| `skills/*/SKILL.md` 技能库 | `ctx.skills` 提供方 `superpowers`（打包的 `skills/` 目录，已适配 dsh） |
| SessionStart 注入 `using-superpowers` | `system-prompt/assemble` 段 `skill:superpowers`，同一套 `<EXTREMELY_IMPORTANT>` 框架（每个非 subagent 请求）；`using-superpowers` 在 skill 目录中为仅用户 |
| 平台 `references/*-tools.md` | 该段内附加 `skills/using-superpowers/references/dsh-tools.md` |
| 子代理跳过（`SUBAGENT-STOP`） | `session.header.origin === 'subagent'` 时不注入完整 `using-superpowers` 引导；改为注入短 `skill:superpowers-worker` preamble |
| 按需加载其他 skill | 现有 `dsh-tool-skill` 目录 + `skill` 工具 |

skill 正文以 dsh 适配后的形式随包发布在 `skills/` 下（无 vendored 源码、无 git submodule）：外 harness 工具名与平台引用已改写为 dsh 等价物，`superpowers:` 前缀已移除。发布 tarball 包含 `skills/` 与 `assets/NOTICE.md`（记录 obra/superpowers @ `8ca22dba9` v6.4.2、mattpocock/skills @ `49dd158d1`、addyosmani/agent-skills @ `1401c8b80`，以及 bmad-code-org/BMAD-METHOD @ `bda3c5929` 与商标声明）。

## Matt skills 与融合扩展

Superpowers 仍是工作流内核（`brainstorming` → `writing-plans` → TDD / 调试 / 评审 / 验证）。从 [mattpocock/skills](https://github.com/mattpocock/skills)、[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) 与 [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) 选取的实践以**分层目录**交付（21 个带 `metadata.tier` 的名字；完整打包目录 **41** 个 skill）。`SkillTier` 取值：`core` | `utility` | `session` | `discipline` | `product`。

| 层级（`metadata.tier`） | Skills | 说明 |
|---|---|---|
| `core` | `domain-modeling`、`codebase-design`、`research`、`constraint-driven-development`、`spec-kernel` | 模型 + 用户 |
| `utility` | `prototype`、`wizard` | 模型 + 用户；prototype 为硬性可抛弃边界 |
| `session` | `grilling`、`handoff`、`wait-what` | **仅用户**（`disable-model-invocation: true`） |
| `discipline` | `doubt-driven-development`、`source-driven-development`、`context-engineering`、`security-and-hardening` | 模型 + 用户 |
| `product` | `forge-idea`、`party-mode`、`correct-course`、`prd`、`prfaq`、`ux-spec`、`retrospective` | 模型 + 用户；仅在 README 列出（不写进引导分叉） |

session skill（`grilling`、`handoff`、`wait-what`）不会出现在模型的 `<available_skills>` 目录中，模型侧 `skill` 工具也会拒绝加载。用户在用户消息里用空白边界的 `/name` token 调用（例如 `/grilling`）；由 `dsh-tool-skill` 注入 skill 正文。`using-superpowers` 同样是 `disable-model-invocation: true`，但其常驻正文来自系统提示词引导，而非该手势（用户仍可用 `/using-superpowers` 重载正文，但不含 adapter）。

吸收了合并内容的 obra skill（obra 同步时需保留）：`brainstorming`（Architectural 内联 grilling；Not Doing；Always/Ask/Never；拒绝 aim-past-100）、`using-superpowers`（≤5 行意图分叉；反堆叠；tiny-edit；实现优先级；contextual gates）、`test-driven-development`、`systematic-debugging`、`requesting-code-review`（Standards ∥ Spec + 清单）、`incremental-implementation`、`code-simplification`、`research`、`codebase-design`、`writing-plans`、`explaining-changes`、`handoff`、`verification-before-completion`。

Superpowers 扩展 skill（实现纪律，非自动路由）：`incremental-implementation`、`impact-analysis`、`code-simplification`、`structured-refactoring`、`dsh-harness-contributor`、`explaining-changes`。引导 skill `using-superpowers` 定义何时加载、实现优先级与 contextual gates；`tier` 与目录 description 不会自动路由。

`tier` 仅为目录元数据，不是路由器。本提供方在插件内私有解析 invocation / `tier` frontmatter（仅改插件；不改上游 harness 包）。

## 安装进 dsh profile

需要 DeepSeek Harness peer（`@deepseek-ai/dsh-skill` 等），通常来自官方 CLI / `dsh-base` 栈。源码工作区的 `workspace:*` peer 指向匹配的 DSH 发布版；打包清单会替换成该精确版本。DSH 在安装与 profile 启动时检查这些 peer 范围，不兼容且没有精确版本豁免的组合会被拒绝——见[版本兼容性](#version-compatibility)。

```sh
dsh plugin --profile web add @firefly0621/dsh-superpowers
```

源码树中：

```sh
pnpm dsh plugin --profile web add @firefly0621/dsh-superpowers
```

然后启动 `dsh --profile web`（或 `pnpm dsh web`）。若本 fork 的 `dsh-base` 已挂载 `id: superpowers`，不要再重复安装——先禁用 base 行，或使用不含该行的 profile。

### 本地 / 发布前自检

```sh
pnpm run build:lib:host
pnpm --filter @firefly0621/dsh-superpowers pack
pnpm dsh plugin --profile superpowers-demo add ./firefly0621-dsh-superpowers-0.1.0-rc.35.tgz
```

（`pnpm pack` 默认把 tarball 写到仓库根目录。包本身没有 `build` script；由 host lib 构建产出 `lib/`。）

## 在本 monorepo 中启用（不经过 npm）

本包在 harness 源码树中为 opt-in。挂载随包 overlay patch（或 `dsh plugin add`）：

```sh
pnpm dsh web --patch packages/skill/superpowers/cordis.patch.yml
pnpm dsh --profile headless --patch packages/skill/superpowers/cordis.patch.yml "task"
```

已在 base 中挂载 `id: superpowers` 的 fork 树无需再加一层；若要省略，在该行上设置 `disabled: true`。

## 配置

| 字段 | 默认 | 含义 |
|---|---|---|
| `skillsRoot` | 打包的 `skills/` 目录 | skill 根目录 |
| `bootstrap` | `true` | 父会话贡献 `using-superpowers`（+ dsh 适配）为 `skill:superpowers`；子代理会话贡献短 worker preamble 为 `skill:superpowers-worker` |

## 更新 Superpowers

不再保留 vendored 子模块。要移植更新的上游：对每个源做 **内容基线 → 目标** 的 diff，再逐条走过下方 **同步欠账**，然后手工重放 dsh 适配。**禁止**只用 `assets/NOTICE.md` 的审阅钉点当唯一 diff 基线——那些钉点记录最近审阅，并不表示 `skills/` 已等价于该树。

适配规则：替换外 harness 工具名与平台引用、移除 `superpowers:` skill 名前缀、**行为内容保持 verbatim**（仅下表允许的 dsh 例外）、并蒸馏 Matt / agent-skills / BMAD ADD（禁止倾倒 BMAD `_bmad` 运行时、memlog、HTML seals 或商标人设）。

**允许的 dsh 非 verbatim 例外：**

| 例外 | 原因 |
|---|---|
| 去掉 `superpowers:` / 外 skill 名前缀 | dsh 目录使用裸名 |
| 外 harness 工具 → dsh（`subagent` / `subagent_fork`、`todo_write`、`dsh-tools.md`） | 平台适配 |
| `writing-plans` handoff 标签 `Native` → `Inline` | 避免 “native harness” 歧义；仍表示同会话 `executing-plans` |
| `sdd-workspace`：拒绝无 marker 的既有目录（不收养） | 相对 obra 刻意收紧所有权；见脚本头注释 |
| 捆绑脚本经 `bash …` 调用 | 打包解压可能剥掉 Unix 可执行位 |
| 保留目录 `Do not use` 否定句 / description 契约 | 融合路由门禁 |

### 内容基线与同步欠账

| 源 | 内容基线（已落入 `skills/`） | NOTICE 审阅钉 | 开放欠账 |
|---|---|---|---|
| obra/superpowers | 主轴至 v6.4.2 inline `executing-plans`（含 `scripts/task-start` / `task-done`），对应 `8ca22dba9` | `8ca22dba9` | *（无）* — `diagnosing-superpowers` 属已知限制（深会话转录映射），不是开放移植行 |
| mattpocock/skills | `GLOSSARY-FORMAT` 与 domain-modeling/handoff/grilling/wizard 对齐 `49dd158d1`；已删除 `resolving-merge-conflicts` | `49dd158d1` | *（无）* |
| addyosmani/agent-skills | 蒸馏 ADD；`context-engineering` OPTIMIZE；`security-and-hardening` + `references/hardening-patterns.md` | `1401c8b80` | 已交付 ADD *（无）* |
| BMAD-METHOD | 功能名下的产品 ADD 蒸馏（无 `_bmad` 运行时） | `bda3c5929` | 已交付 ADD *（无）* — 更广 v7 人设/运行时仍不在范围 |

**融合门禁清单（合入前/后必过）：**

1. 目录长度保持 **41**；`metadata.tier` 集合等于 **21 名**白名单；无第二 meta-router；无 `bmad-*` skill 目录名。
2. 任何 obra 主轴覆盖后，重断言 OPTIMIZE 合并（brainstorming Scheme B / Not Doing / Always·Ask·Never；TDD；review Standards ∥ Spec；grilling 仅用户；incremental / simplification 钉句）。
3. agent-skills 同名重叠（`code-simplification`、`incremental-implementation`、`test-driven-development`）就地 OPTIMIZE——不新增 peer 目录。
4. 当 obra 改变 skill 路由语义时（例如 `executing-plans` inline 相对 `subagent-driven-development`），同步更新 `SEMANTIC_DESCRIPTION_GROUPS` / `NEGATIVE_BOUNDARY_BANNED`。
5. 重新阅读上游时 bump NOTICE **审阅**钉；内容落地或欠账变化时更新 **内容基线 / 欠账**表；保留 ADD 的 `Do not use when…` 与 BMAD 出口态钉。
6. 运行 `pnpm exec vitest run packages/skill/superpowers/tests/superpowers.spec.ts`。
7. 确认 `executing-plans` 附带 `scripts/task-start` 与 `scripts/task-done`，且 SKILL 正文调用它们（测试失败 ≠ 不记账）。

**obra 同步时需保留：** Matt 新增的 skill 目录（`domain-modeling`、`codebase-design`、`research`、`prototype`、`wizard`、`grilling`、`handoff`、`wait-what` 及 companion）；agent-skills / BMAD ADD 目录（`constraint-driven-development`、`doubt-driven-development`、`source-driven-development`、`context-engineering`、`security-and-hardening`、`forge-idea`、`party-mode`、`spec-kernel`、`correct-course`、`prd`、`prfaq`、`ux-spec`、`retrospective`）；扩展 skill 目录（`incremental-implementation`、`impact-analysis`、`code-simplification`、`structured-refactoring`、`dsh-harness-contributor`、`explaining-changes`）；`brainstorming`、`using-superpowers`（意图分叉、反堆叠、tiny-edit、实现优先级、contextual gates）、`test-driven-development`、`systematic-debugging`、`requesting-code-review`、`incremental-implementation`、`code-simplification`、`research`、`codebase-design`、`writing-plans`、`explaining-changes`、`handoff`、`verification-before-completion` 中的合并段落；`src/index.ts` 中的私有 invocation/`tier` 解析（含 `discipline` | `product`）；`assets/NOTICE.md` 中的审阅钉块。

**CI 门禁（不只依赖 README）：** `tests/superpowers.spec.ts` 的 `skill composition contracts` 断言打包 `metadata.tier` 落在 `ALLOWED_TIERS` 内，并在 ADD 齐备后锁定 21 名白名单。`catalog description contracts` 断言语义 description 组（fail）、positive 段 negative boundary 防路由污染（fail），以及扩展 skill 间的 positive trigger 重叠（仅 warn）。门禁 skill 含纪律扩展集与 process spine（`brainstorming`、`systematic-debugging`、`verification-before-completion`、`dispatching-parallel-agents`、`writing-plans`、`executing-plans`、`research`、`requesting-code-review`、`subagent-driven-development`、`test-driven-development`）。十三个 ADD 不加入那些语义/重叠表；打包目录上的 pairwise Jaccard 描述碰撞仅 warn（提升为 fail 延后）。obra 再移植时丢掉带 tier 的目录或清掉 `tier` 会使该包测试失败。

## Model Experience

### System-prompt bootstrap

#### What the model sees

每个非 subagent 请求上，`system-prompt/assemble` 前置段 `skill:superpowers`，文本为 `buildBootstrapPreamble(...)`：下方 framing、完整随包 `using-superpowers` SKILL.md，以及 `skills/using-superpowers/references/dsh-tools.md`。无 agent 的组装省略该段。`session.header.origin === 'subagent'` 改用 `buildWorkerPreamble()` 的 `skill:superpowers-worker`。引导随系统提示每轮重装，不是一次性用户消息，因此不会被 compaction 丢掉。

##### Verbatim parent framing

```markdown
<EXTREMELY_IMPORTANT>
You have superpowers.

## Standing order (before any tool call)

1. Call the dsh `skill` tool with the exact catalog name **before** clarifying, exploring, reading files, or acting — unless every tiny-edit condition in `using-superpowers` holds.
2. Announce `Using [skill] to [purpose]`, then follow that skill. Do not invent a second workflow.
3. Anti-stack: load **one** process skill first; add supporting skills only when that skill delegates them or the user requires them. "Not an automatic workflow" means do not stack — not "skip `skill`".
4. Independent domains in one turn: issue multiple `subagent` / `subagent_fork` calls in the **same** assistant message.
5. After dispatch: finish only local work that does **not** need child results, then **end this turn**. Parent↔child talk uses adjacent `send_message` (Steer; tool returns delivery ack only — replies and `subagent-settled` arrive via inbox). Do **not** loop `list_agents` or status-ping `send_message` ("how is it going?") to wait.
6. Tool names, wait/resume, and harness gates: **DeepSeek Harness platform adaptation** at the end of this section.

**Below is the full content of your `using-superpowers` skill — your introduction to using skills.
For all other skills, call the dsh `skill` tool with the exact catalog name.**

[full using-superpowers SKILL.md]

## DeepSeek Harness platform adaptation

Your harness is DeepSeek Harness. Follow this adaptation (same role as Superpowers `references/*-tools.md`):

[full dsh-tools.md]
</EXTREMELY_IMPORTANT>
```

##### Verbatim worker preamble

```markdown
<EXTREMELY_IMPORTANT>
You are a Superpowers **worker** subagent.

1. Execute the dispatch brief. Do not invent a second process workflow or re-route the parent task.
2. `using-superpowers` / skill-first orchestration belongs to the **parent**. SUBAGENT-STOP means ignore that standing skill — **not** "refuse every catalog skill".
3. Call `skill` only when the brief names a skill, or a catalog entry is clearly required to finish the brief.
4. Do the assigned work yourself unless the brief says otherwise. Prefer finishing over polling parent state.
5. You may `send_message` your direct parent (and the parent may message you): delivery ack only; put self-contained findings in the message body. Settlement is separate and unconditional.
</EXTREMELY_IMPORTANT>
```

#### Token effect

每个非 subagent 请求携带一段较长的系统提示段；skill 目录开销由 `dsh-tool-skill` 负责。

#### KV Cache effect

在固定 `skillsRoot` 与 `bootstrap` 开关下为稳定前缀：段文本在插件 apply 时加载一次并复用。`bootstrap` 保持开启且随包 preamble 不变时，渲染文本逐字节稳定，warm 前缀缓存可复用。更改 `skillsRoot` 或关闭 `bootstrap` 会改变组装结果。

### Skill catalog and `skill` tool

#### What the model sees

经 `@deepseek-ai/dsh-tool-skill` 间接呈现：目录中的 Superpowers skill 摘要，以及通过 `skill` 加载的正文。

#### Token effect

随 skill 数量与目录描述上限变化。打包目录共四十二个 skill，含六个纪律扩展 skill（`incremental-implementation`、`impact-analysis`、`code-simplification`、`structured-refactoring`、`dsh-harness-contributor`、`explaining-changes`）以及十三个 agent-skills / BMAD ADD。

#### KV Cache effect

与 skill 消费方相同：初始目录接在可复用前缀后；替换目录追加。

<a id="version-compatibility"></a>
## 版本兼容性

本 bundle 在 `peerDependencies` 中声明 `@deepseek-ai/dsh-*`。DSH 在安装与 profile 启动时用运行时版本检查这些范围；不兼容的组合会被拒绝，除非 profile 授予精确的 `package@version` × `dsh-version` 豁免。源码工作区的 `workspace:*` peer 指向匹配的 DSH 发布版；打包清单会替换成该精确版本。范围语义、`version-exemptions` / `allow-version` 与崩溃、数据丢失风险见[插件管理器兼容性参考](../../boot/plugin-manager/README.zh.md#version-compatibility-and-exemptions)。

## Known Limitations and Deferred Work

- **不发布运行时 invariant companion；** skill 是不可变打包文件，引导是 `system-prompt/assemble` 监听，没有可独立观察的持久事件流。离线 turn 评分见 `scripts/score-skill-first.mjs`（每 turn 首个 `tool/call` 是否为 `skill`，以及派发 `subagent` / `subagent_fork` 之后同 turn 的 `list_agents` 次数）；它不在运行时强制行为。
- **不是上游 hook 二进制** — 引导是 Cordis `system-prompt/assemble` 监听，不是 `hooks/session-start`。
- **`complete` persona 会替换所有 section** — 组合中注册了 `complete` persona（agent preset）的 agent，其所有 prompt section（含 `skill:superpowers` 与 `skill:superpowers-worker`）都会被抑制。
- **随包 preamble 须避免 `{{...}}` 提示变量语法** — `loadBootstrapPreamble` 在插件 apply 时拒绝完整 `{{name}}` 组（对齐 skill-always-apply）；自定义 `skillsRoot` 若引入此类语法会在首轮前失败。
- **跨 harness 参考内容已移除** — 外平台工具对照、Anthropic 专属写作指南、以及特定 harness 的测试示例均省略；`dsh-tools.md` 是唯一平台适配，且必须写到足以支撑 SDD 的等待/续聊/模型路由。
- **上游同步为手工** — 无 vendored 子模块；移植即对照记录的各源 commit diff 后重放 dsh 适配。本地 `superpowers/` 检出仅供对照，已 gitignore。
- **`diagnosing-superpowers` 不进目录** — obra v6.4.1+ 提供依赖外 harness 会话转录路径与大量 prompt/template 树的会话诊断 skill；浅移植会误导。深 dsh 适配是独立功能，不是开放同步欠账。打包目录长度为 **41**。
- **peer 来自 DeepSeek Harness** — 本组合包不内嵌 `@deepseek-ai/dsh-*`；请安装到已有 CLI/base 栈的 profile。
- **fork 产品 base 可能挂载发布 scope** — 部分 fork 的 `dsh-base` 组合依赖 `@firefly0621/dsh-superpowers`，使产品默认与 npm 身份保持同一包；本 monorepo 仅通过 overlay patch 或 `dsh plugin add` 挂载。拆分私有 workspace 名与发布名仍暂缓。
- **描述碰撞检查先警告** — 打包目录 pairwise Jaccard ≥ 0.55 只记警告；在融合目录稳定后再提升为失败。
