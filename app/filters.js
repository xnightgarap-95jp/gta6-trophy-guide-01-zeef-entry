// Filters and the spoiler rule for the Leonida Ledger.

export const KINDS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export function filterTrophies(trophies, { kind, query, earnedOnly, earned }) {
  const q = (query || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === 'story' && t.kind !== 'story') return false;
    if (kind === 'collectibles' && t.kind !== 'collectibles') return false;
    if (kind === 'activities' && t.kind !== 'activities') return false;
    if (kind === 'missable' && !t.missable) return false;
    if (kind === 'online') return false; // This list holds no online trophies.
    if (earnedOnly && earned.has(t.id)) return false;
    if (q) {
      const haystack = [t.name, t.description, t.guide, t.kind].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

// The spoiler rule: a story trophy stays hidden — name and description both —
// until it is earned. Only the earned set and the spoiler setting decide it.
export function isSpoilerHidden(trophy, { spoilersHidden, earned }) {
  return spoilersHidden && trophy.kind === 'story' && !earned.has(trophy.id);
}

export function countByKind(trophies) {
  const counts = { all: trophies.length, story: 0, missable: 0, collectibles: 0, activities: 0, online: 0 };
  for (const t of trophies) {
    if (t.kind === 'story') counts.story += 1;
    if (t.kind === 'collectibles') counts.collectibles += 1;
    if (t.kind === 'activities') counts.activities += 1;
    if (t.missable) counts.missable += 1;
  }
  return counts;
}
