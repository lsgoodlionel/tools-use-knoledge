/* ─────────────────────────────────────────────────────────
   AI 工具学习中心 — app.js
   ───────────────────────────────────────────────────────── */

class AIToolsGuide {
  constructor() {
    this.manifest   = null;
    this.cache      = {};       // { toolId: { markdown, sections } }
    this.activeTool = null;
    this.activeId   = null;
    this.observer   = null;
    this.dark       = false;
  }

  /* ── Bootstrap ───────────────────────────────────────── */
  async init() {
    try {
      this.manifest = await this.fetchJSON('manifest.json');
    } catch (e) {
      document.getElementById('main-content').innerHTML =
        `<div class="state-msg"><div class="big">⚠️</div><p>无法加载 manifest.json，请确保通过 HTTP 服务器访问本页面。</p></div>`;
      return;
    }

    this.setupTheme();
    this.renderToolTabs();
    this.setupNavClick();
    this.setupMobileMenu();
    this.setupScrollProgress();

    // Load first tool
    await this.switchTool(this.manifest.tools[0].id);

    // Search
    document.getElementById('search-input').addEventListener('input', e => {
      this.filterNav(e.target.value.trim());
    });
  }

  /* ── Fetch helpers ───────────────────────────────────── */
  async fetchJSON(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  }
  async fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.statusText);
    return r.text();
  }

  /* ── Tool switching ──────────────────────────────────── */
  async switchTool(toolId) {
    if (this.activeTool === toolId) return;
    this.activeTool = toolId;
    this.activeId   = null;

    const tool = this.manifest.tools.find(t => t.id === toolId);
    this.applyAccent(tool.color, tool.colorLight);
    this.updateTabStates();

    // Update breadcrumb immediately (before any async operations)
    document.getElementById('breadcrumb').innerHTML =
      `<strong>${tool.icon} ${tool.name}</strong> — ${tool.subtitle}`;

    // Reset search
    document.getElementById('search-input').value = '';
    document.getElementById('search-count').textContent = '';

    // Show loading
    document.getElementById('main-content').innerHTML =
      `<div class="state-msg"><div class="big">⏳</div><p>加载 ${tool.name} 教程…</p></div>`;

    // Load & cache
    if (!this.cache[toolId]) {
      const md = await this.fetchText(tool.file);
      this.cache[toolId] = {
        markdown: md,
        sections: this.parseSections(md)
      };
    }

    // Guard against race: user may have switched tool during fetch
    if (this.activeTool !== toolId) return;

    this.renderNav(this.cache[toolId].sections);
    this.renderContent(this.cache[toolId].markdown, tool);
  }

  /* ── Parse headings ──────────────────────────────────── */
  parseSections(md) {
    const lines    = md.split('\n');
    const sections = [];
    let h2Idx = 0;

    lines.forEach(line => {
      const m2 = line.match(/^##\s+(.+)/);
      const m3 = line.match(/^###\s+(.+)/);
      if (m2) {
        h2Idx++;
        sections.push({
          level: 2,
          raw:   m2[1],
          title: this.stripMd(m2[1]),
          id:    this.slugify(m2[1]),
          num:   h2Idx,
          subs:  []
        });
      } else if (m3 && sections.length) {
        sections[sections.length - 1].subs.push({
          level: 3,
          raw:   m3[1],
          title: this.stripMd(m3[1]),
          id:    this.slugify(m3[1])
        });
      }
    });

    return sections;
  }

  stripMd(text) {
    return text.replace(/[*_`~]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w一-鿿\s.-]/g, '')
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /* ── Render navigation ───────────────────────────────── */
  renderNav(sections) {
    const list = document.getElementById('nav-list');
    list.innerHTML = sections.map(sec => `
      <li class="nav-section">
        <button class="nav-a nav-h2" data-id="${sec.id}">
          <span class="nav-badge">${sec.num}</span>
          <span class="nav-title-text">${sec.title}</span>
        </button>
        ${sec.subs.length ? `
        <ul class="nav-sub-list">
          ${sec.subs.map(sub => `
            <li>
              <button class="nav-a nav-h3" data-id="${sub.id}">${sub.title}</button>
            </li>
          `).join('')}
        </ul>` : ''}
      </li>
    `).join('');

    // Single delegated listener on nav-wrap (set once in init, not repeated)
    this.setupScrollSpy();
  }

  /* ── Nav click handler (attached once) ──────────────── */
  setupNavClick() {
    document.getElementById('nav-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-id]');
      if (!btn) return;
      const id = btn.dataset.id;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('show');
      }
    });
  }

  /* ── Render content ──────────────────────────────────── */
  renderContent(md, tool) {
    // Configure marked
    const renderer = new marked.Renderer();

    // Add ids to headings
    const slugify = this.slugify.bind(this);
    renderer.heading = function(token) {
      // marked v9 passes a token object
      const text  = typeof token === 'object' ? token.text : token;
      const depth = typeof token === 'object' ? token.depth : arguments[1];
      const raw   = typeof token === 'object' ? token.raw  : text;
      const id    = slugify(raw.replace(/^#+\s*/, '').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1'));
      const tag   = `h${depth}`;
      return `<${tag} id="${id}">${text}</${tag}>\n`;
    };

    marked.setOptions({
      renderer,
      breaks: true,
      gfm: true
    });

    const html = marked.parse(md);
    const wrap = document.getElementById('main-content');
    wrap.innerHTML = html;
    wrap.classList.remove('content-fade');
    void wrap.offsetWidth; // reflow
    wrap.classList.add('content-fade');

    // Fix IDs — override any that might have been skipped by renderer
    wrap.querySelectorAll('h2, h3, h4').forEach(h => {
      if (!h.id) {
        h.id = this.slugify(h.textContent);
      }
    });

    // Syntax highlight
    wrap.querySelectorAll('pre code').forEach(el => {
      hljs.highlightElement(el);
    });

    // Copy buttons
    wrap.querySelectorAll('pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.className    = 'copy-btn';
      btn.textContent  = '复制';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code')?.textContent || '';
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = '已复制 ✓';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = '复制';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(() => {
          btn.textContent = '失败';
          setTimeout(() => btn.textContent = '复制', 2000);
        });
      });
      pre.appendChild(btn);
    });

    // Scroll to top
    document.getElementById('content-scroll').scrollTop = 0;

    // Re-setup scroll spy after DOM settles
    setTimeout(() => this.setupScrollSpy(), 150);
  }

  /* ── Scroll spy ──────────────────────────────────────── */
  setupScrollSpy() {
    if (this.observer) this.observer.disconnect();

    const headings = document.querySelectorAll('#main-content h2, #main-content h3');
    if (!headings.length) return;

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveNav(entry.target.id);
        }
      });
    }, {
      root:       document.getElementById('content-scroll'),
      rootMargin: '0px 0px -65% 0px',
      threshold:  0
    });

    headings.forEach(h => this.observer.observe(h));
  }

  setActiveNav(id) {
    if (this.activeId === id) return;
    this.activeId = id;
    document.querySelectorAll('.nav-a').forEach(a => {
      a.classList.toggle('active', a.dataset.id === id);
    });

    // Scroll nav to keep active item visible
    const active = document.querySelector(`.nav-a[data-id="${id}"]`);
    if (active) {
      active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  /* ── Search / filter ─────────────────────────────────── */
  filterNav(q) {
    const sections = document.querySelectorAll('.nav-section');
    let visible = 0;

    sections.forEach(sec => {
      const text  = sec.textContent.toLowerCase();
      const match = !q || text.includes(q.toLowerCase());
      sec.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    const count = document.getElementById('search-count');
    count.textContent = q ? `${visible}` : '';
  }

  /* ── Tool tabs ───────────────────────────────────────── */
  renderToolTabs() {
    const wrap = document.getElementById('tool-tabs');
    wrap.innerHTML = this.manifest.tools.map(t => `
      <button class="tool-tab" data-tool="${t.id}" title="${t.name}">
        <span class="tab-icon">${t.icon}</span>
        <div class="tab-info">
          <span class="tab-name">${t.name}</span>
          <span class="tab-sub">${t.subtitle}</span>
        </div>
        <span class="tab-active-dot"></span>
      </button>
    `).join('');

    wrap.addEventListener('click', e => {
      const btn = e.target.closest('.tool-tab');
      if (btn) this.switchTool(btn.dataset.tool);
    });
  }

  updateTabStates() {
    document.querySelectorAll('.tool-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === this.activeTool);
    });
  }

  /* ── Accent color ────────────────────────────────────── */
  applyAccent(color, light) {
    const root = document.documentElement;
    root.style.setProperty('--accent',       color);
    root.style.setProperty('--accent-light', light);
  }

  /* ── Theme ───────────────────────────────────────────── */
  setupTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDark(true);
    }
    document.getElementById('theme-btn').addEventListener('click', () => {
      this.enableDark(!this.dark);
    });
  }

  enableDark(on) {
    this.dark = on;
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    document.getElementById('theme-btn').textContent = on ? '☀️' : '🌙';
    localStorage.setItem('theme', on ? 'dark' : 'light');
  }

  /* ── Mobile menu ─────────────────────────────────────── */
  setupMobileMenu() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('overlay');
    const menuBtn  = document.getElementById('menu-btn');

    menuBtn.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      overlay.classList.toggle('show', open);
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  /* ── Scroll progress ─────────────────────────────────── */
  setupScrollProgress() {
    const bar    = document.getElementById('progress');
    const scroll = document.getElementById('content-scroll');
    scroll.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = scroll;
      const pct = scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }
}

/* ── Boot ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const app = new AIToolsGuide();
  app.init();
});
