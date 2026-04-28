# AI 工具学习中心

> 一个数据驱动的单页 Web 应用，整合 Claude Code 与 OpenAI Codex 的完整教程，以及两者的深度对比选型指南。支持快速导航、全文搜索、深色模式，内容通过 Markdown 文件驱动，无需改代码即可扩展新工具。

---

## 在线预览

**GitHub Pages：** https://lsgoodlionel.github.io/tools-use-knoledge/

> 本项目需要通过 HTTP 服务器访问，不支持直接用 `file://` 协议打开 `index.html`。

---

## 功能特性

- **三套完整教程**：Claude Code（24章）、OpenAI Codex（24章）、工具对比指南（8章）
- **侧边栏导航**：自动解析 Markdown 标题，生成两级目录树
- **滚动高亮**：阅读时侧边栏自动跟随，实时标记当前章节
- **全文搜索**：即时过滤侧边栏章节，支持中文关键词
- **代码复制**：每个代码块右上角一键复制按钮
- **深色 / 浅色主题**：自动匹配系统偏好，支持手动切换
- **进度条**：顶部细线实时显示阅读进度
- **移动端适配**：响应式布局，汉堡菜单，触摸友好
- **数据驱动**：所有工具配置集中在 `manifest.json`，添加新工具零代码改动

---

## 项目结构

```
ai-tools-guide/
├── index.html              # 主页面（HTML + 内嵌 CSS）
├── app.js                  # 应用逻辑（Vanilla JS，约 380 行）
├── manifest.json           # 工具注册表（驱动所有工具标签）
└── data/
    ├── claude-code.md      # Claude Code 完整教程（1734 行，24 章）
    ├── codex.md            # OpenAI Codex 完整教程（2575 行，24 章）
    └── tool-comparison.md  # 工具对比指南（443 行，8 章）
```

---

## 教程内容概览

### 🤖 Claude Code 教程（24 章，1734 行）

| 章节 | 主题 |
|------|------|
| 0 | 什么是 Claude Code（定位、核心能力、对比表） |
| 1 | 安装与登录 |
| 2 | 第一次使用 |
| 3 | 斜杠命令完整速查 |
| 4 | 键盘快捷键 |
| 5 | CLAUDE.md 项目配置文件 |
| 6 | Plan Mode（计划模式） |
| 7 | settings.json 权限配置 |
| 8 | Hooks 自动化钩子 |
| 9 | 自定义命令 & Skills |
| 10 | MCP 服务器集成 |
| 11 | IDE 集成（VS Code / JetBrains） |
| 12 | 子代理（Subagents） |
| 13 | Agent Teams 多代理协作（邮箱通信、3个完整场景、成本预估） |
| 14 | Git 工作流最佳实践 |
| 15 | CI/CD 集成 |
| 16 | 提示词工程技巧 |
| 17 | 上下文管理 |
| 18 | 成本控制与 Token 优化（量化技巧、月度预算） |
| 19 | 实战工作模式 |
| 20 | 故障排查完全手册 |
| 21 | Extended Thinking 扩展思维详解（4档关键词、成本权衡） |
| 22 | 记忆系统（Memory）深度指南 |
| 23 | 环境变量完整参考 |

### ⚡ OpenAI Codex 教程（24 章，2575 行）

| 章节 | 主题 |
|------|------|
| 一 | 什么是 Codex |
| 二 | 账号与套餐要求 |
| 三 | 四种使用方式总览 |
| 四 | Codex Cloud 云端网页版 |
| 五 | Codex 桌面 App |
| 六 | Codex CLI 命令行 |
| 七 | IDE 扩展（VS Code / Cursor / Windsurf） |
| 八 | 配置文件 config.toml 详解 |
| 九 | AGENTS.md 项目指令文件详解 |
| 十 | Skills 技能系统 |
| 十一 | MCP 外部工具集成 |
| 十二 | Automations 自动化任务（5个完整模板、失败排查） |
| 十三 | 提示词 Prompting 技巧全指南 |
| 十四 | 模型选择指南 |
| 十五 | 权限与沙箱安全机制 |
| 十六 | Git 工作流与 Worktree（完整命令序列、并行策略） |
| 十七 | 实战使用场景与示例提示词 |
| 十八 | 常见问题与故障排查 |
| 十九 | 新手必读：核心工作原则 |
| 二十 | 进阶：多 Agent 并行工作流（3个完整场景） |
| 二十一 | CI/CD 完整集成指南（2个 GitHub Actions YAML） |
| 二十二 | 成本控制与 Token 优化 |
| 二十三 | 大型代码库最佳实践 |
| 二十四 | Codex 的局限性与适用边界 |

### ⚖️ 工具对比指南（8 章，443 行）

| 章节 | 主题 |
|------|------|
| 1 | 工具全景图（一句话定位） |
| 2 | 完整功能对比表（20+ 维度横向对比） |
| 3 | 工具选型决策指南（按用户类型 / 任务类型 / 技术栈） |
| 4 | Claude Code 的独特优势（Hooks、Agent Teams、MCP、IDE） |
| 5 | Codex 的独特优势（桌面 App、Automations、云端执行） |
| 6 | 两者协作使用工作流（4 种混合场景） |
| 7 | 从 Copilot/Cursor 迁移指南 |
| 8 | 常见问题解答（FAQ） |

---

## 本地运行

**方式一：Python（推荐，无需安装依赖）**

```bash
git clone https://github.com/lsgoodlionel/tools-use-knoledge.git
cd tools-use-knoledge
python3 -m http.server 8080
# 打开 http://localhost:8080
```

**方式二：Node.js**

```bash
npx serve .
# 或
npx http-server . -p 8080
```

**方式三：VS Code Live Server 扩展**

安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 扩展后，右键 `index.html` → `Open with Live Server`。

---

## 添加新工具教程

只需两步，无需修改任何代码：

**第一步：** 在 `data/` 目录下新建 Markdown 文件（如 `data/cursor.md`）。

**第二步：** 在 `manifest.json` 的 `tools` 数组末尾追加一条记录：

```json
{
  "id": "cursor",
  "name": "Cursor",
  "subtitle": "AI 代码编辑器完整指南",
  "file": "data/cursor.md",
  "color": "#3b82f6",
  "colorLight": "#dbeafe",
  "icon": "✏️"
}
```

刷新页面，新工具标签立即出现。

### Markdown 格式要求

- 使用 `##` 作为一级章节（生成侧边栏主条目）
- 使用 `###` 作为二级章节（生成侧边栏子条目）
- 代码块使用标准三反引号 ` ``` ` 语法，自动触发语法高亮

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 页面框架 | 纯 HTML5 + CSS3 + Vanilla JS（无构建工具） |
| Markdown 渲染 | [marked.js v9.1.6](https://marked.js.org/) |
| 语法高亮 | [highlight.js v11.9.0](https://highlightjs.org/)（github-dark 主题） |
| 字体 | Inter（界面）+ JetBrains Mono（代码块） |
| 滚动监听 | IntersectionObserver API |
| 主题持久化 | localStorage |

所有依赖均通过 CDN 加载，无需 `npm install`。

---

## 架构说明

```
用户打开页面
    │
    ▼
app.js → 读取 manifest.json
    │        ↓
    │    渲染工具标签栏
    │
    ▼
switchTool(id) → fetch data/xxx.md
    │                   ↓
    │            parseSections()   ← 解析 ## / ### 标题
    │                   ↓
    │            renderNav()       ← 生成侧边栏目录
    │                   ↓
    │            renderContent()   ← marked.parse() → HTML
    │                   ↓
    │            hljs.highlightElement() + 复制按钮
    │                   ↓
    └──────────  setupScrollSpy()  ← IntersectionObserver 驱动导航高亮
```

**数据驱动设计**：`manifest.json` 是唯一的配置入口，`app.js` 和 `index.html` 均不含任何工具特定的硬编码内容，支持任意扩展。

---

## 贡献指南

欢迎提交 Issue 或 PR 来补充、纠正教程内容。

**内容贡献：**
- 修改 `data/` 目录下对应的 `.md` 文件
- 保持现有的章节编号风格（`## N. 标题` 或 `## 数字中文、标题`）
- 代码示例请尽量提供可直接运行的完整片段

**新增工具：**
- 新建 `data/工具名.md`，参考现有文件的结构
- 更新 `manifest.json` 添加工具条目
- 在 `README.md` 的「教程内容概览」中补充章节列表

---

## 更新日志

### v1.2.0（2026-04-28）

- 新增第三工具标签：⚖️ 工具对比指南（443行，8章）
- Claude Code 教程扩充至 24 章（+352行）：新增 Extended Thinking、Memory 系统、环境变量参考；扩充 Agent Teams 和成本控制章节
- Codex 教程扩充至 24 章（+649行）：新增 CI/CD 集成、成本优化、大型代码库实践、局限性说明；扩充 Automations、Git Worktree、多 Agent 工作流章节

### v1.1.0（2026-04-27）

- 修复面包屑延迟更新问题（移至异步操作前）
- 修复 switchTool 竞态条件（异步后添加 guard 检查）
- 修复导航点击监听器重复注册问题（改为一次性事件委托）

### v1.0.0（2026-04-20）

- 初始发布：双工具单页 Web 应用
- 支持 Claude Code 和 OpenAI Codex 两份完整教程
- 侧边栏导航、滚动高亮、全文搜索、深色模式、代码复制

---

## License

MIT
