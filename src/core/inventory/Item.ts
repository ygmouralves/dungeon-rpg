export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC';

export const RARITY_COLORS: Record<ItemRarity, string> = {
  COMMON: 'white',
  UNCOMMON: 'green',
  RARE: 'blue',
  EPIC: 'magenta',
};

export abstract class Item {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly rarity: ItemRarity,
  ) {}

  abstract getTypeLabel(): string;

  toString(): string {
    return `[${this.rarity}] ${this.name} — ${this.description}`;
  }
}
