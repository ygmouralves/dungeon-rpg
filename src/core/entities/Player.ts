import { Entity, type EntityStats } from './Entity';
import type { Skill } from '../skills/Skill';
import type { Inventory } from '../inventory/Inventory';
import type { EquipmentItem } from '../inventory/EquipmentItem';
import type { EquipmentSlot } from '../inventory/EquipmentItem';

export interface PlayerSnapshot {
  name: string;
  stats: EntityStats;
  experience: number;
  gold: number;
  floor: number;
}

export class Player extends Entity {
  private _experience: number;
  private _gold: number;
  private _floor: number;
  private readonly _skills: Skill[];
  private readonly _inventory: Inventory;
  private readonly _equipped = new Map<EquipmentSlot, EquipmentItem>();

  constructor(
    name: string,
    stats: EntityStats,
    skills: Skill[],
    inventory: Inventory,
    experience = 0,
    gold = 0,
    floor = 1,
  ) {
    super(name, stats);
    this._experience = experience;
    this._gold = gold;
    this._floor = floor;
    this._skills = skills;
    this._inventory = inventory;
  }

  get experience(): number { return this._experience; }
  get gold(): number { return this._gold; }
  get floor(): number { return this._floor; }
  get skills(): Skill[] { return [...this._skills]; }
  get inventory(): Inventory { return this._inventory; }
  get equipped(): Map<EquipmentSlot, EquipmentItem> { return this._equipped; }

  override get attack(): number {
    const equipBonus = [...this._equipped.values()]
      .reduce((sum, eq) => sum + eq.attackBonus, 0);
    return super.attack + equipBonus;
  }

  override get defense(): number {
    const equipBonus = [...this._equipped.values()]
      .reduce((sum, eq) => sum + eq.defenseBonus, 0);
    return super.defense + equipBonus;
  }

  gainExperience(amount: number): boolean {
    this._experience += amount;
    const threshold = this._stats.level * 100;
    if (this._experience >= threshold) {
      this._experience -= threshold;
      this._levelUp();
      return true;
    }
    return false;
  }

  gainGold(amount: number): void { this._gold += amount; }

  spendGold(amount: number): boolean {
    if (this._gold < amount) return false;
    this._gold -= amount;
    return true;
  }

  advanceFloor(): void { this._floor++; }

  equip(item: EquipmentItem): EquipmentItem | null {
    const previous = this._equipped.get(item.slot) ?? null;
    this._equipped.set(item.slot, item);
    return previous;
  }

  unequip(slot: EquipmentSlot): EquipmentItem | null {
    const item = this._equipped.get(slot) ?? null;
    if (item) this._equipped.delete(slot);
    return item;
  }

  fullRestore(): void {
    this._stats.hp = this._stats.maxHp;
    this._stats.mana = this._stats.maxMana;
    this._statusEffects.clear();
  }

  toSnapshot(): PlayerSnapshot {
    return {
      name: this._name,
      stats: { ...this._stats },
      experience: this._experience,
      gold: this._gold,
      floor: this._floor,
    };
  }

  describe(): string {
    const status = this.getStatusSummary();
    return (
      `${this._name} (Lv.${this._stats.level})` +
      ` | HP ${this._stats.hp}/${this._stats.maxHp}` +
      ` | MP ${this._stats.mana}/${this._stats.maxMana}` +
      ` | ${this._gold}G` +
      (status ? ` ${status}` : '')
    );
  }

  private _levelUp(): void {
    this._stats.level++;
    const hpGain = 10 + this._stats.level * 2;
    this._stats.maxHp += hpGain;
    this._stats.hp = this._stats.maxHp;
    this._stats.maxMana += 5;
    this._stats.mana = this._stats.maxMana;
    this._stats.baseAttack += 2;
    this._stats.baseDefense += 1;
  }
}
