/**
 * Decorative reference numbers on the case study pages. They are derived from
 * the case study id so they stay the same on every visit.
 */

function charSum(id: string): number {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return sum;
}

/** FNV-1a, a small stable string hash. */
function hash(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export const experimentNumber = (id: string) => (charSum(id) % 9000) + 1000;

export const contractCode = (id: string) => charSum(id).toString(16).slice(0, 6).toUpperCase();

export const ticketNumber = (id: string) => (hash(id) % 9000) + 1000;

export const reportId = (id: string) => `${id}-${hash(`report:${id}`).toString(36).toUpperCase()}`;
