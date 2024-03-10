import Character from "../Character";

export default class Swordsman extends Character{
    constructor(level) {
        super(level, 'swordsman');
        this.attack = 40;
        this.defence = 10;
        this.health = 10;
        this.rangeMov = 4;
        this.rangeAttack = 1;
    }
}