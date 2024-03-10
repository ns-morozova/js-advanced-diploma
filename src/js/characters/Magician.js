import Character from "../Character";

export default class Magician extends Character{
    constructor(level) {
        super(level, 'magician');
        this.attack = 10;
        this.defence = 40;
        this.health = 10;
        this.rangeMov = 1;
        this.rangeAttack = 4;
    }
}