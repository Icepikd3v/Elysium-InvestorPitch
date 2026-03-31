export const BRAND_FOLDERS = {
  louboutin: "christianlouboutin",
  jimmychoo: "Jimmy Choo",
  omega: "Omega",
  prada: "Prada",
};

export const BRAND_PREFIX = {
  louboutin: "lb",
  jimmychoo: "jc",
  omega: "om",
  prada: "pr",
};

export const COLOR_MAP = {
  black: "black",
  red: "red",
  beige: "beige",
  blue: "blue",
  iceblue: "iceblue",
};

export function buildProductImage(storeKey, model, color) {
  const folder = BRAND_FOLDERS[storeKey];
  const prefix = BRAND_PREFIX[storeKey];

  const colorKey = COLOR_MAP[color] || "black";

  return `/products/${folder}/${prefix}-${model}-${colorKey}.png`;
}
