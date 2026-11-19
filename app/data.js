// Data access for the Leonida Ledger: loads the trophy list and the roadmap,
// and answers the questions the views ask about them. No network beyond app/.

export const TROPHY_URL = './data/trophies.json';
export const ROADMAP_URL = './data/roadmap.json';

export async function loadGuideData() {
  const [trophiesRes, roadmapRes] = await Promise.all([
    fetch(TROPHY_URL),
    fetch(ROADMAP_URL),
  ]);
  if (!trophiesRes.ok) throw new Error('Could not load the trophy list.');
  if (!roadmapRes.ok) throw new Error('Could not load the roadmap.');
  const trophiesDoc = await trophiesRes.json();
  const roadmapDoc = await roadmapRes.json();
  return { trophies: trophiesDoc.trophies, roadmap: roadmapDoc };
}

export function trophyById(trophies, id) {
  return trophies.find((t) => t.id === id) || null;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = {
    story: 'Story',
    collectibles: 'Collectibles',
    activities: 'Activities',
    challenge: 'Challenge',
    online: 'Online',
  };
  return labels[kind] || kind;
}

export function isStoryTrophy(trophy) {
  return trophy.kind === 'story';
}

export function targetText(trophy) {
  if (trophy.target == null) return '';
  if (typeof trophy.target === 'number' && trophy.target >= 1000) {
    return '$' + trophy.target.toLocaleString('en-US');
  }
  return String(trophy.target);
}
