/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    if (new.target.name == 'Character') {
      throw new Error('Нельзя создать экземпляр класса Character!');
    }

    this.level = level > 4 ? 4 : level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.rangeMov;      // диапазон перемещения
    this.rangeAttack;   // диапазон атаки

    if (this.level > 1) {
      for (let i = 2; i <= this.level; i++) {
        this.levelUp();
      }
    }


    // TODO: выбросите исключение, если кто-то использует "new Character()"
  }

  levelUp() {
    const healthBefore = this.health;
    this.level += 1;
    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }
    this.attack = Math.max(this.attack, this.attack * ((1.8 - healthBefore) / 100));
    this.defence = Math.max(this.defence, this.defence * ((1.8 - healthBefore) / 100));
  }

}
