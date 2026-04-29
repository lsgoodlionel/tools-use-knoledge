#!/usr/bin/env bash
# =============================================================================
#  AI 工具学习中心 — Ubuntu 一键安装部署脚本
#  支持系统：Ubuntu 20.04 / 22.04 / 24.04（及同源 Debian 系列）
#
#  一行安装：
#    curl -fsSL https://raw.githubusercontent.com/lsgoodlionel/tools-use-knoledge/main/install.sh | sudo bash
#  或克隆后本地运行：
#    sudo bash install.sh
# =============================================================================
set -euo pipefail

# ── 配置项（可通过环境变量覆盖） ─────────────────────────────────────────────
REPO_URL="${REPO_URL:-https://github.com/lsgoodlionel/tools-use-knoledge.git}"
INSTALL_DIR="${INSTALL_DIR:-/opt/ai-tools-guide}"
SERVICE_NAME="${SERVICE_NAME:-ai-tools-guide}"
PORT="${PORT:-8899}"
RUN_USER="${RUN_USER:-www-data}"
NODE_MAJOR="${NODE_MAJOR:-20}"   # Node.js LTS 大版本号

# ── 颜色输出 ─────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

info()    { echo -e "${BLUE}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
step()    { echo -e "\n${BOLD}${CYAN}▶ $*${NC}"; }

# ── 前置检查 ─────────────────────────────────────────────────────────────────
step "环境检查"

# 必须以 root 运行
if [[ $EUID -ne 0 ]]; then
  error "请以 root 权限运行此脚本："
  echo "  sudo bash $0"
  exit 1
fi

# 检测 apt（Ubuntu / Debian）
if ! command -v apt-get &>/dev/null; then
  error "此脚本仅支持 Ubuntu / Debian 系统（需要 apt-get）"
  exit 1
fi

# 检测 systemd
if ! command -v systemctl &>/dev/null; then
  error "未检测到 systemd，无法创建系统服务"
  exit 1
fi

UBUNTU_VER=$(lsb_release -rs 2>/dev/null || echo "unknown")
ARCH=$(uname -m)
info "系统：$(lsb_release -ds 2>/dev/null || uname -s)  架构：$ARCH"
info "安装目录：$INSTALL_DIR  端口：$PORT  服务名：$SERVICE_NAME"

# ── 安装系统依赖 ─────────────────────────────────────────────────────────────
step "安装系统依赖"

apt-get update -qq

# git
if ! command -v git &>/dev/null; then
  info "安装 git..."
  apt-get install -y -qq git
fi
success "git $(git --version | awk '{print $3}')"

# curl（用于下载 NodeSource 安装脚本）
if ! command -v curl &>/dev/null; then
  apt-get install -y -qq curl
fi

# ── 安装 Node.js ─────────────────────────────────────────────────────────────
step "检查 Node.js"

NEED_NODE=true
if command -v node &>/dev/null; then
  CURRENT_MAJOR=$(node -e "process.stdout.write(process.version.split('.')[0].slice(1))")
  if [[ "$CURRENT_MAJOR" -ge "$NODE_MAJOR" ]]; then
    success "Node.js $(node --version) 已满足要求（≥v${NODE_MAJOR}）"
    NEED_NODE=false
  else
    warn "Node.js $(node --version) 版本过低，需要 v${NODE_MAJOR}+，将升级"
  fi
fi

if [[ "$NEED_NODE" == "true" ]]; then
  info "通过 NodeSource 安装 Node.js v${NODE_MAJOR} LTS..."
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash - >/dev/null 2>&1
  apt-get install -y -qq nodejs
  success "Node.js $(node --version) 安装完成"
fi

# ── 克隆 / 更新仓库 ──────────────────────────────────────────────────────────
step "部署代码"

if [[ -d "$INSTALL_DIR/.git" ]]; then
  info "目录已存在，拉取最新代码..."
  git -C "$INSTALL_DIR" pull --ff-only
  success "代码已更新至最新版本"
elif [[ -d "$INSTALL_DIR" ]]; then
  warn "$INSTALL_DIR 目录存在但不是 Git 仓库，将备份后重新克隆"
  mv "$INSTALL_DIR" "${INSTALL_DIR}.bak.$(date +%s)"
  git clone "$REPO_URL" "$INSTALL_DIR"
  success "仓库已克隆到 $INSTALL_DIR"
else
  info "克隆仓库 $REPO_URL → $INSTALL_DIR"
  git clone "$REPO_URL" "$INSTALL_DIR"
  success "仓库克隆完成"
fi

# 设置文件权限
chown -R "$RUN_USER":"$RUN_USER" "$INSTALL_DIR" 2>/dev/null || \
  chown -R root:root "$INSTALL_DIR"
chmod -R 755 "$INSTALL_DIR"

# ── 创建 systemd 服务 ────────────────────────────────────────────────────────
step "配置 systemd 服务"

SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=AI 工具学习中心 Web 服务
Documentation=https://github.com/lsgoodlionel/tools-use-knoledge
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=${RUN_USER}
WorkingDirectory=${INSTALL_DIR}
ExecStart=$(command -v node) ${INSTALL_DIR}/server.js
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=${SERVICE_NAME}
Environment=PORT=${PORT}
Environment=NODE_ENV=production

# 安全加固
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadOnlyPaths=/
ReadWritePaths=${INSTALL_DIR}

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
success "systemd 服务已创建：$SERVICE_FILE"

# ── 防火墙配置（ufw，可选） ──────────────────────────────────────────────────
step "防火墙配置"

if command -v ufw &>/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow "$PORT"/tcp comment "AI 工具学习中心" >/dev/null 2>&1
  success "ufw 已放行端口 $PORT"
else
  info "未检测到活跃的 ufw，跳过防火墙配置（如使用其他防火墙，请手动开放 TCP 端口 $PORT）"
fi

# ── 启动服务 ──────────────────────────────────────────────────────────────────
step "启动服务"

# 停止旧实例（如有）
systemctl stop "$SERVICE_NAME" 2>/dev/null || true

systemctl start "$SERVICE_NAME"
sleep 2

if systemctl is-active --quiet "$SERVICE_NAME"; then
  success "服务运行中 ✓"
else
  error "服务启动失败，查看日志："
  journalctl -u "$SERVICE_NAME" -n 30 --no-pager
  exit 1
fi

# ── 获取访问地址 ─────────────────────────────────────────────────────────────
LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}' || ip route get 1 | awk '{print $NF; exit}' 2>/dev/null || echo "")
PUBLIC_IP=$(curl -s --connect-timeout 3 ifconfig.me 2>/dev/null || echo "")

# ── 完成提示 ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}   ✅ 安装完成！AI 工具学习中心已就绪${NC}"
echo -e "${GREEN}${BOLD}════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}访问地址：${NC}"
echo -e "  • 本地：    ${CYAN}http://localhost:${PORT}${NC}"
[[ -n "$LAN_IP" ]]    && echo -e "  • 局域网：  ${CYAN}http://${LAN_IP}:${PORT}${NC}"
[[ -n "$PUBLIC_IP" ]] && echo -e "  • 公网：    ${CYAN}http://${PUBLIC_IP}:${PORT}${NC}"
echo ""
echo -e "  ${BOLD}服务管理：${NC}"
echo -e "  • 查看状态： ${YELLOW}systemctl status $SERVICE_NAME${NC}"
echo -e "  • 查看日志： ${YELLOW}journalctl -u $SERVICE_NAME -f${NC}"
echo -e "  • 重启服务： ${YELLOW}systemctl restart $SERVICE_NAME${NC}"
echo -e "  • 停止服务： ${YELLOW}systemctl stop $SERVICE_NAME${NC}"
echo -e "  • 开机自启： ${YELLOW}（已启用）${NC}"
echo ""
echo -e "  ${BOLD}更新内容：${NC}"
echo -e "  • 进入目录： ${YELLOW}cd $INSTALL_DIR${NC}"
echo -e "  • 拉取更新： ${YELLOW}git pull${NC}"
echo -e "  • 重启服务： ${YELLOW}systemctl restart $SERVICE_NAME${NC}"
echo ""
