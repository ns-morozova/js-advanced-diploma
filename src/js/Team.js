/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor(arrChar = []) {
    this.characters = arrChar;
    this.scores = 0;
  }

  addChar(char) {
    this.characters.splice(this.characters.lenght, 0, ...char);
  }

  countingScores(level) {
    this.scores = this.scores + (10 * this.characters.length + 100 * level);
  }
}
