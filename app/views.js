// Rendering for the Leonida Ledger: the checklist, the guide pane, the
// roadmap and the missables page, all from the loaded trophy data.

import { gradeLabel, kindLabel, targetText, trophyById } from './data.js';
import { isSpoilerHidden } from './filters.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function gradeDot(grade) {
  const dot = el('span', 'grade-dot ' + grade);
  dot.title = gradeLabel(grade);
  return dot;
}

function tagsFor(trophy) {
  const wrap = el('p', 'trophy-meta');
  const gradeTag = el('span', 'tag grade-' + trophy.grade, gradeLabel(trophy.grade));
  wrap.append(gradeTag);
  wrap.append(el('span', 'tag', kindLabel(trophy.kind)));
  if (trophy.hidden) wrap.append(el('span', 'tag', 'Hidden on PSN'));
  if (trophy.missable) wrap.append(el('span', 'tag missable', 'Missable'));
  if (trophy.target != null) wrap.append(el('span', 'tag', 'Target: ' + targetText(trophy)));
  return wrap;
}

export function renderProgress(trophies, earned) {
  const earnedCount = document.getElementById('earnedCount');
  const fill = document.getElementById('progressFill');
  const counts = document.getElementById('gradeCounts');
  earnedCount.textContent = String(earned.size);
  fill.style.width = ((earned.size / trophies.length) * 100).toFixed(1) + '%';
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    totals[t.grade] += 1;
    if (earned.has(t.id)) byGrade[t.grade] += 1;
  }
  counts.textContent =
    'Platinum ' + byGrade.platinum + '/' + totals.platinum +
    ' · Gold ' + byGrade.gold + '/' + totals.gold +
    ' · Silver ' + byGrade.silver + '/' + totals.silver +
    ' · Bronze ' + byGrade.bronze + '/' + totals.bronze;
}

export function renderChecklist(list, trophies, earned, opts, onToggle, onSelect, selectedId) {
  list.innerHTML = '';
  for (const trophy of trophies) {
    const row = el('li', 'trophy-row');
    row.dataset.id = String(trophy.id);
    if (earned.has(trophy.id)) row.classList.add('earned');
    if (trophy.id === selectedId) row.classList.add('selected');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.id);
    box.setAttribute('aria-label', 'Earned: ' + trophy.name);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });
    row.append(box);
    row.append(gradeDot(trophy.grade));

    const body = el('div');
    if (isSpoilerHidden(trophy, opts)) {
      body.append(el('p', 'trophy-name spoiler-name', 'Hidden story trophy — earn it to reveal its name'));
      body.append(el('p', 'trophy-desc', 'Its name and description stay hidden while spoilers are on.'));
    } else {
      const name = el('p', 'trophy-name', trophy.name);
      if (trophy.hidden) name.append(el('span', 'hidden-tag', ' · Hidden'));
      body.append(name);
      body.append(el('p', 'trophy-desc', trophy.description));
    }
    body.append(tagsFor(trophy));
    row.append(body);

    const openBtn = el('button', null, 'Guide');
    openBtn.type = 'button';
    openBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      onSelect(trophy.id);
    });
    row.append(openBtn);

    row.addEventListener('click', () => onSelect(trophy.id));
    list.append(row);
  }
}

export function renderDetail(trophies, id, earned, opts) {
  const empty = document.querySelector('.detail-empty');
  const body = document.getElementById('detailBody');
  const trophy = trophyById(trophies, id);
  if (!trophy) {
    empty.hidden = false;
    body.hidden = true;
    return;
  }
  empty.hidden = true;
  body.hidden = false;
  body.innerHTML = '';

  const hidden = isSpoilerHidden(trophy, opts);
  body.append(el('h2', null, hidden ? 'Hidden story trophy' : trophy.name));
  if (hidden) {
    body.append(el('p', 'official-desc', 'This story trophy is hidden while spoilers are on. Earn it in the game — or turn spoilers off in the toolbar — to read its guide.'));
  } else {
    body.append(el('p', 'official-desc', '"' + trophy.description + '"'));
    body.append(tagsFor(trophy));
    const guideHead = el('h3', null, 'Guide');
    body.append(guideHead);
    body.append(el('p', null, trophy.guide));
    const sourcesHead = el('h3', null, 'Sources');
    body.append(sourcesHead);
    body.append(el('p', 'sources', trophy.sources));
    if (trophy.target != null) {
      body.append(el('p', null, 'PSN-tracked target: ' + targetText(trophy) + '.'));
    }
  }

  const actions = el('div', 'detail-actions');
  const toggleBtn = el('button', null, earned.has(trophy.id) ? 'Mark as unearned' : 'Mark as earned');
  toggleBtn.type = 'button';
  toggleBtn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('leonida:toggle', { detail: { id: trophy.id } }));
  });
  actions.append(toggleBtn);
  body.append(actions);
}

export function renderRoadmap(roadmap, trophies, earned) {
  const intro = document.getElementById('roadmapBuiltFrom');
  intro.textContent = roadmap.built_from;
  const list = document.getElementById('roadmapList');
  list.innerHTML = '';
  for (const stage of roadmap.stages) {
    const item = el('li');
    item.append(el('h3', null, stage.name));
    item.append(el('p', null, stage.text));
    const chips = el('p', 'stage-trophies');
    for (const id of stage.trophy_ids) {
      const t = trophyById(trophies, id);
      if (!t) continue;
      const chip = el('span', earned.has(id) ? 'done' : '', (earned.has(id) ? '✓ ' : '') + t.name);
      chips.append(chip);
    }
    item.append(chips);
    const done = stage.trophy_ids.filter((id) => earned.has(id)).length;
    item.append(el('p', null, done + ' of ' + stage.trophy_ids.length + ' earned in this stage.'));
    list.append(item);
  }
}

export function renderMissables(trophies, earned, opts, onToggle, onSelect, selectedId) {
  const note = document.getElementById('missableNote');
  note.textContent = 'These trophies are tied to one story moment, one mission or one partner window in their official description. Earn each the first time that moment comes — and save before the flagged moments.';
  const missable = trophies.filter((t) => t.missable);
  const list = document.getElementById('missableList');
  renderChecklist(list, missable, earned, opts, onToggle, onSelect, selectedId);
}
