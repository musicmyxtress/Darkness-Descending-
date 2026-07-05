// Character classes for Darkness Descending.
// Each class carries a short flavor description and a set of base stats that
// later gameplay systems can build on.

export const CLASSES = {
  mage: {
    id: "mage",
    name: "Mage",
    icon: "✨", // sparkles
    tagline: "Weaver of arcane fire",
    description:
      "Bends raw magic to their will. Devastating at range, but frail when the darkness closes in.",
    stats: { might: 3, agility: 5, wits: 10, spirit: 8, vigor: 4 },
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    icon: "✝", // latin cross
    tagline: "Bearer of holy light",
    description:
      "Channels divine power to mend wounds and smite the wicked. A beacon against the descending dark.",
    stats: { might: 5, agility: 4, wits: 6, spirit: 10, vigor: 7 },
  },
  thief: {
    id: "thief",
    name: "Thief",
    icon: "🗡", // dagger
    tagline: "Shadow in the corridors",
    description:
      "Strikes from the dark and vanishes before the blood dries. Nimble, cunning, and always one step ahead.",
    stats: { might: 5, agility: 10, wits: 7, spirit: 3, vigor: 5 },
  },
  warrior: {
    id: "warrior",
    name: "Warrior",
    icon: "⚔", // crossed swords
    tagline: "Wall of steel and fury",
    description:
      "Meets the horde head-on with shield and blade. Where a Warrior stands, the darkness breaks.",
    stats: { might: 10, agility: 6, wits: 4, spirit: 4, vigor: 9 },
  },
};

export const CLASS_ORDER = ["mage", "cleric", "thief", "warrior"];
