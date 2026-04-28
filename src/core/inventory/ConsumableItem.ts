import { Item, type ItemTier } from './Item';
import type { Entity } from '../entities/Entity';

export type ConsumableEffect = (target: Entity) => string;

export class ConsumableItem extends Item {
  private readonly _effect: ConsumableEffect;

  constructor(
    id: string,
    name: string,
    description: string,
    tier: ItemTier,
    effect: ConsumableEffect,
  ) {
    super(id, name, description, tier);
    this._effect = effect;
  }

  use(target: Entity): string {
    return this._effect(target);
  }

  getTypeLabel(): string { return 'Consumível'; }
}
