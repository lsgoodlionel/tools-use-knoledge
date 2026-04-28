# AI 编程 Agent 对比与选型指南
> Claude Code（Anthropic）vs OpenAI Codex — 功能全景、场景选型、协作使用
> 最后更新：2026年4月

---

## 目录

1. [工具全景图](#一工具全景图)
2. [完整功能对比表](#二完整功能对比表)
3. [工具选型决策指南](#三工具选型决策指南)
4. [Claude Code 的独特优势](#四claude-code-的独特优势)
5. [OpenAI Codex 的独特优势](#五openai-codex-的独特优势)
6. [两者协作使用工作流](#六两者协作使用工作流)
7. [从 Copilot / Cursor 迁移指南](#七从-copilot--cursor-迁移指南)
8. [常见问题解答](#八常见问题解答)

---

## 一、工具全景图

### 核心定位

| 工具 | 一句话定位 | 最适合谁 |
|------|-----------|---------|
| **Claude Code** | 深度嵌入本地开发环境的 CLI Agent，用 Hooks 和权限系统精细控制行为 | 全职开发者，重视本地工作流、自动化和安全控制 |
| **OpenAI Codex** | 云端 + 多界面的编程 Agent，支持后台运行和非开发者使用 | 技术和非技术用户，需要多入口访问和云端后台执行 |

### 共同点

两个工具都具备：
- 自然语言驱动的**多步骤任务执行**（不仅是代码补全）
- 读取文件、运行命令、修改多文件、提交 Git 的完整能力
- **MCP（Model Context Protocol）**外部工具集成
- **Agent / 多代理**并行工作能力
- 项目指令文件（`CLAUDE.md` / `AGENTS.md`）定制行为
- Skills / 自定义命令系统

---

## 二、完整功能对比表

### 入口与界面

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **命令行 CLI** | ✅ 核心入口，功能最完整 | ✅ 支持，功能完整 |
| **桌面 App** | ❌ 无 | ✅ macOS + Windows（多线程管理） |
| **Web 界面** | ❌ 无独立 Web UI | ✅ chatgpt.com/codex |
| **IDE 扩展** | ✅ VS Code（官方）/ JetBrains | ✅ VS Code / Cursor / Windsurf |
| **移动端** | ❌ 无 | ❌ 无（通过 ChatGPT 间接） |
| **GitHub PR 评论触发** | ✅ `@claude` 触发（需安装 GitHub App） | ✅ `@codex` 触发（需连接 GitHub） |

### 认证与账号

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **账号要求** | Claude Pro（$20/月）起 | ChatGPT Plus（$20/月）起 |
| **API Key 方式** | ✅ `ANTHROPIC_API_KEY` | ✅ `OPENAI_API_KEY` |
| **OAuth 登录** | ✅ Claude.ai OAuth | ✅ ChatGPT OAuth |
| **设备码登录** | ✅ | ✅ |
| **企业/团队方案** | ✅ Team / Enterprise | ✅ Business / Enterprise |

### 配置系统

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **项目指令文件** | `CLAUDE.md`（多层级，支持子目录） | `AGENTS.md`（多层级，支持子目录） |
| **全局配置文件** | `settings.json`（权限声明） | `config.toml`（全功能配置） |
| **多套配置方案** | `settings.local.json`（个人私有） | `[profiles.*]`（自定义 Profile） |
| **配置优先级** | 全局 < 项目 < 本地 | 系统默认 < 全局 < 项目 < 命令行 |
| **环境变量支持** | ✅ `ANTHROPIC_*` + `CLAUDE_CODE_*` | ✅ `OPENAI_*` + codex 相关变量 |

### 权限与安全

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **权限模式** | `allowedTools` / `deny` 精细声明 | `approval_policy`（on-request / never / untrusted） |
| **沙箱技术** | 无内置沙箱（通过权限控制） | ✅ macOS seatbelt / Linux bubblewrap |
| **网络访问控制** | 通过 MCP 和 Bash 权限间接控制 | ✅ `network_access = true/false` 明确控制 |
| **文件系统范围** | 工作目录 + allowedTools 白名单 | `workspace-write` / `danger-full-access` 模式 |
| **受保护路径** | `.git/` `.claude/` 默认只读 | `.git/` `.codex/` 默认只读 |

### 自动化能力

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **Hooks 钩子系统** | ✅ 8 种事件（PreToolUse / PostToolUse 等） | ❌ 无等价机制 |
| **定时任务** | ✅ `/schedule`（云端执行） | ✅ Automations（桌面 App 配置） |
| **CI/CD 集成** | ✅ GitHub Actions 完整支持 | ✅ `codex exec` 非交互模式 |
| **非交互式执行** | ✅ `claude -p "任务"` | ✅ `codex exec "任务"` |
| **JSON 输出** | ✅ 流式事件输出 | ✅ `codex exec --json` |
| **Shell 脚本调用** | ✅ 通过 `-p` 参数 | ✅ 通过 `exec` 子命令 |

### Agent 与多代理

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **子代理（Subagents）** | ✅ 父子模型，定义 `.claude/agents/*.md` | ✅ 通过 SKILL.md + multi_agent 配置 |
| **Agent Teams** | ✅ P2P 网络，通过邮箱系统互通（实验性） | ✅ 多角色 Agent 并行（`multi_agent = true`） |
| **Worktree 隔离** | ✅ `--worktree` 参数自动创建 | ✅ Worktree 模式（桌面 App 内） |
| **云端后台 Agent** | ✅ `/schedule` 云端定时运行 | ✅ Cloud 模式（关闭电脑继续运行） |
| **Agent 监控** | Shift+↑/↓ 切换 Teammate 视图 | 实时日志查看 + 任务状态面板 |

### MCP 生态

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **MCP 配置方式** | `claude mcp add` 命令 / `.mcp.json` 文件 | `codex mcp add` 命令 / `config.toml` |
| **团队共享 MCP** | ✅ `.mcp.json` 提交到 Git | ✅ `[mcp_servers]` 在 config.toml 中 |
| **OAuth MCP 登录** | ✅ `claude mcp add --transport http` | ✅ `codex mcp login <server>` |
| **工具子集控制** | ❌ 全量工具 | ✅ `enabled_tools` 白名单 |
| **内置 Web 搜索** | ❌（需 MCP） | ✅ `web_search = "live/cached"` 原生支持 |

### 模型选择

| 功能维度 | Claude Code | OpenAI Codex |
|---------|-------------|--------------|
| **底层模型** | Claude Haiku 4.5 / Sonnet 4.6 / Opus 4.6 | GPT-5.5 / GPT-5.4 / codex-mini-latest |
| **模型切换** | `/model` 命令 / `--model` 参数 | `/model` 命令 / `--model` 参数 |
| **推理深度控制** | `think` / `ultrathink` 关键词 | `reasoning_effort = low/medium/high` |
| **规划 + 执行分离** | `/model opusplan`（Opus 规划 + Sonnet 执行） | `multi_agent = true` + 不同模型分配 |

---

## 三、工具选型决策指南

### 按用户类型选择

| 你是谁 | 推荐工具 | 理由 |
|--------|---------|------|
| **全职开发者（日常编码）** | Claude Code 为主 | CLI 深度集成、Hooks 自动化、Agent Teams |
| **非技术用户 / 产品经理** | Codex 为主 | Web 界面无需安装、自然语言友好 |
| **DevOps / 自动化工程师** | 两者均可 | Claude Code 的 Hooks 更强，Codex 的沙箱更安全 |
| **开源项目维护者** | Claude Code（GitHub App） | `@claude` PR 评论触发最成熟 |
| **企业团队** | 两者均部署 | Codex 给非技术成员，Claude Code 给开发者 |
| **初学者** | Codex 为主 | 桌面 App 引导更友好，Plan 模式更直观 |

### 按任务类型选择

| 任务 | 推荐工具 | 原因 |
|------|---------|------|
| **日常 Bug 修复** | Claude Code | 本地文件直接访问，无需 GitHub 连接 |
| **大型重构（后台跑）** | Codex Cloud 模式 | 可关电脑继续运行，完成后通知 |
| **代码审查** | 两者均可 | Claude Code `/simplify`；Codex `$code-review` |
| **生成测试** | Claude Code | Hooks 可在写完文件后自动运行测试 |
| **自动化 CI/CD** | Claude Code | GitHub Actions 集成更完整 |
| **数据分析与报告** | Codex | 实战场景模板更丰富 |
| **探索陌生代码库** | Claude Code | 子代理并行探索 + 上下文管理更强 |
| **定时自动化任务** | Codex（Automations） | 内置定时任务系统 |
| **团队协作工作流** | Codex（桌面 App） | 多线程管理 UI 更直观 |
| **安全敏感操作** | Codex | 沙箱隔离更严格（OS 级别） |

### 按技术栈选择

| 技术栈 | 推荐 |
|--------|------|
| Python / FastAPI / Django | 两者均可，Codex 的 AGENTS.md Python 模板更详细 |
| React / TypeScript / Node | 两者均可，Claude Code 的 CLAUDE.md JS 模板更详细 |
| Go / Rust | Claude Code（Hooks 可配置 gofmt/rustfmt 自动格式化） |
| 数据科学 / Jupyter | Codex（非交互式执行更适合批处理） |
| 移动端 iOS / Android | 两者均可（均需要 MCP 或本地工具链支持） |

---

## 四、Claude Code 的独特优势

### 1. Hooks 自动化钩子系统（无等价物）

Claude Code 的 Hooks 是其最独特的能力——在 Claude 操作的每个关键时机自动执行 Shell 命令：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.{ts,tsx})",
        "hooks": [{ "type": "command",
          "command": "npx tsc --noEmit 2>&1 | head -20" }]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [{ "type": "command",
          "command": "osascript -e 'display notification \"Claude 完成\" with title \"Claude Code\"'" }]
      }
    ]
  }
}
```

Codex 没有等价的 Hook 系统，类似需求只能通过 Automations 定时任务间接实现。

### 2. settings.json 细粒度权限控制

```json
{
  "permissions": {
    "allowedTools": ["Read", "Write(src/*)", "Bash(git *)"],
    "deny": ["Read(./.env)", "Bash(git push --force *)"]
  }
}
```

精确控制 Claude 可以读写哪些目录、可以执行哪些命令，适合企业安全合规场景。

### 3. Agent Teams（P2P 多代理网络）

Claude Code 的 Agent Teams 采用**对等网络架构**，各 Agent 通过邮箱系统互相发消息，可以互相质疑和校验结果。Codex 的多 Agent 是层级关系（父子模型），Claude Code 的 Teams 更适合需要多角度独立验证的场景。

### 4. 深度 IDE 集成

- VS Code 中的 **Diff 审查面板**（逐文件接受/拒绝改动）
- 直接读取 VS Code **Problems 面板**（红波浪线错误）
- 选中代码按 `Option+K` 直接引用到提示词
- **Extended Thinking 可视化**（推理过程可展开查看）

### 5. `.claudeignore` 精细排除

可以精确排除不需要 Claude 扫描的文件，减少 token 消耗：

```gitignore
node_modules/
*.min.js
dist/
.env*
```

---

## 五、OpenAI Codex 的独特优势

### 1. 桌面 App — 多线程任务管理

Codex 桌面 App 是 Claude Code 没有的独特入口：
- **可视化 Thread 管理**：同时管理多个任务线程
- **会话永久持久化**：重启 App 所有对话都在
- **本地 + 云端 + Worktree** 三种模式可视化切换
- **Automations 配置 UI**：图形化配置定时任务

### 2. Cloud 模式 — 真正的后台执行

```
Codex 云端任务特点：
- 运行在 OpenAI 服务器（你的机器可以关机）
- 独立的云端沙箱容器（比本地更安全）
- 完成后主动通知
- 直接推送到 GitHub PR
```

Claude Code 的 `/schedule` 也支持云端，但 Codex 的云端模式与桌面 App 深度集成，可视化程度更高。

### 3. 内置 Web 搜索

```toml
# 无需 MCP，直接开启实时搜索
web_search = "live"   # 实时搜索最新文档
web_search = "cached" # 使用缓存（速度更快）
```

Claude Code 需要配置 Brave Search 或类似 MCP 服务器才能搜索网络。

### 4. 沙箱安全隔离（OS 级别）

- **macOS**：使用系统 `seatbelt`（App Sandbox）
- **Linux**：使用 `bubblewrap` + seccomp 过滤

相比之下，Claude Code 的文件保护主要靠 `settings.json` 的声明式权限，而非 OS 级隔离。

### 5. Automations 定时任务系统

```
内置定时任务配置（桌面 App）：
名称：每日依赖安全检查
频率：工作日 09:30
任务：npm audit 发现高危漏洞时创建 Issue + 通知 Slack
运行环境：独立 Worktree（不影响主分支）
```

Claude Code 需要通过 `/schedule` 命令 + 外部 cron 实现类似功能。

### 6. 四种入口无缝共享配置

Web、桌面 App、CLI、IDE 扩展共享同一套 `config.toml` + `AGENTS.md` + Skills 配置，任意入口的设置自动同步。

---

## 六、两者协作使用工作流

两个工具并非互斥，组合使用可以发挥各自优势：

### 工作流一：Codex 后台 + Claude Code 前台

```
场景：开发新功能时同时处理遗留 Bug

Codex Cloud（后台运行，不占用本机）：
  → 在独立云端容器中：分析遗留代码库
  → 生成代码修复方案并提 PR
  → 运行完整测试套件

Claude Code（本地实时开发）：
  → 开发新功能（全速，本机资源）
  → Hooks 自动运行 lint 和类型检查
  → 完成后审查 Codex 提的 PR
```

### 工作流二：Codex 探索 + Claude Code 实现

```
第一阶段（Codex Cloud 或桌面 App）：
  → 分析整个代码库结构
  → 生成「需要修改的文件清单 + 改动建议」
  → 输出: design-proposal.md

第二阶段（Claude Code 本地）：
  → @design-proposal.md 作为上下文
  → 使用 Hooks 确保每步都有测试验证
  → 精细控制每个文件的修改权限
```

### 工作流三：并行多模型审查

```
同一份代码变更，分别提交给两个工具：
  → Claude Code /simplify：架构、重复代码、性能审查
  → Codex $code-review：安全、测试覆盖审查

两份报告合并：获得更全面的审查结果
（类似于让两个不同背景的工程师 Review 同一份 PR）
```

### 工作流四：API 集成（高级）

通过 Codex MCP 服务器，可以让 Claude Code 调用 Codex：

```python
# 在 Claude Code 的 Agent 中调用 Codex 处理特定任务
# Codex 作为 MCP 服务器运行：codex mcp
# Claude Code 通过 MCP 协议调用 Codex 的编码能力
```

---

## 七、从 Copilot / Cursor 迁移指南

### 思维模式转变

| 原有思维（Copilot / Cursor） | 新思维（Claude Code / Codex） |
|-----------------------------|------------------------------|
| 「帮我补全这一行代码」 | 「帮我实现这个功能，包括测试」 |
| 等待即时响应 | 允许 Agent 思考和规划（几分钟） |
| 逐行接受/拒绝建议 | 审查整个 Diff，决定接受/迭代 |
| 只在编辑器里工作 | Agent 自主运行命令、修改多文件 |
| 我控制每一步 | 我设定目标，Agent 选择路径 |
| 代码补全工具 | 结对编程伙伴 |

### 迁移步骤（推荐路径）

**Week 1：只读模式建立信任**
```bash
# 让 Claude Code 只解释和分析，不修改代码
"解释 src/auth/ 目录的认证流程"
"找出 src/services/ 中潜在的性能问题"
```

**Week 2：小范围修改，全量审查**
```bash
# 每次修改前开启 git 检查点
git add -A && git commit -m "checkpoint before claude"

# 任务完成后仔细看 diff
! git diff HEAD
```

**Week 3：配置 CLAUDE.md，建立项目规范**
```bash
# 让 Claude 生成项目的 CLAUDE.md
/init
```

**Week 4+：逐步扩大自动化范围**
- 配置 Hooks 自动格式化
- 创建常用任务的自定义命令
- 尝试 Subagents 并行工作

### 常见误区纠正

| 误区 | 正确做法 |
|------|---------|
| 任务越多越好，一口气塞入所有需求 | 每次一个清晰的任务，完成后验证再继续 |
| Claude 说完成了就信了 | 永远自己运行测试验证，不接受 AI 的「完成声明」 |
| 写了很长的提示词就够了 | 精准 > 冗长，@引用具体文件比描述更有效 |
| 等 AI 写完再看 | 复杂任务先用 Plan Mode 确认方向 |
| AI 不会出错 | 平均 10-15% 的概率会产生需要修复的错误 |

---

## 八、常见问题解答

**Q: 两个工具能同时用同一个代码库吗？**

可以，但要避免同时修改同一文件。建议：Codex 在独立 Worktree / 云端分支上工作，Claude Code 在主工作区工作，通过 PR 合并。

**Q: 哪个工具写的代码质量更高？**

没有明确优劣——质量取决于提示词质量、项目规范（CLAUDE.md / AGENTS.md 的详细程度）和验证方式。两者都要求你提供清晰的上下文并验证结果。

**Q: Claude Code 的 Hooks 能不能在 Codex 里用？**

不能直接迁移，Codex 没有 Hooks 系统。但可以把 Hook 的逻辑写入 AGENTS.md 作为指令（「每次修改 TypeScript 文件后运行 tsc --noEmit」），让 Codex 主动执行。

**Q: 两个工具的数据安全性如何？**

- Claude Code：代码发送到 Anthropic 的 API（可申请企业级零日志保留）
- Codex：本地模式代码在本地运行；云端模式发送到 OpenAI 服务器

企业敏感代码建议：查看各自的企业数据处理协议，配置 `.claudeignore` / AGENTS.md 排除敏感文件。

**Q: 初学者应该先学哪个？**

建议先学 **Codex**（桌面 App 版）：图形界面更友好，Plan 模式引导明确，Worktree 避免破坏主分支。掌握 Agent 工作流思维后，再切换到 Claude Code 的 CLI 工作流获得更强的自动化能力。

**Q: 两者的斜杠命令（`/`）一样吗？**

命令名称不同，但逻辑类似：
- `/model`（两者都有，切换模型）
- `/plan` 或 `Shift+Tab`（Claude Code）vs `/plan`（Codex CLI）
- `/simplify`（Claude Code，三并行代理审查）vs `$code-review`（Codex，调用 Skill）

**Q: API Key 方式和账号方式有何区别？**

| | 账号方式 | API Key 方式 |
|-|---------|-------------|
| 适合 | 日常开发、月付订阅 | CI/CD、自动化脚本 |
| 计费 | 月订阅（用量包含在内） | 按 token 计费 |
| 功能 | 完整（含云端同步） | 部分功能不可用 |
| 推荐 | 个人开发者 | 企业批量任务 |

---

> **总结：** 不必二选一。Claude Code 擅长本地工作流的精细控制，Codex 擅长多入口访问和云端后台执行。两者共享 Agent 工作模式的核心理念，学会一个后切换另一个的学习成本很低。
