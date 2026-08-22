/**
 * Antigravity Career Timeline - Interactive Application Logic
 * Features:
 * - Theme Switcher (Cyber Matrix Dark <-> Clean Slate Light)
 * - Accordion Expansion (Individual & Expand/Collapse All)
 * - Category Filter Chips (Automotive, Data Science, Safety, Education)
 * - Live Search Filtering (Real-time keyword matching)
 * - Copy-to-Clipboard with Toast Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initExpandCollapse();
  initClipboard();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('agy-theme') || 'dark';
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('agy-theme', nextTheme);
    showToast(`Switched to ${nextTheme === 'light' ? 'Clean Slate Light' : 'Cyber Matrix Dark'} mode`);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const themeIcon = toggleBtn.querySelector('.theme-icon');
  const themeText = toggleBtn.querySelector('.theme-text');

  if (theme === 'light') {
    if (themeIcon) themeIcon.textContent = '🌙';
    if (themeText) themeText.textContent = 'Dark';
  } else {
    if (themeIcon) themeIcon.textContent = '☀️';
    if (themeText) themeText.textContent = 'Light';
  }
}

/* ==========================================================================
   2. Accordion & Card Expansion
   ========================================================================== */
function initExpandCollapse() {
  // Global Toggle Button
  const globalToggleBtn = document.getElementById('toggleAllBtn');
  let allExpanded = false;

  if (globalToggleBtn) {
    globalToggleBtn.addEventListener('click', () => {
      allExpanded = !allExpanded;
      const cards = document.querySelectorAll('.timeline-card');
      cards.forEach(card => {
        const panel = card.querySelector('.card-panel');
        const btn = card.querySelector('.expand-toggle');
        if (panel && btn) {
          if (allExpanded) {
            panel.classList.add('open');
            btn.textContent = '−';
          } else {
            panel.classList.remove('open');
            btn.textContent = '+';
          }
        }
      });

      // Also toggle projects section
      const projPanel = document.getElementById('projectsPanel');
      const projBtn = document.getElementById('projectsToggleBtn');
      if (projPanel && projBtn) {
        projPanel.style.display = allExpanded ? 'block' : 'none';
        projBtn.textContent = allExpanded ? '−' : '+';
      }

      // Also toggle skills section
      const skillsPanel = document.getElementById('skillsPanel');
      const skillsBtn = document.getElementById('skillsToggleBtn');
      if (skillsPanel && skillsBtn) {
        skillsPanel.style.display = allExpanded ? 'block' : 'none';
        skillsBtn.textContent = allExpanded ? '−' : '+';
      }

      globalToggleBtn.innerHTML = allExpanded ? '<span>⊟</span> Collapse All' : '<span>⊞</span> Expand All';
      showToast(allExpanded ? 'Expanded all sections' : 'Collapsed all sections');
    });
  }
}

/**
 * Click handler on timeline card
 */
function toggleCard(card) {
  const panel = card.querySelector('.card-panel');
  const btn = card.querySelector('.expand-toggle');
  if (!panel || !btn) return;

  const isOpen = panel.classList.toggle('open');
  btn.textContent = isOpen ? '−' : '+';
}

/**
 * Click handler on Featured Projects section
 */
function toggleProjectsSection() {
  const panel = document.getElementById('projectsPanel');
  const btn = document.getElementById('projectsToggleBtn');
  if (!panel || !btn) return;

  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? '+' : '−';
}

/**
 * Click handler on Technical Skills Matrix section
 */
function toggleSkillsSection() {
  const panel = document.getElementById('skillsPanel');
  const btn = document.getElementById('skillsToggleBtn');
  if (!panel || !btn) return;

  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? '+' : '−';
}

/* ==========================================================================
   3. Category Filter Chips
   ========================================================================== */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const entries = document.querySelectorAll('.timeline-entry');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      let visibleCount = 0;

      entries.forEach(entry => {
        const categories = entry.getAttribute('data-categories') || '';
        const catList = categories.split(' ');

        if (filter === 'all' || catList.includes(filter)) {
          entry.classList.remove('hidden');
          visibleCount++;
        } else {
          entry.classList.add('hidden');
        }
      });

      showToast(`Showing ${visibleCount} timeline entries for "${btn.textContent.trim()}"`);
    });
  });
}

/* ==========================================================================
   4. Live Search Filtering (Optional Helper)
   ========================================================================== */
function initSearch() {
  const searchInput = document.getElementById('timelineSearch');
  if (!searchInput) return;

  const entries = document.querySelectorAll('.timeline-entry');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Reset filter buttons active state to 'all' when searching
    if (query.length > 0) {
      const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilterBtn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        allFilterBtn.classList.add('active');
      }
    }

    let matchCount = 0;

    entries.forEach(entry => {
      const cardText = entry.textContent.toLowerCase();
      if (query === '' || cardText.includes(query)) {
        entry.classList.remove('hidden');
        matchCount++;
      } else {
        entry.classList.add('hidden');
      }
    });
  });
}

/* ==========================================================================
   5. Clipboard & Toast Notifications
   ========================================================================== */
function initClipboard() {
  const copyItems = document.querySelectorAll('[data-copy]');
  copyItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = item.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: "${textToCopy}"`);
      }).catch(err => {
        console.error('Clipboard copy failed:', err);
      });
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('agyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'agyToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
