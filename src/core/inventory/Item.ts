export type ItemTier = 'D' | 'C' | 'B' | 'A' | 'S' | 'S+';

/** @deprecated kept only for migration path — use ItemTier instead */
export type ItemRarity = ItemTier;

export const TIER_DISPLAY: Record<ItemTier, string> = {
  'D':  'D — Comum',
  'C':  'C — Incomum',
  'B':  'B — Raro',
  'A':  'A — Épico',
  'S':  'S — Lendário',
  'S+': 'S+ — Mítico',
};

export abstract class Item {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly tier: ItemTier,
  ) {}

  /** @deprecated use tier */
  get rarity(): ItemTier { return this.tier; }

  abstract getTypeLabel(): string;

  toString(): string {
    return `[${this.tier}] ${this.name} — ${this.description}`;
  }
}
