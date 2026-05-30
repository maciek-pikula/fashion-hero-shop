/**
 * Size finder logic — maps measurements to sizes.
 *
 * Shoes: foot length in cm → EU/US men's or women's size
 * Apparel: chest + waist + hips in cm → size number (1=XS, 2=S, 3=M, 4=L, 5=XL)
 */

export type ProductType = "shoes" | "apparel";
export type GenderCategory = "men" | "women" | "unisex";

// ── Shoes ────────────────────────────────────────────────────────────────────
// foot length (cm) → men's US size
const MEN_SHOE_TABLE: { foot: number; us: number }[] = [
  { foot: 24.5, us: 7 },
  { foot: 25.1, us: 7.5 },
  { foot: 25.7, us: 8 },
  { foot: 26.2, us: 8.5 },
  { foot: 26.7, us: 9 },
  { foot: 27.3, us: 9.5 },
  { foot: 27.9, us: 10 },
  { foot: 28.4, us: 10.5 },
  { foot: 29.0, us: 11 },
  { foot: 29.5, us: 11.5 },
  { foot: 30.0, us: 12 },
  { foot: 30.8, us: 13 },
];

// foot length (cm) → women's US size
const WOMEN_SHOE_TABLE: { foot: number; us: number }[] = [
  { foot: 21.6, us: 5 },
  { foot: 22.2, us: 5.5 },
  { foot: 22.8, us: 6 },
  { foot: 23.3, us: 6.5 },
  { foot: 23.8, us: 7 },
  { foot: 24.4, us: 7.5 },
  { foot: 24.9, us: 8 },
  { foot: 25.5, us: 8.5 },
  { foot: 26.0, us: 9 },
  { foot: 26.6, us: 9.5 },
  { foot: 27.1, us: 10 },
  { foot: 27.9, us: 11 },
];

/** Returns closest US shoe size for given foot length (cm) */
export function getShoeSize(footLengthCm: number, gender: "men" | "women"): number | null {
  const table = gender === "men" ? MEN_SHOE_TABLE : WOMEN_SHOE_TABLE;
  if (footLengthCm <= 0) return null;

  // Find nearest entry
  let best = table[0];
  let bestDiff = Math.abs(footLengthCm - table[0].foot);
  for (const row of table) {
    const diff = Math.abs(footLengthCm - row.foot);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = row;
    }
  }
  return best.us;
}

// ── Apparel ───────────────────────────────────────────────────────────────────
// Internal sizes: 1=XS, 2=S, 3=M, 4=L, (5=XL if product has it)
export const APPAREL_SIZE_LABELS: Record<number, string> = {
  1: "XS",
  2: "S",
  3: "M",
  4: "L",
  5: "XL",
};

// Men's apparel chart (chest cm)
const MEN_APPAREL_TABLE: { maxChest: number; size: number }[] = [
  { maxChest: 88,  size: 1 }, // XS
  { maxChest: 96,  size: 2 }, // S
  { maxChest: 104, size: 3 }, // M
  { maxChest: 112, size: 4 }, // L
  { maxChest: 999, size: 5 }, // XL+
];

// Women's apparel chart (chest, waist, hips cm) — uses max of any dimension
const WOMEN_APPAREL_TABLE: { maxChest: number; maxWaist: number; maxHips: number; size: number }[] = [
  { maxChest: 82,  maxWaist: 62,  maxHips: 88,  size: 1 }, // XS
  { maxChest: 88,  maxWaist: 68,  maxHips: 94,  size: 2 }, // S
  { maxChest: 96,  maxWaist: 76,  maxHips: 102, size: 3 }, // M
  { maxChest: 104, maxWaist: 84,  maxHips: 110, size: 4 }, // L
  { maxChest: 999, maxWaist: 999, maxHips: 999, size: 5 }, // XL+
];

export interface ApparelMeasurements {
  chest: number;
  waist: number;
  hips: number;
}

/** Returns apparel size number (1–5) for given measurements */
export function getApparelSize(
  measurements: ApparelMeasurements,
  gender: "men" | "women" | "unisex"
): number | null {
  const { chest, waist, hips } = measurements;
  if (chest <= 0 || waist <= 0 || hips <= 0) return null;

  if (gender === "women") {
    for (const row of WOMEN_APPAREL_TABLE) {
      if (chest <= row.maxChest && waist <= row.maxWaist && hips <= row.maxHips) {
        return row.size;
      }
    }
    return 5;
  } else {
    // men or unisex — use chest only
    for (const row of MEN_APPAREL_TABLE) {
      if (chest <= row.maxChest) return row.size;
    }
    return 5;
  }
}

/** Returns foot length in cm for a given US shoe size and gender */
export function getFootLengthForSize(us: number, gender: "men" | "women"): number | null {
  const table = gender === "men" ? MEN_SHOE_TABLE : WOMEN_SHOE_TABLE;
  const row = table.find((r) => r.us === us);
  return row ? row.foot : null;
}

/** Returns true if a product's sizes look like shoe sizes (> 4) */
export function isShoeProduct(sizes: number[]): boolean {
  return sizes.some((s) => s > 5);
}
