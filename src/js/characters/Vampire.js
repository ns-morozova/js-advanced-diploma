import Character from "../Character";

export default class Vampire extends Character{
    constructor(level) {
        super(level, 'vampire');
        this.attack = 25;
        this.defence = 25;
        this.health = 10;
        this.rangeMov = 2;
        this.rangeAttack = 2;
    }
}