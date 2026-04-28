import { Item, type ItemRarity } from './Item';
import type { Entity } from '../entities/Entity';

export type ConsumableEffect = (target: Entity) => string;

export class ConsumableItem extends Item {
  private readonly _effect: ConsumableEffect;

  constructor(
    id: string,
    name: string,
    description: string,
    rarity: ItemRarity,
    effect: ConsumableEffect,
  ) {
    super(id, name, description, rarity);
    this._effect = effect;
  }

  use(target: Entity): string {
    return this._effect(target);
  }

  getTypeLabel(): string { return 'Consumível'; }
}
