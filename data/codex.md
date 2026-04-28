# OpenAI Codex 初学者完整全套教程
> 覆盖云端、桌面App、CLI命令行、IDE扩展四大使用方式的全面操作指南
> 最后更新：2026年4月（基于最新官方文档）

---

## 目录

1. [什么是 Codex？](#一什么是-codex)
2. [账号与套餐要求](#二账号与套餐要求)
3. [四种使用方式总览](#三四种使用方式总览)
4. [方式一：Codex Cloud 云端网页版](#四方式一codex-cloud-云端网页版)
5. [方式二：Codex 桌面 App](#五方式二codex-桌面-app)
6. [方式三：Codex CLI 命令行](#六方式三codex-cli-命令行)
7. [方式四：IDE 扩展（VS Code / Cursor / Windsurf）](#七方式四ide-扩展)
8. [配置文件 config.toml 详解](#八配置文件-configtoml-详解)
9. [AGENTS.md 项目指令文件详解](#九agentsmd-项目指令文件详解)
10. [Skills 技能系统](#十skills-技能系统)
11. [MCP 外部工具集成](#十一mcp-外部工具集成)
12. [Automations 自动化任务](#十二automations-自动化任务)
13. [提示词 Prompting 技巧全指南](#十三提示词-prompting-技巧全指南)
14. [模型选择指南](#十四模型选择指南)
15. [权限与沙箱安全机制](#十五权限与沙箱安全机制)
16. [Git 工作流与 Worktree](#十六git-工作流与-worktree)
17. [实战使用场景与示例提示词](#十七实战使用场景与示例提示词)
18. [常见问题与故障排查](#十八常见问题与故障排查)
19. [新手必读：核心工作原则](#十九新手必读核心工作原则)
20. [进阶：多 Agent 并行工作流](#二十进阶多-agent-并行工作流)

---

## 一、什么是 Codex？

### 核心定义

OpenAI Codex 是一个**云端 + 本地的 AI 软件工程 Agent**，它不仅仅是代码补全工具，而是一个能**自主规划、执行多步骤任务**的编程代理。

它与普通 AI 工具的根本区别：

| 普通 AI 代码助手（如 Copilot）| OpenAI Codex |
|---|---|
| 逐行补全代码 | 接受高层描述，自主规划并完成整个任务 |
| 只在编辑器内工作 | 可读文件、运行命令、修改多个文件、跑测试 |
| 结果即时呈现 | 可以在后台运行，完成后通知你 |
| 单步操作 | 多步骤、多轮迭代的 Agent 工作流 |
| 不操作 Git | 可直接创建 Pull Request |

### Codex 能做什么？

- **写代码**：根据自然语言描述生成符合项目风格的代码
- **理解陌生代码库**：读取并解释复杂或遗留代码
- **代码审查**：分析代码，找出 Bug、逻辑错误和未处理的边界情况
- **调试修复**：追踪错误根因，提出针对性修复方案
- **自动化开发任务**：重构、测试生成、数据库迁移、项目配置等重复工作
- **生成 Pull Request**：直接在 GitHub 上提出 PR，供人工审查
- **并行处理多任务**：同时在多个 thread 中处理多个独立任务

### 底层模型

Codex 的核心模型是 **codex-1**（基于 OpenAI o3 针对软件工程优化的版本），通过强化学习在真实编码任务上训练，使其生成的代码风格贴近人类开发者、符合 PR 规范，能迭代运行测试直到通过。

---

## 二、账号与套餐要求

### 哪些套餐可以用 Codex？

| ChatGPT 套餐 | Codex 访问权限 |
|---|---|
| **Free / Go** | 限时免费开放（活动期间） |
| **Plus** | ✅ 包含 Codex（2025年6月起） |
| **Pro** | ✅ 包含，速率限制更高 |
| **Business** | ✅ 包含 |
| **Edu** | ✅ 包含 |
| **Enterprise** | ✅ 包含，最高权限 |
| **API Key（按量计费）** | ✅ 支持，用于自动化脚本和 CI/CD |

> **提示**：使用 ChatGPT 账号登录 CLI 和桌面 App，**无额外费用**，Codex 用量包含在套餐内。使用 API Key 则按 token 计费。

### 登录方式

Codex 支持三种认证方式：

1. **ChatGPT OAuth（推荐）**：浏览器弹出，授权后自动完成
2. **设备码登录**：适合无法打开浏览器的远程环境
3. **OpenAI API Key**：适合 CI/CD 等自动化场景

---

## 三、四种使用方式总览

```
┌─────────────────────────────────────────────────────┐
│              OpenAI Codex 四种使用入口               │
├─────────────┬──────────────┬──────────┬─────────────┤
│  Cloud 云端 │  桌面 App    │ CLI 终端 │ IDE 扩展    │
│ (网页版)    │ (macOS/Win)  │ (终端)   │ (VS Code等) │
├─────────────┼──────────────┼──────────┼─────────────┤
│ 无需安装    │ 图形界面     │ 开发者   │ 无缝集成    │
│ 连接GitHub  │ 多线程管理   │ 最灵活   │ 编辑器内    │
│ 适合非开发者│ 会话持久     │ 脚本自动化│ 代码上下文  │
└─────────────┴──────────────┴──────────┴─────────────┘
         ↓ 共享同一套配置 config.toml + AGENTS.md ↓
```

所有四种方式**共享相同的配置层**：`~/.codex/config.toml`、`.codex/config.toml`、`AGENTS.md`、Skills 和登录缓存，在任意一种方式中做的配置，切换到其他方式时自动生效。

---

## 四、方式一：Codex Cloud 云端网页版

### 4.1 访问方式

直接打开浏览器，访问：**https://chatgpt.com/codex**

登录你的 ChatGPT 账号即可。也可以在 GitHub Pull Request 评论中输入 `@codex` 委托任务（需要已登录 ChatGPT 并连接了 GitHub）。

### 4.2 连接 GitHub 仓库（首次必做）

1. 打开 chatgpt.com/codex
2. 点击右上角的**环境设置（Environment Settings）**
3. 选择**连接 GitHub 仓库**
4. 授权 GitHub OAuth，选择你的仓库
5. 配置完成

> **重要**：云端模式的每个任务都在一个**独立的云端沙箱容器**中运行，容器中预加载了你的 GitHub 仓库，任务结束后容器销毁。

### 4.3 发起第一个任务

1. 在文本框中输入你的任务描述（用自然语言即可）
2. 点击发送，Codex 开始在云端执行
3. 你可以实时查看日志输出，了解 Codex 的每一步操作
4. 可以关闭网页，稍后回来继续查看（任务在后台继续）

**示例任务提示词：**
```
在 src/auth.py 中找到 login 函数，为它添加速率限制逻辑：
- 同一 IP 在 5 分钟内最多允许 10 次登录尝试
- 超出限制后返回 429 状态码和 Retry-After 头
- 在 tests/test_auth.py 中为新功能添加单元测试
```

### 4.4 审查结果

任务完成后：
- 查看 **diff 视图**，看到所有文件的具体改动
- 点击每一行改动可以提供反馈（作为下一轮 Codex 的上下文）
- 点击**Create Pull Request**直接在 GitHub 创建 PR
- 点击**Apply to Local**将改动同步到本地环境
- 如果不满意，可以继续对话迭代

### 4.5 通过 GitHub PR 评论委托任务

在任意 GitHub PR 的评论区输入：
```
@codex 请为这个 PR 添加缺少的单元测试，覆盖边界情况
```

Codex 会自动开始任务，完成后在 PR 下方回复结果。

### 4.6 云端模式的优势与限制

**优势：**
- 无需安装任何软件
- 任务在 OpenAI 服务器运行，不消耗本地资源
- 支持长时间运行的大型任务
- 可以在沙箱中安全运行代码

**限制：**
- 必须连接 GitHub 才能访问你的代码
- 沙箱环境默认不能访问外网（除非手动开启）
- 无法直接访问本地文件系统

---

## 五、方式二：Codex 桌面 App

### 5.1 下载安装

访问官网下载（支持 macOS 和 Windows）：
- macOS Apple Silicon 版
- macOS Intel 版（Intel 芯片 Mac）
- Windows 版（2026年3月起支持）

安装后打开，使用 ChatGPT 账号登录。

### 5.2 界面结构详解

```
┌─────────────────────────────────────────────────────────────┐
│  左侧边栏                │  主工作区                         │
│  ─────────────           │  ─────────────────────────────   │
│  📁 项目列表              │  当前 Thread 聊天窗口             │
│    ├── 项目A              │                                  │
│    │   ├── Thread 1      │  [Codex 的回复和操作日志]         │
│    │   └── Thread 2      │                                  │
│    └── 项目B              │  ─────────────────────────────   │
│                          │  右侧面板：diff 查看 / 代码预览   │
│  🔧 设置                  │                                  │
│  ⚡ 自动化                 │  [文件改动的 diff 视图]           │
│  📦 插件                  │                                  │
│                          │  底部：输入框 / 发送任务           │
└─────────────────────────────────────────────────────────────┘
```

**核心概念：**

- **Project（项目）**：对应你电脑上的一个文件夹，Codex 在这个目录内操作
- **Thread（线程）**：类似 ChatGPT 的一次对话，一个 Project 下可以有多个 Thread
- **Thread 的状态**：Running（运行中）、Completed（完成）、Paused（暂停）

### 5.3 创建项目的推荐做法

```
建议的文件夹结构：
~/Codex/
  ├── 项目A-博客后端/
  ├── 项目B-移动端App/
  └── 项目C-数据分析/
```

1. 在侧边栏点击 **New Project**
2. 选择电脑上对应的文件夹
3. 项目会出现在左侧列表中

**提示**：点击 **New Thread**，可以选择关联到现有项目，或创建独立的 Standalone Thread（不绑定项目，适合临时研究和规划任务）。

### 5.4 三种运行模式详解

#### Local（本地）模式
- 任务在你的机器上运行
- Codex 可以读写本地文件、执行终端命令
- 适合日常开发任务
- 如果电脑休眠，任务可能暂停（可在设置中关闭此行为）

#### Cloud（云端）模式
- 任务发送到 OpenAI 服务器执行
- 需要连接 GitHub 仓库
- 可以关闭电脑，任务在云端继续运行
- 完成后可同步回本地或直接提 PR

#### Worktree 模式
- Codex 将当前分支克隆到一个独立的 Git Worktree
- 主工作区代码不受影响
- 可以同时运行多个 Agent，各自在不同 Worktree 中工作，互不干扰

### 5.5 会话持久性（Codex App 最大优势）

与命令行工具不同，桌面 App 的所有会话**永久保存**：

- 强制关闭 App → 重新打开 → 所有 Thread 都在
- 你积累的上下文（项目结构、你的偏好、之前的对话历史）完整保留
- 左侧边栏清楚显示哪些是本地任务、哪些是云端任务、哪些是 Worktree

### 5.6 并行运行多个任务

```
Thread 1：重构 API 接口层            [正在运行 ...]
Thread 2：为用户模块添加测试          [已完成 ✓]
Thread 3：更新 README 文档            [正在运行 ...]
Thread 4：修复生产环境的性能 Bug      [等待审查 ...]
```

- 每个 Thread 独立运行，互不干扰
- 同时在不同 Thread 中工作，告别等待
- **注意**：避免两个 Thread 同时修改同一个文件

### 5.7 重要设置项（Settings）

进入设置可配置：
- **权限级别**：Codex 可以在没有确认的情况下执行哪些操作
- **个性化**：Codex 的回复风格和工作方式
- **休眠行为**：是否允许电脑睡眠时 Codex 继续工作
- **模型选择**：切换不同的 AI 模型（GPT-5.5、GPT-5.4 等）

### 5.8 Plan 模式（推荐新手使用）

使用 `/plan` 或 `Shift+Tab` 切换到 Plan 模式：

- Codex 先收集上下文、提出澄清问题、制定详细计划
- **你审查并确认计划**
- 然后再开始实际编码

适合复杂任务或你对需求描述不太清晰的场景。

---

## 六、方式三：Codex CLI 命令行

### 6.1 安装

**方法一：npm（推荐）**
```bash
npm install -g @openai/codex
```

**方法二：Homebrew（macOS）**
```bash
brew install --cask codex
```

**方法三：直接下载二进制文件**

前往 GitHub Releases 页面下载适合你平台的可执行文件，重命名为 `codex`，放入 `$PATH` 中。

### 6.2 平台支持

| 平台 | 支持方式 |
|---|---|
| macOS | 原生支持（Apple Silicon 和 Intel） |
| Windows | PowerShell 原生支持 + WSL2 Linux 环境 |
| Linux | 原生支持 |

**Windows WSL2 设置：**
```bash
# 在 WSL2 中安装
npm install -g @openai/codex
# 建议在 WSL 文件系统内工作（~/projects/），
# Windows 文件挂载在 /mnt/c/，但性能较差
```

### 6.3 首次运行与认证

```bash
codex
# 首次运行会弹出浏览器，完成 ChatGPT OAuth 登录
# 或通过设备码流程登录
```

使用 API Key 登录（适合自动化）：
```bash
export OPENAI_API_KEY="sk-your-api-key-here"
codex  # 不会弹出浏览器
```

查看登录状态：
```bash
codex login status  # 返回 0 表示已登录，可用于脚本判断
```

退出登录：
```bash
codex login remove  # 清除所有认证凭证
```

### 6.4 启动与基础用法

```bash
# 最基础：进入交互式 TUI 界面
codex

# 带初始任务启动（仍然是交互式）
codex "帮我审查 src/ 目录下的代码，找出潜在问题"

# 在指定目录中启动
codex --cwd /path/to/project "分析项目结构"

# 非交互式：直接执行，输出 JSON 事件流
codex exec "运行测试并修复失败的用例"

# 全自动模式（自动批准，无需确认）
codex --full-auto "重构 utils.py，改善代码可读性"

# 带图片输入（截图、UI 设计稿等）
codex --image screenshot.png "根据这个截图实现对应的 UI 组件"
```

### 6.5 交互式 TUI 界面操作指南

启动后进入全屏终端 UI，包含：

```
┌────────────────────────────────────────────┐
│  Codex CLI TUI 界面                        │
├────────────────────────────────────────────┤
│                                            │
│  [Codex 的输出和操作日志]                   │
│                                            │
│  > 正在读取 src/auth.py...                  │
│  > 发现问题：第 42 行未处理 None 值          │
│  > 已修改文件，运行测试...                   │
│  > ✅ 所有测试通过                          │
│                                            │
├────────────────────────────────────────────┤
│  输入框：你的消息或命令                     │
└────────────────────────────────────────────┘
```

**键盘快捷键：**

| 快捷键 | 功能 |
|---|---|
| `Tab`（任务运行时）| 排队输入下一条指令（任务完成后自动发送） |
| `Ctrl+R` | 搜索历史提示词 |
| `Ctrl+O` 或 `/copy` | 复制最新输出 |
| `Ctrl+C` 或 `/exit` | 退出会话 |
| `Ctrl+L` | 清屏（不重置对话） |
| `↑ / ↓` | 浏览草稿历史 |

### 6.6 斜杠命令（Slash Commands）完整列表

在 TUI 内输入以下命令（以 `/` 开头）：

| 命令 | 功能 |
|---|---|
| `/model` | 切换 AI 模型（GPT-5.5、GPT-5.4 等） |
| `/permissions` | 切换权限/审批模式（Auto / On-Request / Full Access） |
| `/plan` | 切换到 Plan 模式（先规划再执行） |
| `/skills` | 查看可用的 Skills 列表 |
| `/review` | 触发代码审查 |
| `/clear` | 清空对话，开始新会话 |
| `/copy` | 复制最新输出 |
| `/theme` | 切换 TUI 主题（浅色/深色等） |
| `/title` | 为当前会话设置标题 |
| `/feedback` | 提交反馈给 OpenAI |
| `/exit` | 退出 Codex |
| `!命令` | 直接在沙箱中运行 Shell 命令 |
| `$技能名` | 调用指定的 Skill |

### 6.7 会话管理

```bash
# 恢复最近的会话
codex resume --last

# 从选择器中选择一个历史会话恢复
codex resume

# 恢复包含当前目录以外的所有历史会话
codex resume --all

# 恢复指定 Session ID 的会话
codex resume SESSION_ID

# Fork（分叉）一个会话，保留原始记录
codex fork --last     # 从最近的会话 fork
codex fork            # 从选择器中选择要 fork 的会话
```

### 6.8 exec 非交互式执行（适合 CI/CD）

```bash
# 基础 exec
codex exec "运行所有单元测试并修复报错"

# 输出 JSON 格式（适合脚本解析）
codex exec --json "分析代码质量" > result.json

# 将结果写入文件
codex exec --output report.md "生成本次代码变更的说明文档"

# 从 stdin 传入数据
echo "请分析这段错误日志：" | codex exec --stdin "分析日志并给出修复建议"

# 指定 JSON Schema 验证输出
codex exec --schema schema.json "提取代码中的所有函数签名"
```

### 6.9 Shell 自动补全设置

```bash
# Bash
codex completion bash >> ~/.bashrc

# Zsh
echo 'eval "$(codex completion zsh)"' >> ~/.zshrc
# 如遇 compdef 错误，在上面那行之前加：
echo 'autoload -Uz compinit && compinit' >> ~/.zshrc

# Fish
codex completion fish >> ~/.config/fish/config.fish
```

设置后重开终端，输入 `codex` 按 Tab 即可补全命令。

### 6.10 升级 CLI

```bash
# 通过 npm 升级
npm update -g @openai/codex

# CLI 会自动检测新版本并提示升级
```

### 6.11 Feature Flags 功能开关

```bash
# 列出所有功能开关及状态
codex feature list

# 临时启用某功能（当次运行有效）
codex --enable multi_agent "你的任务"

# 临时禁用某功能
codex --disable feature_name "你的任务"

# 永久启用/禁用（写入 config.toml）
codex feature enable shell_snapshot
codex feature disable fast_mode
```

---

## 七、方式四：IDE 扩展

### 7.1 安装扩展

支持的 IDE：
- **VS Code**：在扩展商店搜索 "OpenAI Codex"
- **Cursor**：同上
- **Windsurf**：同上

安装完成后，扩展出现在左侧边栏（可能在折叠区域，需要点击展开）。

### 7.2 登录与基础使用

1. 点击扩展图标
2. 点击 **Sign in with ChatGPT** 或输入 API Key
3. Codex 默认以 **Agent 模式**启动（可以读文件、执行命令、写改动）
4. 直接在输入框描述你的任务

### 7.3 IDE 扩展特有功能

**自动上下文注入**：
IDE 扩展会自动将以下信息注入提示词：
- 当前打开的所有文件列表
- 你当前选中的代码片段（光标位置）

这意味着你可以先选中一段代码，然后直接问 "解释这段代码" 或 "帮我重构这个函数"，无需手动粘贴代码。

**打开配置文件**：
点击扩展右上角的齿轮图标 → **Codex Settings** → **Open config.toml**，可以直接编辑配置文件。

**MCP 设置**：
点击齿轮图标 → **MCP Settings** → **Open config.toml**，配置外部工具连接。

### 7.4 IDE 与其他方式的共享配置

IDE 扩展和 CLI 使用**完全相同的配置层**：

```
~/.codex/config.toml          ← 用户级全局配置（所有项目共享）
.codex/config.toml            ← 项目级配置（仅当前项目）
AGENTS.md / .agents/          ← 项目指令文件
~/.agents/skills/             ← 用户级 Skills
.agents/skills/               ← 项目级 Skills
```

在 CLI 中配置好模型和 MCP 服务器后，在 IDE 扩展中无需重新配置，直接使用。

---

## 八、配置文件 config.toml 详解

### 8.1 配置文件位置

```bash
# 用户级配置（所有项目共用）
~/.codex/config.toml

# 项目级配置（仅当前项目，优先级更高）
/your-project/.codex/config.toml
```

**配置优先级（从高到低）**：
1. 命令行 `--config` 参数
2. 项目级 `.codex/config.toml`
3. 用户级 `~/.codex/config.toml`
4. 系统默认值

### 8.2 完整配置示例与说明

```toml
# ~/.codex/config.toml

################################
# 核心模型设置
################################

# 主要使用的模型
model = "gpt-5.5"
# 可选值: "gpt-5.5", "gpt-5.4", "gpt-5.3-codex", "gpt-5.4-mini", "codex-mini-latest"
# 如果 gpt-5.5 不可用，使用 gpt-5.4

################################
# 权限审批策略
################################

# 审批策略：what gets reviewed before running
# "on-request" = 有风险的操作才需要确认（推荐日常使用）
# "never"      = 完全不需要确认（自动化场景）
# "untrusted"  = 最严格，几乎每步都确认
approval_policy = "on-request"

################################
# 沙箱模式
################################

# 沙箱策略：控制 Codex 的文件系统访问范围
# "workspace-write"  = 只能读写工作目录（推荐）
# "danger-full-access" = 完全访问（CI/CD 隔离环境才用）
sandbox_mode = "workspace-write"

################################
# 沙箱细节配置
################################

[sandbox_workspace_write]
# 是否允许访问 /tmp 目录
exclude_slash_tmp = false

# 是否允许访问 $TMPDIR 变量指向的目录
exclude_tmpdir_env_var = false

# 是否允许出站网络访问（默认关闭）
# 开启后可以 npm install、curl 等
network_access = false

# 额外允许写入的目录（在工作目录之外）
writable_roots = [
  "/Users/yourname/.pyenv/shims"
]

################################
# Web 搜索
################################

# "off"    = 禁用
# "cached" = 使用缓存（默认，更快）
# "live"   = 实时搜索（最新信息，较慢）
web_search = "cached"

################################
# 自动代码审查
################################

[auto_review]
# 自动审查时 Codex 遵循的规则（自然语言描述）
policy = """
代码审查规范：
- 检查是否有 SQL 注入风险
- 确保所有用户输入都经过验证
- 检查敏感信息是否被硬编码
- 确保错误处理完整
"""

################################
# 记忆功能
################################

[memories]
# 是否从对话中生成记忆摘要（跨会话使用）
generate_memories = true
# 是否在新对话中应用之前的记忆
use_memories = true
# 当使用 MCP 或网络搜索时是否禁用记忆生成
disable_on_external_context = false

################################
# MCP 服务器配置
################################

[mcp_servers]

# 示例：Context7（免费的开发文档 MCP 服务器）
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]
enabled = true

# 示例：自定义文档服务器
[mcp_servers.docs]
command = "docs-server"
args = ["--port", "4000"]
enabled = true
# required = true  # 如果此服务器无法启动，则 Codex 也无法启动
env = { API_KEY = "your-key" }

# 示例：HTTP 类型的 MCP 服务器
[mcp_servers.my-http-server]
url = "https://mcp.example.com/sse"
bearer_token_env_var = "MY_SERVER_TOKEN"

################################
# 功能开关
################################

[features]
# 是否启用多 Agent 并行工作流（实验性）
multi_agent = true

# 是否启用 Shell 快照（加速重复命令）
shell_snapshot = true

# 是否阻止电脑在任务运行时进入休眠
prevent_idle_sleep = true

# 是否启用 Codex 个性化（语气和风格）
personality = true

################################
# 配置 Profile（多套配置方案）
################################

# 定义"严格"配置方案
[profiles.strict]
approval_policy = "untrusted"
sandbox_mode = "workspace-write"

[profiles.strict.sandbox_workspace_write]
network_access = false

# 定义"自动化"配置方案（CI/CD 用）
[profiles.auto]
approval_policy = "never"
sandbox_mode = "danger-full-access"
```

### 8.3 命令行临时覆盖配置

```bash
# 临时切换模型
codex --model gpt-5.4 "你的任务"

# 临时开启网络访问（当次运行有效）
codex --config sandbox_workspace_write.network_access=true "npm install"

# 临时切换沙箱模式
codex --sandbox workspace-write "你的任务"

# 使用指定 Profile
codex --profile auto "运行测试"

# 禁用特定 MCP 服务器
codex --config mcp_servers.context7.enabled=false "你的任务"
```

---

## 九、AGENTS.md 项目指令文件详解

### 9.1 什么是 AGENTS.md？

AGENTS.md 是放在代码仓库中的**项目工作手册**，告诉 Codex：
- 这个项目的结构和规范
- 如何运行测试和构建
- 代码风格和提交规范
- 特殊注意事项和禁止操作

类比：就像给一个新来的开发同事写的"项目入职文档"，只不过这个同事是 AI。

### 9.2 文件位置与发现规则

Codex 会**从当前工作目录向上遍历**，收集所有找到的 AGENTS.md 文件：

```
项目根目录/
├── AGENTS.md              ← 全局项目指令（最先读取）
├── src/
│   ├── AGENTS.md          ← src 目录专用指令
│   ├── auth/
│   │   └── AGENTS.md      ← auth 模块专用指令
│   └── api/
│       └── AGENTS.md      ← api 模块专用指令
└── tests/
    └── AGENTS.md          ← 测试目录专用指令
```

所有找到的 AGENTS.md 内容会**拼接在一起**作为 Codex 的上下文（从根到当前目录），越靠近当前文件的指令优先级越高。

还可以在用户家目录放全局指令：
```
~/.agents/AGENTS.md        ← 对你所有项目生效的个人全局指令
```

### 9.3 完整 AGENTS.md 示例（Python 项目）

```markdown
# 项目：后端 API 服务

## 项目概览
这是一个基于 FastAPI + PostgreSQL 的 REST API 服务。
主要功能：用户认证、订单管理、支付处理。

## 技术栈
- Python 3.11+
- FastAPI 0.110+
- SQLAlchemy 2.0（异步）
- PostgreSQL 15
- Redis（缓存和任务队列）
- Pytest（测试框架）

## 目录结构
```
src/
  api/        # 路由层（FastAPI router）
  services/   # 业务逻辑层
  models/     # 数据库模型（SQLAlchemy ORM）
  schemas/    # 请求/响应数据结构（Pydantic）
  core/       # 核心配置、数据库连接、中间件
  utils/      # 工具函数
tests/
  unit/       # 单元测试
  integration/ # 集成测试
migrations/   # Alembic 数据库迁移文件（禁止手动修改）
```

## 开发环境搭建
```bash
# 安装依赖
pip install -e ".[dev]"

# 启动本地数据库（Docker）
docker-compose up -d postgres redis

# 运行数据库迁移
alembic upgrade head

# 启动开发服务器
uvicorn src.main:app --reload
```

## 测试命令
```bash
# 运行所有测试
pytest tests/ -v

# 运行单元测试
pytest tests/unit/ -v

# 运行集成测试（需要本地数据库）
pytest tests/integration/ -v

# 运行测试并生成覆盖率报告
pytest --cov=src --cov-report=html tests/
```

## 代码规范

### 格式化
- 使用 Black 格式化（行宽 88）
- 使用 isort 排序 import
- 提交前必须通过：`black src/ tests/` 和 `isort src/ tests/`

### 类型注解
- **所有**函数和方法都必须有完整的类型注解
- 使用 `from __future__ import annotations` 支持 Python 3.9 前的语法
- 运行 `mypy src/` 检查类型

### 命名规范
- 变量和函数：`snake_case`
- 类名：`PascalCase`
- 常量：`UPPER_SNAKE_CASE`
- 私有属性：`_leading_underscore`

## API 设计规范
- 所有端点必须有 Pydantic Schema 验证
- 响应统一使用 `{"data": ..., "message": "...", "code": 200}` 格式
- 错误响应使用 HTTPException，不要直接返回字符串
- 所有需要认证的端点添加 `Depends(get_current_user)` 依赖

## 数据库操作规范
- 禁止在路由层直接写 SQL，必须通过 Service 层
- 所有数据库操作使用异步 Session（`AsyncSession`）
- 禁止直接修改 `migrations/` 目录中的文件
- 新增表结构变更必须用 `alembic revision --autogenerate -m "描述"`

## 安全规范
- 禁止在代码中硬编码任何密钥、密码或 Token
- 所有配置从环境变量读取（见 `src/core/config.py`）
- 用户密码必须使用 `passlib` 的 `bcrypt` 加密
- SQL 查询必须通过 SQLAlchemy ORM，禁止拼接原始 SQL

## PR 提交规范
- 标题格式：`类型: 简短描述`（类型：feat/fix/refactor/test/docs）
- 示例：`feat: 添加用户头像上传功能`
- 每个 PR 必须包含对应的测试
- 禁止在单个 PR 中混合功能开发和 Bug 修复

## 禁止操作
- 不要修改 `migrations/` 目录中的现有迁移文件
- 不要删除 `tests/` 目录中的现有测试
- 不要修改 `pyproject.toml` 中的 Python 版本要求
- 不要使用 `time.sleep()` 在测试中，改用 `asyncio.sleep()`
```

### 9.4 AGENTS.md 示例（JavaScript/Node.js 项目）

```markdown
# 项目：前端 React 应用

## 技术栈
- React 18 + TypeScript 5
- Vite（构建工具）
- Tailwind CSS
- React Query（状态管理）
- Vitest + Testing Library（测试）

## 常用命令
```bash
npm run dev          # 启动开发服务器（localhost:3000）
npm run build        # 构建生产版本
npm run test         # 运行所有测试
npm run test:ui      # 可视化测试界面
npm run lint         # ESLint 检查
npm run type-check   # TypeScript 类型检查
```

## 组件规范
- 所有组件使用函数式组件 + Hooks
- 组件文件和对应测试文件放在同一目录：
  ```
  components/Button/
    ├── Button.tsx
    ├── Button.test.tsx
    └── index.ts
  ```
- 每个组件必须导出 TypeScript 类型定义

## 状态管理
- 服务端状态：使用 React Query（useQuery / useMutation）
- 客户端 UI 状态：useState 或 useReducer
- 禁止使用 Redux（项目已迁移到 React Query）

## 样式规范
- 只使用 Tailwind CSS，禁止内联 style 和单独的 CSS 文件
- 响应式断点：mobile-first（先写移动端，再用 md: lg: 覆盖）
```

### 9.5 用 AGENTS.override.md 覆盖规则

如果你需要临时覆盖某些规则（不修改主文件），可以创建：

```
项目根目录/AGENTS.override.md
```

这个文件的内容会**追加在 AGENTS.md 之后**，优先级更高，适合实验性改动或临时绕过某些限制。

---

## 十、Skills 技能系统

### 10.1 什么是 Skills？

Skills（技能）是**可复用的任务工作流**，将一套操作指令封装成可以随时调用的"工具"。

适合将以下内容封装成 Skill：
- 代码审查流程
- Bug 分类和处理步骤
- 文档生成规范
- 数据清洗流程
- 部署检查清单

### 10.2 Skills 存储位置

```
~/.agents/skills/             ← 用户级 Skills（个人所有项目可用）
  └── code-review/
      └── SKILL.md

.agents/skills/               ← 项目级 Skills（仅当前项目）
  └── bug-triage/
      └── SKILL.md

$HOME/.codex/skills/          ← 另一种用户级位置（兼容）
```

### 10.3 创建 Skill

每个 Skill 是一个**包含 SKILL.md 的文件夹**：

```
.agents/skills/code-review/
└── SKILL.md
```

**SKILL.md 格式：**

```markdown
---
name: code-review
description: >
  执行全面的代码审查。当用户说"帮我审查代码"、
  "review this PR" 或"检查代码质量"时触发。
  不用于性能分析或安全审计（那是其他 Skill 的工作）。
---

# 代码审查 Skill

执行以下步骤完成代码审查：

## 第一步：理解改动范围
1. 运行 `git diff HEAD~1` 查看最新改动
2. 读取所有被修改的文件
3. 理解改动的业务背景

## 第二步：代码质量检查
- 检查是否有明显的逻辑错误
- 验证所有函数都有类型注解
- 确认错误处理是否完整
- 检查是否有重复代码（DRY 原则）

## 第三步：安全检查
- 检查是否有 SQL 注入风险
- 检查用户输入是否经过验证
- 确认没有硬编码的密钥

## 第四步：测试覆盖
- 检查新代码是否有对应测试
- 运行 `pytest tests/ -v` 确认测试通过

## 第五步：生成审查报告
以 Markdown 格式输出：
- 发现的问题（按严重程度分类）
- 改进建议
- 总体评分（1-10）
```

### 10.4 调用 Skill

**显式调用：**
```
# 在提示词中明确提到
$code-review  ← 使用 $ 符号调用

# 或直接用名字
"使用 code-review skill 审查这个文件"
```

**隐式调用：**
Codex 会根据你的任务描述自动匹配合适的 Skill。例如你说"帮我审查代码"，Codex 会自动找到并使用 code-review Skill。

**在 TUI 中：**
```
/skills         ← 查看所有可用 Skill 列表
$              ← 输入 $ 后按 Tab，可以选择 Skill
```

### 10.5 安装社区 Skills

```bash
# 使用内置的 skill-installer
$skill-installer

# 然后告诉它你想安装什么：
# "安装 linear skill"
# "从 GitHub openai/skills 仓库安装 code-review skill"
```

### 10.6 在 config.toml 中管理 Skills

```toml
# 禁用某个 Skill（不删除文件）
[[skills.config]]
path = "/Users/yourname/.agents/skills/code-review/SKILL.md"
enabled = false
```

---

## 十一、MCP 外部工具集成

### 11.1 什么是 MCP？

MCP（Model Context Protocol）是一个开放标准，允许 Codex 连接外部工具和服务，如：
- GitHub / GitLab（操作 Issue、PR）
- Linear（任务管理）
- Slack（发消息）
- Notion / Confluence（文档）
- 数据库（查询 PostgreSQL、MySQL 等）
- 自定义内部工具

### 11.2 添加 MCP 服务器

**方法一：命令行快速添加**

```bash
# 添加 Context7（免费开发文档服务器）
codex mcp add context7 -- npx -y @upstash/context7-mcp

# 添加自定义服务器
codex mcp add my-server --env API_KEY=xxx -- node my-mcp-server.js

# 查看所有已配置的 MCP 服务器
codex mcp list

# 查看某个服务器的配置详情
codex mcp show context7

# 删除服务器
codex mcp remove context7
```

**方法二：直接编辑 config.toml**

```toml
[mcp_servers]

# STDIO 类型（本地进程）
[mcp_servers.linear]
command = "npx"
args = ["-y", "@linear/mcp-server"]
env_vars = ["LINEAR_API_KEY"]   # 从本地环境变量读取
enabled = true

# HTTP/SSE 类型（远程服务）
[mcp_servers.notion]
url = "https://mcp.notion.com/sse"
bearer_token_env_var = "NOTION_TOKEN"
enabled = true

# 指定允许使用的工具子集（不是全部工具）
[mcp_servers.github]
command = "npx"
args = ["-y", "@github/mcp-server"]
enabled_tools = ["list_issues", "create_pr", "get_file"]  # 只开放这些工具

# 设置默认审批模式（此服务器的所有工具默认自动审批）
[mcp_servers.docs]
command = "docs-server"
default_tools_approval_mode = "auto"
```

### 11.3 实际使用 MCP 工具

连接 MCP 服务器后，Codex 会自动发现可用工具，你可以直接在对话中使用：

```
"在 Linear 中创建一个 Bug 任务：
标题：登录页面在 Safari 下布局错乱
优先级：高
指派给：@frontend-team
关联到当前 Sprint"

"从 GitHub 拉取最新的 open issues，
按优先级排序，总结前 10 个最紧急的问题"

"在 Notion 上找到《API 设计规范》文档，
根据它检查 src/api/ 目录下的实现是否符合规范"
```

### 11.4 OAuth 认证的 MCP 服务器

对于需要 OAuth 认证的服务：

```bash
# 登录某个支持 OAuth 的 MCP 服务器
codex mcp login notion

# 退出某个服务器的认证
codex mcp logout notion
```

---

## 十二、Automations 自动化任务

### 12.1 什么是 Automations？

在 Codex 桌面 App 中，可以设置**定时自动运行的任务**：

- 每天早上运行代码检查
- 每周生成进度报告
- 定时同步 GitHub Issues 到项目管理工具
- 每次代码提交后自动运行审查

### 12.2 创建 Automation

在桌面 App 中：
1. 点击左侧边栏的 **⚡ Automations**（自动化）
2. 点击 **New Automation**
3. 配置：
   - **Project**：在哪个项目中运行
   - **Prompt**：运行什么任务（可以调用 Skills）
   - **Cadence（频率）**：每小时/每天/每周/自定义 cron
   - **Environment**：在独立的 git worktree 还是本地环境中运行

### 12.3 Automation 的最佳实践

> **规则**：Skills 定义方法，Automations 定义时间表。
> 如果一个工作流还需要大量人工调整，先把它做成 Skill，等稳定了再设置 Automation。

```
示例 Automation 配置：

名称：每日代码健康检查
频率：工作日 09:00
项目：我的 API 服务
Prompt：
  使用 code-review Skill 检查 main 分支昨天的提交，
  生成健康报告，包括：新增技术债务、测试覆盖率变化、
  发现的潜在 Bug。把报告保存到 docs/daily-reports/ 目录。
环境：独立 Git Worktree
```

---

## 十三、提示词 Prompting 技巧全指南

### 13.1 黄金提示词结构（四要素）

一个高质量的 Codex 提示词应该包含四个要素：

```
1. 任务目标（Goal）：你要 Codex 做什么？
2. 上下文（Context）：哪些文件、文档、错误信息和这个任务相关？
3. 输出规格（Output）：完成后应该是什么样子？
4. 约束条件（Constraints）：有什么不能做的？
```

**低质量提示词（❌）：**
```
帮我优化代码
```

**高质量提示词（✅）：**
```
优化 src/services/order_service.py 中的 process_bulk_orders 函数。

上下文：
- 这个函数当前是串行处理订单，处理 1000 个订单需要约 30 秒
- 错误日志显示偶尔出现 TimeoutError（见 @logs/error_2026-04.log）
- 相关的数据库模型在 src/models/order.py

目标：
- 改为并发处理，目标处理时间降到 5 秒以内
- 使用 asyncio.gather 或 concurrent.futures
- 保持现有的错误处理逻辑

约束：
- 不要修改数据库 Schema
- 保持函数的公共接口不变（其他地方有调用）
- 并发数量上限设为 50，避免数据库连接池耗尽

完成后：
- 更新 tests/unit/test_order_service.py 中的相关测试
- 在函数 docstring 中说明并发策略
```

### 13.2 @ 提及文件

在 Codex 中，用 `@文件名` 引用具体文件：

```
审查 @src/auth.py 和 @tests/test_auth.py，
确保测试覆盖了 @docs/auth-requirements.md 中的所有需求
```

### 13.3 任务拆解与迭代

不要把所有需求塞在一个提示词里，**分步骤迭代**效果更好：

```
# 第一步：让 Codex 先理解和规划
"分析 src/ 目录的结构，告诉我添加用户角色权限系统
需要修改哪些文件，列出实现计划，等我确认后再开始"

# 第二步：确认计划后执行核心功能
"按照刚才的计划，先实现 Permission 数据模型和
基础的权限检查函数，暂时不要修改现有的路由"

# 第三步：扩展到路由层
"现在在以下端点上应用权限检查：
@src/api/admin.py 和 @src/api/orders.py"

# 第四步：添加测试
"为新的权限系统添加完整的测试，
确保测试覆盖了权限缺失、权限错误和权限正确的情况"
```

### 13.4 Plan 模式的使用时机

在以下情况使用 `/plan` 或 `Shift+Tab` 进入 Plan 模式：

- 任务复杂、涉及多个文件的大改动
- 你对代码库不熟悉
- 有一个模糊的想法但不确定如何描述
- 高风险操作（数据库 Schema 变更、重大重构等）

**让 Codex 向你提问（更高级技巧）：**
```
"我想重构用户认证模块，但不确定最好的方式。
请先问我几个关键问题，帮助你了解需求后再给出方案。
挑战我的假设，把模糊的想法转化为具体的技术方案。"
```

### 13.5 利用语音输入（桌面 App）

在 Codex 桌面 App 中，可以使用系统的**语音听写**功能来输入任务描述，对于复杂的任务描述特别有效（说话比打字快）。

### 13.6 常见任务的提示词模板

**Bug 修复：**
```
src/payment.py 第 87 行的 process_refund 函数在
处理部分退款时抛出以下错误：

[粘贴错误信息]

错误的重现步骤：
1. 创建一个金额为 $100 的订单
2. 调用 process_refund(order_id, amount=30)

请找到根本原因并修复，同时添加防止这个错误再次出现的测试。
```

**添加新功能：**
```
在 @src/api/users.py 中添加一个新的 API 端点：

POST /api/users/{user_id}/avatar

功能：
- 接受 multipart/form-data 格式的图片文件
- 支持 JPG、PNG，最大 5MB
- 将图片存储到 S3（使用 @src/services/storage.py 中的 upload_file 函数）
- 将 S3 URL 保存到用户记录的 avatar_url 字段
- 返回更新后的用户信息

参考现有的文件上传实现：@src/api/documents.py
```

**代码解释：**
```
解释 @src/core/middleware.py 中的 RateLimitMiddleware 类，
特别是 __call__ 方法的工作原理。
用中文，面向刚接触这个项目的新开发者来解释。
```

**重构：**
```
重构 @src/utils/data_processor.py：

当前问题：
- 函数超过 200 行，可读性差
- 多处重复的数据验证逻辑
- 没有类型注解

目标：
- 拆分成职责单一的小函数（每个不超过 40 行）
- 提取重复的验证逻辑
- 添加完整的类型注解

要求：
- 保持所有现有测试通过（不要修改 tests/）
- 保持公共接口不变
```

### 13.7 审查和迭代

任务完成后，利用 diff 面板进行审查：

- 点击每一行改动可以直接**在那一行提供反馈**
- 反馈会作为上下文进入下一轮 Codex 的处理
- 使用 `/review` 触发 Codex 主动审查自己的工作

```bash
# 让 Codex 自我审查
"/review 检查你刚才做的改动，
特别关注边界情况和潜在的性能问题"
```

---

## 十四、模型选择指南

### 14.1 可用模型

| 模型 | 特点 | 最适合 |
|---|---|---|
| **GPT-5.5**（推荐） | 最强旗舰，复杂编码+推理 | 大多数任务，首选 |
| **GPT-5.4** | 强大，GPT-5.5 不可用时 | GPT-5.5 推出前的主力 |
| **GPT-5.3-Codex** | 专为编码优化 | 纯代码生成任务 |
| **GPT-5.4-mini** | 快速高效 | 简单任务、子 Agent |
| **codex-mini-latest** | 超低延迟 | 快速问答、代码微调 |

### 14.2 如何切换模型

**在 TUI 中：**
```
/model
```
选择器会弹出，选择想用的模型。

**在 config.toml 中（持久设置）：**
```toml
model = "gpt-5.5"
```

**通过命令行（临时）：**
```bash
codex --model gpt-5.4 "你的任务"
```

**Reasoning Level（推理深度）：**

对于复杂的 Bug 调试或架构设计，可以提高推理深度：
```toml
# 在 config.toml 中
reasoning_effort = "high"   # "low" | "medium" | "high"
```

---

## 十五、权限与沙箱安全机制

### 15.1 三种审批模式详解

| 模式 | 说明 | 适用场景 |
|---|---|---|
| **on-request**（默认） | 只有风险操作才需要确认 | 日常开发 |
| **never** | 所有操作自动批准，不询问 | CI/CD 自动化 |
| **untrusted** | 几乎所有操作都需要确认 | 不熟悉的代码库 |

**粒度控制（高级）：**
```toml
# 细粒度权限配置
approval_policy = { granular = {
  sandbox_approval = true,       # 沙箱相关操作是否需要确认
  rules = true,                  # 规则检查是否需要确认
  mcp_elicitations = true,       # MCP 工具的数据请求是否需要确认
  request_permissions = false,   # 权限请求自动拒绝
  skill_approval = false         # Skill 脚本自动批准
} }
```

### 15.2 沙箱模式详解

Codex 使用操作系统级沙箱技术：
- **macOS**：使用 `seatbelt` 沙箱
- **Linux**：使用 `bubblewrap (bwrap)` 沙箱

| 沙箱模式 | 访问范围 | 适用场景 |
|---|---|---|
| `workspace-write` | 只能读写工作目录 | 推荐，日常使用 |
| `danger-full-access` | 完全访问文件系统 | 只用于完全隔离的 CI/CD 环境 |

### 15.3 网络访问控制

```bash
# 默认：网络访问关闭
codex "安装依赖并运行测试"  # npm install 会失败

# 临时开启网络（当次运行）
codex --config sandbox_workspace_write.network_access=true \
  "npm install && npm test"

# 永久开启（写入 config.toml）
# [sandbox_workspace_write]
# network_access = true
```

### 15.4 Git 安全建议

每次让 Codex 处理重要任务前，创建 Git 检查点：

```bash
# 创建检查点
git stash push -m "codex-checkpoint-$(date +%Y%m%d-%H%M%S)"
# 或
git add -A && git commit -m "checkpoint: before codex task"

# 如果对结果不满意，回滚
git stash pop          # 恢复 stash
# 或
git reset --hard HEAD~1  # 回到上一个 commit
```

### 15.5 受保护路径

在 `workspace-write` 模式下，以下路径默认**只读**（不会被 Codex 修改）：
- `.git/`（Git 仓库数据）
- `.codex/`（Codex 配置）

---

## 十六、Git 工作流与 Worktree

### 16.1 基本 Git 工作流

Codex 完成任务后，通常会：
1. 在工作目录提交改动（`git commit`）
2. 展示 diff 供你审查
3. 等你决定：接受（Push/PR）或拒绝（Reset）

### 16.2 Worktree 模式的价值

Worktree 让你可以**同时在同一个仓库的多个分支工作**，每个 Codex Thread 在独立的 Worktree 中：

```
主仓库：~/projects/my-app (branch: main)
├── Worktree 1：~/projects/my-app-wt1 (branch: feature-A) ← Thread 1 在这里
├── Worktree 2：~/projects/my-app-wt2 (branch: feature-B) ← Thread 2 在这里
└── Worktree 3：~/projects/my-app-wt3 (branch: bugfix-1)  ← Thread 3 在这里
```

好处：
- 多个 Thread 可以并行修改代码，完全不互相干扰
- 每个任务都在独立分支，便于 Code Review
- 可以快速切换查看不同任务的进度

---

## 十七、实战使用场景与示例提示词

### 17.1 场景：接手陌生代码库

```
# 第一步：整体了解
"浏览整个项目结构，告诉我：
1. 这个项目是做什么的？
2. 主要的技术栈是什么？
3. 代码的整体架构是怎样的？
4. 入口点在哪里？
5. 你注意到哪些潜在的技术问题？"

# 第二步：深入特定模块
"详细解释 @src/core/auth.py 中的认证流程，
包括 JWT Token 的生成和验证逻辑"

# 第三步：找到关键路径
"追踪一个用户登录请求从接收到响应的完整流程，
涉及到哪些文件和函数？"
```

### 17.2 场景：处理 Bug 报告

```
生产环境出现了以下错误，帮我分析和修复：

错误信息：
  AttributeError: 'NoneType' object has no attribute 'user_id'
  File "src/services/order_service.py", line 142, in get_user_orders
    user = self.user_repo.get_by_id(session.user_id)

发生时间：2026-04-27 15:30 UTC
影响范围：约 0.3% 的下单请求

复现条件（暂未找到规律，但怀疑和 session 过期有关）

请：
1. 分析根本原因
2. 提供修复方案
3. 添加防御性代码，避免类似问题
4. 添加对应的单元测试
```

### 17.3 场景：生成测试

```
为 @src/services/payment_service.py 中的
PaymentService 类生成完整的单元测试。

要求：
- 覆盖所有公开方法
- 使用 pytest fixtures
- Mock 掉所有外部依赖（Stripe API、数据库）
- 测试正常路径、边界条件和错误情况
- 测试文件放到 tests/unit/services/test_payment_service.py

参考已有的测试风格：@tests/unit/services/test_user_service.py
```

### 17.4 场景：代码迁移

```
将 @src/database.py 中的数据库访问从同步
（sqlalchemy + psycopg2）迁移到异步
（asyncpg + sqlalchemy[asyncio]）。

当前代码使用了 Session 和 create_engine。
目标是使用 AsyncSession 和 create_async_engine。

步骤：
1. 更新 database.py 的连接配置
2. 更新 @src/models/ 目录下的所有 Repository 类
3. 确保 @tests/ 中的测试仍然通过
   （可以使用 pytest-asyncio）

注意：不要修改数据库 Schema，只改代码层面的实现。
```

### 17.5 场景：API 文档生成

```
为 @src/api/ 目录下的所有 FastAPI 路由
生成完整的 API 文档：

格式：OpenAPI 3.0 YAML 文件（docs/api-spec.yaml）

包含：
- 所有端点的 path、method、description
- 请求 body 的 Schema（参考 @src/schemas/）
- 响应 Schema（包括成功和错误情况）
- 认证方式说明（Bearer Token）
- 示例请求和响应

```

### 17.6 场景：数据分析与可视化

```
读取 @data/sales_2026.csv，进行以下分析：

1. 按月统计销售额和订单量
2. 找出销售额最高的前 10 个产品
3. 分析销售额的同比增长率
4. 识别销售低谷期（环比下降超过 20% 的月份）

生成一个 analysis_report.html 文件，
包含交互式图表（使用 Plotly），
并在 analysis_summary.md 中给出文字总结。
```

### 17.7 场景：日常工作任务（非编程）

```
"查看我的 Google Drive 中的《Q1 项目进度报告》，
整理成一个简洁的 PowerPoint 演示文稿，
重点突出关键里程碑、风险点和下一步计划，
适合 15 分钟的管理层汇报。"

"分析 @data/bug-reports-april.csv 中的所有 Bug 报告，
按以下维度分类：严重程度、受影响的功能模块、来源（用户/QA/监控），
生成一个优先级处理清单，并草拟一封给团队的汇总邮件。"
```

---

## 十八、常见问题与故障排查

### 18.1 认证问题

**问题：浏览器反复打开，认证循环**
```bash
# 方案1：使用设备码流程（不需要浏览器回调）
codex login --device-code

# 方案2：改用 API Key
export OPENAI_API_KEY="sk-your-key"
codex

# 方案3：检查并清除旧凭证重新登录
codex login remove
codex login
```

**问题：API Key 登录后某些功能不可用**

这是预期行为。部分功能（如云端 threads、会话同步）需要 ChatGPT 账号登录。API Key 适合自动化场景，日常使用推荐账号登录。

### 18.2 沙箱和权限问题

**问题：`npm install` / `pip install` 等安装命令失败**

原因：沙箱默认屏蔽网络访问。
```bash
# 临时开启网络
codex --config sandbox_workspace_write.network_access=true \
  "npm install && npm test"
```

**问题：macOS 出现 `sandbox-exec ENOENT` 错误**
```bash
# 检查 Xcode 命令行工具
xcode-select --install

# 检查目录权限
ls -la /your/project/path

# 从不同目录尝试运行
cd /tmp && codex --cwd /your/project "你的任务"
```

**问题：Linux 上出现 Landlock/seccomp 不支持的错误**
```bash
# 更新 WSL2 到最新版
wsl --update

# 或者在容器内运行（完全隔离环境）
docker run -it --rm -v $(pwd):/workspace -w /workspace \
  node:20 npx codex "你的任务"

# 最后手段（不推荐生产环境）：
codex --dangerously-bypass-approvals-and-sandbox "你的任务"
```

### 18.3 Codex 不断要求确认

**问题：设置了 `--full-auto` 但仍然频繁弹出确认**
```bash
# 检查当前设置
/status  # 在 TUI 内

# 明确指定参数重启
codex -a never -s workspace-write "你的任务"

# 如果重连后设置被重置，在 config.toml 中持久化
# approval_policy = "never"
```

### 18.4 任务运行时电脑进入休眠

在 Codex 桌面 App 的**设置**中，开启"在任务运行时防止电脑进入休眠"选项。

或在 config.toml 中：
```toml
[features]
prevent_idle_sleep = true
```

### 18.5 MCP 服务器无法连接

```bash
# 检查 MCP 服务器状态
codex mcp list

# 测试服务器连通性
codex mcp show your-server-name

# 查看详细错误日志
cat ~/.codex/log/codex-tui.log
```

### 18.6 Codex 修改了不该修改的文件

1. 立即使用 Git 回滚：`git stash pop` 或 `git reset --hard`
2. 在 AGENTS.md 中明确列出禁止修改的文件/目录
3. 降低审批模式（从 `never` 改为 `on-request`），让危险操作需要确认

### 18.7 结果质量不稳定

- 在 AGENTS.md 中增加更详细的项目规范
- 给 Codex 提供更具体的测试命令（这样它能自己验证结果）
- 使用更高的 reasoning effort（`reasoning_effort = "high"`）
- 拆分大任务为多个小任务，分步执行

---

## 十九、新手必读：核心工作原则

### 原则 1：小步迭代，逐步授权

```
新手路径：
Week 1：只用 Read-Only 模式，让 Codex 分析和解释代码
Week 2：允许 Codex 写代码，但每个改动都手动审查
Week 3：让 Codex 自动运行测试，信任绿色测试结果
Week 4+：逐步扩大自动化范围，处理更大型的任务
```

### 原则 2：建立 Git 安全网

**必须养成的习惯：**
- 重要任务前：`git add -A && git commit -m "checkpoint"`
- 每天工作结束：`git push origin your-branch`
- 每个功能完成：创建 PR，不要在 main 分支直接工作

### 原则 3：投资 AGENTS.md

花 30 分钟写好 AGENTS.md，节省无数次的重复解释。把所有你需要在每次任务中提到的规范都写进去：测试命令、代码风格、禁止操作、项目结构。

### 原则 4：一个任务一个 Thread

不要把不相关的任务混在一个 Thread 里，这样 Codex 不会混乱，你的对话历史也清晰可查。

### 原则 5：让 Codex 自验证结果

```
好的任务描述末尾加上：
"完成后运行 pytest tests/ -v，确保所有测试通过，
如果有测试失败，分析原因并修复，直到全部通过为止。"
```

这样 Codex 会自己验证改动是否正确，而不需要你手动检查。

### 原则 6：并行思维

把任务分解为**可以并行的独立部分**，分配到不同 Thread 同时运行：

```
❌ 串行（浪费时间）：
等 Thread 1 完成 → 开始 Thread 2 → 等完成 → 开始 Thread 3

✅ 并行（高效）：
Thread 1：添加用户权限系统     [运行中]
Thread 2：优化数据库查询       [运行中]
Thread 3：更新 API 文档        [运行中]
Thread 4：修复历史 Bug         [运行中]
你：喝咖啡，等 4 个任务都完成后统一审查
```

---

## 二十、进阶：多 Agent 并行工作流

### 20.1 什么是多 Agent 工作流？

在配置文件中启用 `multi_agent = true` 后，可以让 Codex 启动多个**子 Agent**，各自负责不同的角色，协作完成一个大型任务。

### 20.2 配置多 Agent 角色

```toml
[features]
multi_agent = true

# 定义 Agent 角色
[agent_roles.reviewer]
description = "负责代码审查和质量检查的 Agent"

[agent_roles.tester]
description = "负责编写和运行测试的 Agent"

[agent_roles.documenter]
description = "负责更新文档和注释的 Agent"
```

### 20.3 将 Codex 作为 MCP 服务器使用

可以让其他工具（如 OpenAI Agents SDK）通过 MCP 协议调用 Codex：

```bash
# 启动 Codex 作为 MCP 服务器
codex mcp
# Codex 会监听 stdio，其他工具可以通过 MCP 协议调用它
```

在 Python 中通过 Agents SDK 调用：

```python
from agents import Agent
from agents.mcp import MCPServerStdio

async with MCPServerStdio(
    name="Codex CLI",
    params={"command": "npx", "args": ["-y", "codex", "mcp"]},
) as codex_mcp:
    agent = Agent(
        name="主控 Agent",
        instructions="...",
        mcp_servers=[codex_mcp]
    )
    # agent 现在可以调用 Codex 的工具来操作文件
```

### 20.4 多 Agent 工作流最佳实践

- **每个 Agent 职责单一**：避免一个 Agent 既写代码又审查又测试
- **通过共享文件传递结果**：Agent A 写 REQUIREMENTS.md，Agent B 读取并实现
- **设置明确的交接条件**：如"只有 design_spec.md 存在才开始实现"
- **启用可审查的追踪日志**：使用 OTel 记录每个 Agent 的操作，便于调试

---

## 附录：常用命令速查表

### CLI 命令速查

```bash
# 安装和认证
npm install -g @openai/codex          # 安装
codex login                           # 登录
codex login status                    # 检查登录状态
codex login remove                    # 退出登录

# 启动和运行
codex                                 # 交互式 TUI
codex "任务描述"                       # 带初始提示词
codex --full-auto "任务"              # 全自动执行
codex --model gpt-5.5 "任务"         # 指定模型
codex exec "任务"                      # 非交互式执行
codex exec --json "任务"              # JSON 输出

# 会话管理
codex resume --last                   # 恢复最近会话
codex resume                          # 从选择器恢复
codex fork --last                     # Fork 最近会话

# MCP 管理
codex mcp list                        # 列出所有 MCP 服务器
codex mcp add server-name -- cmd      # 添加 MCP 服务器
codex mcp remove server-name         # 删除 MCP 服务器
codex mcp login server-name          # OAuth 登录

# 功能开关
codex feature list                    # 查看所有功能开关
codex feature enable feature-name    # 启用功能
codex feature disable feature-name   # 禁用功能

# Shell 补全
codex completion zsh                  # Zsh 补全脚本
codex completion bash                 # Bash 补全脚本
```

### TUI 内命令速查

```
/model         切换模型
/permissions   切换审批模式
/plan          切换 Plan 模式
/skills        查看 Skills 列表
/review        触发代码审查
/clear         清空对话
/copy          复制最新输出
/theme         切换主题
/title         设置会话标题
/feedback      提交反馈
/exit          退出
$技能名         调用 Skill
!shell命令      运行 Shell 命令
Ctrl+R         搜索历史
Ctrl+O         复制输出
Ctrl+C         退出
Tab            排队下一条指令
```

---

> **持续学习资源：**
> - 官方文档：https://developers.openai.com/codex
> - 最佳实践：https://developers.openai.com/codex/learn/best-practices
> - 使用案例：https://developers.openai.com/codex/use-cases
> - 更新日志：https://developers.openai.com/codex/changelog
> - GitHub 仓库：https://github.com/openai/codex
