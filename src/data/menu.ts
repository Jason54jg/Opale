export type MenuCategoryId =
  | "kebabs"
  | "tacos"
  | "plates"
  | "burgers"
  | "sides"
  | "salads"
  | "kids"
  | "desserts"
  | "sauces";

export type MenuItem = {
  id: string;
  nameKey: string;
  price?: number;
  priceAlt?: number;
  noteKey?: string;
  homemade?: boolean;
  category: MenuCategoryId;
};

/** Source : menu PDF officiel Opale (à emporter). */
export const MENU_ITEMS: MenuItem[] = [
  // Sandwiches
  { id: "kebab", nameKey: "items.kebab", price: 7, category: "kebabs" },
  {
    id: "kebab-chef",
    nameKey: "items.kebabChef",
    price: 9,
    noteKey: "items.kebabChefNote",
    category: "kebabs",
  },
  { id: "maxi-kebab", nameKey: "items.maxiKebab", price: 12, category: "kebabs" },
  {
    id: "maxi-kebab-chef",
    nameKey: "items.maxiKebabChef",
    price: 13,
    category: "kebabs",
  },
  { id: "durum", nameKey: "items.durum", price: 8, category: "kebabs" },
  {
    id: "maxi-durum",
    nameKey: "items.maxiDurum",
    price: 13,
    category: "kebabs",
  },
  {
    id: "americain",
    nameKey: "items.americain",
    price: 8.5,
    homemade: true,
    category: "kebabs",
  },
  {
    id: "maxi-americain",
    nameKey: "items.maxiAmericain",
    price: 13.5,
    homemade: true,
    category: "kebabs",
  },
  {
    id: "crousty",
    nameKey: "items.crousty",
    price: 9.5,
    priceAlt: 11,
    noteKey: "items.croustyNote",
    category: "kebabs",
  },
  {
    id: "brochette-poulet",
    nameKey: "items.brochettePoulet",
    price: 8,
    homemade: true,
    category: "kebabs",
  },
  {
    id: "kofte",
    nameKey: "items.kofte",
    price: 8,
    homemade: true,
    category: "kebabs",
  },
  {
    id: "merguez",
    nameKey: "items.merguez",
    price: 8,
    homemade: true,
    category: "kebabs",
  },
  {
    id: "adana",
    nameKey: "items.adana",
    price: 8,
    homemade: true,
    category: "kebabs",
  },
  { id: "sucuk", nameKey: "items.sucuk", price: 8, category: "kebabs" },
  {
    id: "cordon-bleu",
    nameKey: "items.cordonBleu",
    price: 7,
    category: "kebabs",
  },
  { id: "lahmacun", nameKey: "items.lahmacun", price: 9, category: "kebabs" },
  {
    id: "panini-chevre",
    nameKey: "items.paniniChevre",
    price: 7.5,
    category: "kebabs",
  },
  {
    id: "panini-nutella",
    nameKey: "items.paniniNutella",
    price: 7.5,
    category: "kebabs",
  },

  // Burgers
  {
    id: "cheeseburger",
    nameKey: "items.cheeseburger",
    price: 7.5,
    category: "burgers",
  },
  {
    id: "double-cheeseburger",
    nameKey: "items.doubleCheeseburger",
    price: 9.5,
    category: "burgers",
  },

  // Assiettes
  {
    id: "mini-assiette",
    nameKey: "items.miniAssiette",
    price: 8.5,
    category: "plates",
  },
  {
    id: "assiette-kebab",
    nameKey: "items.assietteKebab",
    price: 11,
    category: "plates",
  },
  {
    id: "assiette-chef",
    nameKey: "items.assietteChef",
    price: 13,
    category: "plates",
  },
  {
    id: "assiette-orientale",
    nameKey: "items.assietteOrientale",
    price: 16,
    category: "plates",
  },
  {
    id: "assiette-mixte",
    nameKey: "items.assietteMixte",
    price: 16,
    category: "plates",
  },
  {
    id: "assiette-mixte-panes",
    nameKey: "items.assietteMixtePanes",
    price: 16,
    category: "plates",
  },
  {
    id: "assiette-adana",
    nameKey: "items.assietteAdana",
    price: 11,
    homemade: true,
    category: "plates",
  },
  {
    id: "assiette-kofte",
    nameKey: "items.assietteKofte",
    price: 11,
    homemade: true,
    category: "plates",
  },
  {
    id: "assiette-brochette",
    nameKey: "items.assietteBrochette",
    price: 11,
    homemade: true,
    category: "plates",
  },
  {
    id: "assiette-merguez",
    nameKey: "items.assietteMerguez",
    price: 11,
    homemade: true,
    category: "plates",
  },
  {
    id: "assiette-sucuk",
    nameKey: "items.assietteSucuk",
    price: 11,
    category: "plates",
  },
  {
    id: "assiette-tenders",
    nameKey: "items.assietteTenders",
    price: 11,
    category: "plates",
  },
  {
    id: "assiette-nuggets",
    nameKey: "items.assietteNuggets",
    price: 11,
    category: "plates",
  },

  // Barquettes / sides
  {
    id: "barquette-petite",
    nameKey: "items.barquettePetite",
    price: 3,
    category: "sides",
  },
  {
    id: "barquette-grande",
    nameKey: "items.barquetteGrande",
    price: 5,
    category: "sides",
  },
  {
    id: "frites-viandes-petite",
    nameKey: "items.fritesViandesPetite",
    price: 8,
    category: "sides",
  },
  {
    id: "frites-viandes-grande",
    nameKey: "items.fritesViandesGrande",
    price: 13,
    category: "sides",
  },
  {
    id: "nuggets-6",
    nameKey: "items.nuggets6",
    price: 6,
    category: "sides",
  },
  {
    id: "nuggets-8",
    nameKey: "items.nuggets8",
    price: 8,
    category: "sides",
  },
  {
    id: "tenders-4",
    nameKey: "items.tenders4",
    price: 7,
    category: "sides",
  },
  {
    id: "supp-viande",
    nameKey: "items.suppViande",
    price: 2.5,
    category: "sides",
  },

  // Salades
  {
    id: "crudites",
    nameKey: "items.crudites",
    price: 9,
    noteKey: "items.cruditesNote",
    category: "salads",
  },
  {
    id: "nicoise",
    nameKey: "items.nicoise",
    price: 9,
    noteKey: "items.nicoiseNote",
    category: "salads",
  },
  {
    id: "montagnarde",
    nameKey: "items.montagnarde",
    price: 9,
    noteKey: "items.montagnardeNote",
    category: "salads",
  },
  {
    id: "orientale",
    nameKey: "items.orientale",
    price: 9,
    noteKey: "items.orientaleNote",
    category: "salads",
  },

  // Menu enfant
  {
    id: "kids-nuggets",
    nameKey: "items.kidsNuggets",
    price: 8.5,
    noteKey: "items.kidsNuggetsNote",
    category: "kids",
  },
  {
    id: "kids-steak",
    nameKey: "items.kidsSteak",
    price: 8.5,
    homemade: true,
    noteKey: "items.kidsSteakNote",
    category: "kids",
  },
  {
    id: "kids-kebab",
    nameKey: "items.kidsKebab",
    price: 8.5,
    noteKey: "items.kidsKebabNote",
    category: "kids",
  },

  // Desserts
  {
    id: "tiramisu",
    nameKey: "items.tiramisu",
    price: 3.5,
    homemade: true,
    category: "desserts",
  },
  { id: "lokum", nameKey: "items.lokum", price: 3.5, category: "desserts" },
  { id: "baklava", nameKey: "items.baklava", price: 3.5, category: "desserts" },
  { id: "helva", nameKey: "items.helva", price: 3.5, category: "desserts" },

  // Sauces
  { id: "sauce-blanche", nameKey: "sauces.blanche", category: "sauces" },
  { id: "sauce-algerienne", nameKey: "sauces.algerienne", category: "sauces" },
  { id: "sauce-harissa", nameKey: "sauces.harissa", category: "sauces" },
  { id: "sauce-barbecue", nameKey: "sauces.barbecue", category: "sauces" },
  { id: "sauce-biggy", nameKey: "sauces.biggy", category: "sauces" },
  { id: "sauce-ketchup", nameKey: "sauces.ketchup", category: "sauces" },
  { id: "sauce-mayo", nameKey: "sauces.mayonnaise", category: "sauces" },
  { id: "sauce-curry", nameKey: "sauces.curry", category: "sauces" },
  { id: "sauce-marocaine", nameKey: "sauces.marocaine", category: "sauces" },
  { id: "sauce-samourai", nameKey: "sauces.samourai", category: "sauces" },
  { id: "sauce-tartare", nameKey: "sauces.tartare", category: "sauces" },
  { id: "sauce-andalouse", nameKey: "sauces.andalouse", category: "sauces" },
  { id: "sauce-moutarde", nameKey: "sauces.moutarde", category: "sauces" },
  {
    id: "sauce-fromagere",
    nameKey: "sauces.fromagere",
    price: 1,
    noteKey: "sauces.extraNote",
    category: "sauces",
  },
];

export const TACOS_SIZES = [
  { id: "M", meats: 1, price: 8 },
  { id: "L", meats: 2, price: 9.5 },
  { id: "XL", meats: 3, price: 11.5 },
  { id: "XXL", meats: 4, price: 13.5 },
] as const;

/** Menu officiel : « CHOIX DES SAUCES (1 ou 2) ». */
export const TACOS_MAX_SAUCES = 2;
export const TACOS_MIN_SAUCES = 1;

export type TacosSizeId = (typeof TACOS_SIZES)[number]["id"];

export function computeTacosPrice(
  sizeId: TacosSizeId,
  sauces: string[],
  extras: string[],
): number {
  const size = TACOS_SIZES.find((s) => s.id === sizeId)!;
  let sum = size.price;
  if (sauces.includes("fromagere")) sum += 1;
  sum += extras.length;
  return sum;
}

export function isValidTacosComposition(
  sizeId: TacosSizeId,
  meats: string[],
  sauces: string[],
): boolean {
  const size = TACOS_SIZES.find((s) => s.id === sizeId)!;
  return (
    meats.length === size.meats &&
    sauces.length >= TACOS_MIN_SAUCES &&
    sauces.length <= TACOS_MAX_SAUCES
  );
}

/** Sandwiches / burgers composables (sauces 1 ou 2 + extras). */
export const COMPOSABLE_ITEM_IDS = [
  "kebab",
  "kebab-chef",
  "maxi-kebab",
  "maxi-kebab-chef",
  "durum",
  "maxi-durum",
  "americain",
  "maxi-americain",
  "crousty",
  "brochette-poulet",
  "kofte",
  "merguez",
  "adana",
  "sucuk",
  "cordon-bleu",
  "lahmacun",
  "cheeseburger",
  "double-cheeseburger",
] as const;

export type ComposableItemId = (typeof COMPOSABLE_ITEM_IDS)[number];

export function getComposableItems() {
  return COMPOSABLE_ITEM_IDS.map((id) => {
    const item = MENU_ITEMS.find((m) => m.id === id)!;
    return item;
  }).filter((item) => item.price != null);
}

export function isValidSandwichComposition(sauces: string[]): boolean {
  return (
    sauces.length >= TACOS_MIN_SAUCES && sauces.length <= TACOS_MAX_SAUCES
  );
}

export const TACOS_MEATS = [
  { id: "kebab", nameKey: "meats.kebab" },
  { id: "brochette", nameKey: "meats.brochette", homemade: true },
  { id: "steak", nameKey: "meats.steak", homemade: true },
  { id: "sucuk", nameKey: "meats.sucuk" },
  { id: "cordon", nameKey: "meats.cordon" },
  { id: "kofte", nameKey: "meats.kofte", homemade: true },
  { id: "nuggets", nameKey: "meats.nuggets" },
  { id: "adana", nameKey: "meats.adana", homemade: true },
  { id: "merguez", nameKey: "meats.merguez", homemade: true },
  { id: "tenders", nameKey: "meats.tenders" },
] as const;

export const TACOS_SAUCES = [
  { id: "blanche", nameKey: "sauces.blanche" },
  { id: "algerienne", nameKey: "sauces.algerienne" },
  { id: "harissa", nameKey: "sauces.harissa" },
  { id: "barbecue", nameKey: "sauces.barbecue" },
  { id: "biggy", nameKey: "sauces.biggy" },
  { id: "ketchup", nameKey: "sauces.ketchup" },
  { id: "mayonnaise", nameKey: "sauces.mayonnaise" },
  { id: "curry", nameKey: "sauces.curry" },
  { id: "marocaine", nameKey: "sauces.marocaine" },
  { id: "samourai", nameKey: "sauces.samourai" },
  { id: "tartare", nameKey: "sauces.tartare" },
  { id: "andalouse", nameKey: "sauces.andalouse" },
  { id: "moutarde", nameKey: "sauces.moutarde" },
  { id: "fromagere", nameKey: "sauces.fromagere", extra: 1 },
] as const;

export const TACOS_EXTRAS = [
  { id: "cheddar", nameKey: "extras.cheddar", price: 1 },
  { id: "feta", nameKey: "extras.feta", price: 1 },
  { id: "oeuf", nameKey: "extras.oeuf", price: 1 },
  { id: "chevre", nameKey: "extras.chevre", price: 1 },
  { id: "vache", nameKey: "extras.vache", price: 1 },
] as const;

export const CATEGORIES: MenuCategoryId[] = [
  "kebabs",
  "tacos",
  "plates",
  "burgers",
  "sides",
  "salads",
  "kids",
  "desserts",
];

export const BUSINESS = {
  name: "Opale",
  since: 1999,
  address: "38 Rue de France, 88300 Neufchâteau, France",
  phone: "03 29 94 16 94",
  phoneHref: "tel:+33329941694",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=38+Rue+de+France+88300+Neufch%C3%A2teau+France",
  sandwichMenuExtra: 1.5,
  sauceChoice: "1 ou 2",
} as const;

export function computeSandwichPrice(
  itemId: string,
  sauces: string[],
  extras: string[],
  withMenu: boolean,
): number {
  const item = MENU_ITEMS.find((m) => m.id === itemId)!;
  let sum = item.price ?? 0;
  // Crousty : 9,50 € seul / 11 € avec boisson 33cl
  if (itemId === "crousty" && withMenu && item.priceAlt != null) {
    sum = item.priceAlt;
  } else if (withMenu && itemId !== "crousty") {
    sum += BUSINESS.sandwichMenuExtra;
  }
  if (sauces.includes("fromagere")) sum += 1;
  sum += extras.length;
  return sum;
}

export function formatPrice(value: number, locale: "fr" | "en"): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
