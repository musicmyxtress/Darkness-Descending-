// Character classes for Darkness Descending.
//
// Each class carries a short flavor description and the stat it is affiliated
// with. All classes share the same stat baseline (see src/data/stats.js);
// the affiliated stat gets the class bonus.

export const CLASSES = {
  mage: {
    id: "mage",
    name: "Mage",
    icon: "✨", // sparkles
    tagline: "Weaver of arcane fire",
    description:
      "Bends raw magic to their will. Devastating at range, but frail when the darkness closes in.",
    bonusStat: "intelligence",
  },
  cleric: {
    id: "cleric",
    name: "Cleric",
    icon: "✝", // latin cross
    tagline: "Bearer of holy light",
    description:
      "Channels divine power to mend wounds and smite the wicked. A beacon against the descending dark.",
    bonusStat: "wisdom",
  },
  thief: {
    id: "thief",
    name: "Thief",
    icon: "🗡", // dagger
    tagline: "Shadow in the corridors",
    description:
      "Strikes from the dark and vanishes before the blood dries. Nimble, cunning, and always one step ahead.",
    bonusStat: "dexterity",
  },
  warrior: {
    id: "warrior",
    name: "Warrior",
    icon: "⚔", // crossed swords
    tagline: "Wall of steel and fury",
    description:
      "Meets the horde head-on with shield and blade. Where a Warrior stands, the darkness breaks.",
    bonusStat: "strength",
  },
};

export const CLASS_ORDER = ["mage", "cleric", "thief", "warrior"];
