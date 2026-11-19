// Saved progress for the Leonida Ledger: a checklist kept in localStorage,
// with export to a file and import back. Nothing leaves the browser.

export const STORAGE_KEY = 'leonida-ledger-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.earned)) return new Set();
    return new Set(parsed.earned.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  const payload = { app: 'leonida-ledger', version: 1, earned: [...earned].sort((a, b) => a - b) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function toggleEarned(earned, id) {
  const next = new Set(earned);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveProgress(next);
  return next;
}

export function exportProgress(earned) {
  const payload = saveProgress(earned);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-ledger-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return payload.earned.length;
}

export function importProgressFile(file, validIds) {
  return file.text().then((text) => {
    const parsed = JSON.parse(text);
    const earned = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(earned)) throw new Error('That file has no earned list.');
    const next = new Set(earned.filter((id) => Number.isInteger(id) && validIds.has(id)));
    saveProgress(next);
    return next;
  });
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return new Set();
}

// Demo seeding for screenshots: ?seed=13 marks the first 13 story trophies
// earned, only when no progress is saved yet. It is a demo aid, not a cheat:
// the reader's own saved progress always wins.
export function maybeSeedDemo(earned, searchParams) {
  const seed = Number.parseInt(searchParams.get('seed') || '', 10);
  if (!Number.isInteger(seed) || seed <= 0 || earned.size > 0) return earned;
  const seeded = new Set([2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 20, 21].slice(0, seed));
  saveProgress(seeded);
  return seeded;
}
