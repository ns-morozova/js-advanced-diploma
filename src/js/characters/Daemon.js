import Character from "../Character";

export default class Daemon extends Character{
    constructor(level) {
        super(level, 'daemon');
        this.attack = 10;
        this.defence = 10;
        this.health = 10;
        this.rangeMov = 1;
        this.rangeAttack = 4;
    }
}