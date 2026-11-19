// Boot for the Leonida Ledger: loads the guide data, wires the toolbar,
// the tabs, the tracker and the save controls, and keeps every view in sync.

import { loadGuideData } from './data.js';
import { filterTrophies, countByKind, KINDS } from './filters.js';
import { loadProgress, toggleEarned, exportProgress, importProgressFile, resetProgress, maybeSeedDemo } from './store.js';
import { renderProgress, renderChecklist, renderDetail, renderRoadmap, renderMissables } from './views.js';

const state = {
  trophies: [],
  roadmap: null,
  earned: new Set(),
  kind: 'all',
  query: '',
  earnedOnly: false,
  spoilersHidden: true,
  view: 'checklist',
  selectedId: null,
};

function opts() {
  return { spoilersHidden: state.spoilersHidden, earned: state.earned };
}

function refreshAll() {
  renderProgress(state.trophies, state.earned);
  const filtered = filterTrophies(state.trophies, {
    kind: state.kind,
    query: state.query,
    earnedOnly: state.earnedOnly,
    earned: state.earned,
  });
  const list = document.getElementById('trophyList');
  const empty = document.getElementById('emptyNote');
  renderChecklist(list, filtered, state.earned, opts(), onToggle, onSelect, state.selectedId);
  empty.hidden = filtered.length > 0 || state.view !== 'checklist';
  renderDetail(state.trophies, state.selectedId, state.earned, opts());
  if (state.roadmap) renderRoadmap(state.roadmap, state.trophies, state.earned);
  renderMissables(state.trophies, state.earned, opts(), onToggle, onSelect, state.selectedId);
}

function onToggle(id) {
  state.earned = toggleEarned(state.earned, id);
  refreshAll();
}

function onSelect(id) {
  state.selectedId = id;
  renderDetail(state.trophies, id, state.earned, opts());
  document.querySelectorAll('.trophy-row').forEach((row) => {
    row.classList.toggle('selected', Number(row.dataset.id) === id);
  });
}

function showView(view) {
  state.view = view;
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  document.getElementById('viewChecklist').hidden = view !== 'checklist';
  document.getElementById('viewRoadmap').hidden = view !== 'roadmap';
  document.getElementById('viewMissables').hidden = view !== 'missables';
  document.getElementById('viewSettings').hidden = view !== 'settings';
  document.getElementById('toolbar').style.display = view === 'checklist' ? '' : 'none';
  if (view === 'checklist') refreshAll();
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('leonida-ledger-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'paper' ? 'Night theme' : 'Paper theme';
}

async function boot() {
  document.addEventListener('leonida:toggle', (event) => onToggle(event.detail.id));

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });

  document.querySelectorAll('#kindFilters .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      state.kind = chip.dataset.kind;
      document.querySelectorAll('#kindFilters .chip').forEach((c) => {
        c.classList.toggle('active', c === chip);
      });
      refreshAll();
    });
  });

  document.getElementById('searchInput').addEventListener('input', (event) => {
    state.query = event.target.value;
    refreshAll();
  });
  document.getElementById('spoilerToggle').addEventListener('change', (event) => {
    state.spoilersHidden = event.target.checked;
    refreshAll();
  });
  document.getElementById('earnedOnlyToggle').addEventListener('change', (event) => {
    state.earnedOnly = event.target.checked;
    refreshAll();
  });
  document.getElementById('themeToggle').addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'paper' ? 'night' : 'paper';
    setTheme(next);
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    const count = exportProgress(state.earned);
    document.getElementById('saveStatus').textContent = 'Exported ' + count + ' earned trophies to a file.';
  });
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const validIds = new Set(state.trophies.map((t) => t.id));
      state.earned = await importProgressFile(file, validIds);
      document.getElementById('saveStatus').textContent = 'Imported ' + state.earned.size + ' earned trophies from ' + file.name + '.';
      refreshAll();
    } catch (err) {
      document.getElementById('saveStatus').textContent = 'Import failed: ' + err.message;
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all progress? This clears every earned trophy.')) return;
    state.earned = resetProgress();
    document.getElementById('saveStatus').textContent = 'Progress reset.';
    refreshAll();
  });

  const savedTheme = localStorage.getItem('leonida-ledger-theme');
  if (savedTheme === 'night' || savedTheme === 'paper') setTheme(savedTheme);

  const data = await loadGuideData();
  state.trophies = data.trophies;
  state.roadmap = data.roadmap;
  state.earned = maybeSeedDemo(loadProgress(), new URLSearchParams(window.location.search));

  const counts = countByKind(state.trophies);
  for (const kind of KINDS) {
    const span = document.querySelector('[data-count-for="' + kind + '"]');
    if (span) span.textContent = '(' + counts[kind] + ')';
  }

  document.getElementById('spoilerToggle').checked = state.spoilersHidden;
  refreshAll();
}

boot().catch((err) => {
  document.getElementById('trophyList').innerHTML =
    '<li class="trophy-row">The guide could not load its data: ' + err.message + '</li>';
});
