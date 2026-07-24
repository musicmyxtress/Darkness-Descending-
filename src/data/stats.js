// Core stats for Darkness Descending.
//
// Every character starts with BASE_STAT in each stat, plus CLASS_BONUS in the
// single stat affiliated with their class, plus FREE_POINTS the player
// allocates freely after character creation.

export const BASE_STAT = 5;
export const CLASS_BONUS = 2;
export const FREE_POINTS = 4;

export const STATS = {
  strength: {
    id: "strength",
    name: "Strength",
    abbr: "STR",
    classId: "warrior",
    description: "Determines how hard you hit with a weapon.",
  },
  dexterity: {
    id: "dexterity",
    name: "Dexterity",
    abbr: "DEX",
    classId: "thief",
    description:
      "Determines your carrying capacity — you can carry half your Dexterity " +
      "in items — and gives a chance to strike twice with a weapon.",
  },
  intelligence: {
    id: "intelligence",
    name: "Intelligence",
    abbr: "INT",
    classId: "mage",
    description:
      "Determines how hard your damage and damage-over-time spells hit.",
  },
  wisdom: {
    id: "wisdom",
    name: "Wisdom",
    abbr: "WIS",
    classId: "cleric",
    description:
      "Speeds your health and mana regeneration outside of combat.",
  },
};

export const STAT_ORDER = ["strength", "dexterity", "intelligence", "wisdom"];

/** The stats a freshly created character of `classId` starts with. */
export function baseStatsFor(classId) {
  const stats = {};
  for (const id of STAT_ORDER) {
    stats[id] = BASE_STAT + (STATS[id].classId === classId ? CLASS_BONUS : 0);
  }
  return stats;
}

/** How many items a character with this much Dexterity can carry. */
export function carryCapacity(dexterity) {
  return Math.floor(dexterity / 2);
}
