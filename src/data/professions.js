// Crafting professions for Darkness Descending.
// A profession decides which raw materials a character can gather and work.

export const PROFESSIONS = {
  smith: {
    id: "smith",
    name: "Smith",
    icon: "🔨", // hammer
    tagline: "Master of metal and leather",
    description:
      "Forges armor and weapons at the anvil. Works metal and leather into gear that turns aside the dark.",
    materials: ["metal", "leather"],
  },
  tailor: {
    id: "tailor",
    name: "Tailor",
    icon: "🧵", // spool of thread
    tagline: "Master of cloth and jewels",
    description:
      "Stitches robes and sets glittering wards. Works cloth and jewels into raiment humming with power.",
    materials: ["cloth", "jewels"],
  },
};

export const PROFESSION_ORDER = ["smith", "tailor"];
