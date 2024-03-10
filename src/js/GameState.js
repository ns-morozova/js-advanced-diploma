export default class GameState {
  constructor() {
    this.level = 1;
    this.teamPlayer;
    this.teamRival;
    this.positionedCharacters = [];
    this.selected = null;             // индекс поля
    this.myMove = true;               // ход игрока
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}
