import themes from "./themes";
import { generateTeam } from "./generators";
import { cellsGenerator } from "./generators";
import PositionedCharacter from "./PositionedCharacter";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import { getMessage, getTheme, getGameFieldMarkings } from "./utils";
import cursors from "./cursors";
import ActionsRival from "./ActionsRival";
import Team from "./Team";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.pointCells;
    this.cellsMov = [];               // допустимые ячейки для передвижения
    this.cellsAttack = [];            // допустимые ячейки для атаки
  }

  firstInit() {
    this.gameState.level = 1;
    this.gameState.myMove = true;
    this.gameState.selected = null;
    this.gamePlay.drawUi(themes.prairie);
    this.pointCells = getGameFieldMarkings(this.gamePlay.boardSize);
    this.gameState.positionedCharacters = [];

    this.gameState.teamPlayer = new Team(generateTeam([Bowman, Swordsman, Magician], this.gameState.level, 4));
    this.gameState.teamRival = new Team (generateTeam([Vampire, Undead, Daemon], this.gameState.level, 4));

    this.initialPositionChar(this.getInitialCellsPlayers(), this.gameState.teamPlayer);
    this.initialPositionChar(this.getInitialCellsRiv(), this.gameState.teamRival);

    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.firstInit();
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
  }

  initialPositionChar(arr, team) {
    for (let player of team.characters) {
      let cellIndex = cellsGenerator(arr.length).next().value;
      this.gameState.positionedCharacters.push(new PositionedCharacter(player, arr[cellIndex]));
      arr.splice(cellIndex, 1);
    }

  }

  getInitialCellsPlayers() {
    return [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
  }

  getInitialCellsRiv() {
    return [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
  }


  getArrCellForAttack(objPos, teamAttack) {                  // teamAttack - команда, которую атакуют

    const allIndex = [];

    const maxStep = objPos.character.rangeAttack;
    let pointCell = this.pointCells.find(({ index }) => index == this.gameState.selected);
    const initPoint = [Math.max(pointCell.row - maxStep, 0), Math.max(pointCell.column - maxStep, 0)];   //в массиве x,y координаты
    const endPoint = [Math.min(pointCell.row + maxStep, this.gamePlay.boardSize - 1), Math.min(pointCell.column + maxStep, this.gamePlay.boardSize - 1)];  //в массиве x,y координаты
    // let str = `initPoint=${initPoint}, endPoint=${endPoint}`;
    //alert(str);

    const startX = initPoint[0];
    const endX = endPoint[0];
    const startY = initPoint[1];
    const endY = endPoint[1];

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        pointCell = this.pointCells.find(({ row, column }) => (row == i) && (column == j));
        if (pointCell) {
          allIndex.push(pointCell.index);
        }
      }
    }

    const allIndAttack = [];

    for (let pos of this.gameState.positionedCharacters) {
      let typeChar = pos.character.type;
      if (teamAttack.characters.find(({ type }) => type == typeChar)) {
        if (allIndex.includes(pos.position)) {
          allIndAttack.push(pos.position);
        }
      }

    }
    return allIndAttack;
  }


  getArrCellForMov(objPos) {

    const allIndex = [];

    const maxStep = objPos.character.rangeMov;
    let pointCell = this.pointCells.find(({ index }) => index == this.gameState.selected);
    const initPoint = [Math.max(pointCell.row - maxStep, 0), Math.max(pointCell.column - maxStep, 0)];//в массиве x,y координаты
    const endPoint = [Math.min(pointCell.row + maxStep, this.gamePlay.boardSize - 1), Math.min(pointCell.column + maxStep, this.gamePlay.boardSize - 1)];//в массиве x,y координаты

    const startX = initPoint[0];
    const endX = endPoint[0];
    const startY = initPoint[1];
    const endY = endPoint[1];

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        pointCell = this.pointCells.find(({ row, column }) => (row == i) && (column == j));
        if (pointCell) {
          allIndex.push(pointCell.index);
        }
      }
    }

    for (let pos of this.gameState.positionedCharacters) {
      let ind = allIndex.find((index) => index == pos.position);
      if (ind) {
        allIndex.splice(allIndex.indexOf(ind, 0), 1);
      }
    }
    return allIndex;
  }



  setTargetCursor(objPos, index) {
    let isCharPlayer = false;
    let isCharRiv = false;

    if (objPos) {
      isCharPlayer = this.gameState.teamPlayer.characters.find(({ type }) => type == objPos.character.type) !== undefined;
      isCharRiv = this.gameState.teamRival.characters.find(({ type }) => type == objPos.character.type) !== undefined;

    }

    if (objPos && this.gameState.selected !== objPos.position && isCharPlayer) {   // навели курсор на невыбранном игроке
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    if (this.gameState.selected === null) {
      this.gamePlay.setCursor(cursors.auto);
      return;
    }

    // определяем, что курсор на свободной клетке, куда можно переместиться
    if (!(this.cellsMov.find((elem) => elem == index) === undefined)) {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor(cursors.pointer);
      return;
    }

    // при наведении на соперника
    if (isCharRiv) {

      if (!(this.cellsAttack.find((ind) => ind == index) === undefined)) {
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor(cursors.crosshair);
        return;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
        return;
      }
    }
    this.gamePlay.setCursor(cursors.auto);
  }


  randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }


  execRivActions() {                         // выполнение ходов соперника
    if (this.gameState.teamRival.characters.length === 0) {
      return;
    }

    const actions = [];
    const rivs = [];

    for (let pos of this.gameState.positionedCharacters) {
      if (this.gameState.teamRival.characters.find(({ type }) => type == pos.character.type)) {
        rivs.push(pos);
      }
    }

    for (let rivPos of rivs) {
      let indMove = this.getArrCellForMov(rivPos);
      for (let ind of indMove) {
        actions.push(new ActionsRival(rivPos, ind, false));
      }

      let indAttack = this.getArrCellForAttack(rivPos, this.gameState.teamPlayer);
      for (let ind of indAttack) {
        actions.push(new ActionsRival(rivPos, ind, true));
      }

    }

    const indAct = this.randomInteger(0, actions.length - 1);
    const actRiv = actions[indAct];
    const selRivPos = actRiv.objPos;

    if (actRiv.isAttack) {
      const attacker = selRivPos.character;
      const pos = this.gameState.positionedCharacters.find(({ position }) => position == actRiv.indTarget);
      const target = pos.character;
      const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
      const promise = this.gamePlay.showDamage(actRiv.indTarget, damage);
      promise.then((response) => {
        target.health = Math.max(target.health - damage, 0);
        if (target.health == 0) {
          this.deleteChar(pos.position, this.gameState.teamPlayer);
        }
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        if (this.gameState.teamPlayer.length == 0) {
          this.levelCompletionControl();
          return;
        }

        if (!(this.gameState.selected === null)) {
          this.gamePlay.deselectCell(this.gameState.selected);
          this.gameState.selected = null;
        }
        this.gameState.myMove = true;
      });
    } else {
      selRivPos.position = actRiv.indTarget;
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

      if (!(this.gameState.selected === null)) {
        this.gamePlay.deselectCell(this.gameState.selected);
        this.gameState.selected = null;
      }
      this.gameState.myMove = true;
    }

  }


  deleteChar(index, team) {
    const pos = this.gameState.positionedCharacters.find(({ position }) => position == index);
    const char = team.characters.find((elem) => elem == pos.character);
    team.characters.splice(team.characters.indexOf(char), 1);
    this.gameState.positionedCharacters.splice(this.gameState.positionedCharacters.indexOf(pos), 1);
  }


  levelCompletionControl() {
    let team = undefined;       // команда победителя
    if (this.gameState.teamPlayer.characters.length == 0) {
      team = this.gameState.teamRival;
    } else if (this.gameState.teamRival.characters.length == 0) {
      team = this.gameState.teamPlayer;
    }
    if (team === undefined) {
      return;
    }
    if (this.gameState.level === 4) {
      GamePlay.showMessage(`Игра закончена. Ваш счет: ${this.gameState.teamPlayer.scores}. Счет соперника: ${this.gameState.teamRival.scores}`);
      this.firstInit();
      return;
    }
    team.characters.forEach((elem) => {
      elem.level++;
      elem.levelUp();
    });
    team.countingScores(this.gameState.level);
    this.gameState.level++;
    this.gameState.positionedCharacters = [];
    this.gameState.myMove = true;
    this.gameState.selected = null;


    this.gamePlay.drawUi(getTheme(this.gameState.level));
    const teamPlayer = generateTeam([Bowman, Swordsman, Magician], this.gameState.level, 4 - this.gameState.teamPlayer.characters.length);
    this.gameState.teamPlayer.characters.splice(this.gameState.teamPlayer.characters.length, 0, ...teamPlayer);
    const teamRival = generateTeam([Vampire, Undead, Daemon], this.gameState.level, 4 - this.gameState.teamRival.characters.length);
    this.gameState.teamRival.characters.splice(this.gameState.teamRival.characters.length, 0, ...teamRival);
    
    this.initialPositionChar(this.getInitialCellsPlayers(), this.gameState.teamPlayer);
    this.initialPositionChar(this.getInitialCellsRiv(), this.gameState.teamRival);

    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }


  onCellClick(index) {
    // TODO: react to click
    if (!this.gameState.myMove) {
      return;
    }

    if (this.gameState.selected === index) {
      return;
    }

    const pos = this.gameState.positionedCharacters.find((elem) => elem.position === index);

    if (pos) {
      const char = this.gameState.teamPlayer.characters.find(({ type }) => type == pos.character.type);

      if (char) {
        if (this.gameState.selected !== null) {
          this.gamePlay.deselectCell(this.gameState.selected);
        }
        this.gamePlay.selectCell(index);
        this.gameState.selected = index;
        this.gamePlay.setCursor(cursors.auto);
        this.cellsMov = this.getArrCellForMov(pos);
        this.cellsAttack = this.getArrCellForAttack(pos, this.gameState.teamRival);
        return;

      } else {
        if (this.gameState.selected === null) {
          GamePlay.showError('Выберите игрока своей команды!');
        } else {
          if (!(this.cellsAttack.find((ind) => ind == index) === undefined)) {
            const selPlPos = this.gameState.positionedCharacters.find(({ position }) => position == this.gameState.selected);
            const attacker = selPlPos.character;
            const target = pos.character;
            const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
            const promise = this.gamePlay.showDamage(index, damage);
            promise.then(() => {
              target.health = Math.max(target.health - damage, 0);

              if (target.health == 0) {
                this.deleteChar(pos.position, this.gameState.teamRival);
              }
              this.gamePlay.redrawPositions(this.gameState.positionedCharacters);

              if (this.gameState.teamRival.characters.length == 0) {
                this.levelCompletionControl();
                return;
              }

              this.gameState.myMove = false;
              if (!this.gameState.myMove) {
                setTimeout(() => {
                  this.execRivActions();
                }, 1000);
              }
              
            });


          }

        }
      }

    } else {   // клик в свободную клетку
      
      if (this.gameState.selected === null) {
        return;
      }    
      
      if (!(this.cellsMov.find((ind) => ind == index) === undefined)) {
        const posPl = this.gameState.positionedCharacters.find(({ position }) => position == this.gameState.selected);  // экземпляр позиции игрока
        posPl.position = index;
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.gamePlay.deselectCell(this.gameState.selected);
        this.gamePlay.selectCell(posPl.position);
        this.gameState.selected = posPl.position;
        this.gamePlay.setCursor(cursors.auto);
        this.cellsMov = this.getArrCellForMov(posPl);
        this.cellsAttack = this.getArrCellForAttack(posPl, this.gameState.teamRival);
        this.gameState.myMove = false;
        if (!this.gameState.myMove) {
          setTimeout(() => {
            this.execRivActions();
          }, 1000);
        }

      }
    }
  }


  onCellEnter(index) {
    // TODO: react to mouse enter

    if (!this.gameState.myMove) {
      return;
    }

    const pos = this.gameState.positionedCharacters.find((elem) => elem.position === index);

    if (pos) {
      const { level, attack, defence, health } = pos.character;
      const message = getMessage({ level, attack, defence, health });
      this.gamePlay.showCellTooltip(message, index);
    }

    this.setTargetCursor(pos, index);
  }


  onCellLeave(index) {
    // TODO: react to mouse leave

    const pos = this.gameState.positionedCharacters.find(({ position }) => position == index);

    if (!pos) {
      this.gamePlay.hideCellTooltip(index);
    }

    if (!(this.cellsMov.find((elem) => elem == index) === undefined)) {
      this.gamePlay.deselectCell(index);
      return;
    }

    if (!(this.cellsAttack.find((elem) => elem == index) === undefined)) {
      this.gamePlay.deselectCell(index);
      return;
    }

  }


  onNewGameClick() {
    //this.init();
    this.firstInit();
  }


  onSaveClick() {
    this.stateService.save(this.gameState);
    GamePlay.showMessage('Игра сохранена');

  }




  onLoadClick() {
    GamePlay.showMessage('Игра загружается');
    const load = this.stateService.load();
    if (!load) {
      GamePlay.showError('Ошибка загрузки');
    }
    this.gameState.level = load.level;
    this.gameState.selected = load.selected;             // индекс поля
    this.gameState.myMove = load.myMove;               // ход игрока
    this.gameState.positionedCharacters = [];
    this.cellsMov = [];               // допустимые ячейки для передвижения
    this.cellsAttack = [];            // допустимые ячейки для атаки

    this.pointCells = getGameFieldMarkings(this.gamePlay.boardSize);  // координаты
    this.gameState.teamPlayer = new Team();
    this.gameState.teamPlayer.scores = load.teamPlayer.scores;
    this.gameState.teamRival = new Team();
    this.gameState.teamRival.scores = load.teamRival.scores;

    load.positionedCharacters.forEach((elem) => {
      let char;
      switch (elem.character.type) {
        case 'swordsman':
          char = new Swordsman(elem.character.level);
          this.gameState.teamPlayer.addChar([char]);
          break;
        case 'bowman':
          char = new Bowman(elem.character.level);
          this.gameState.teamPlayer.addChar([char]);
          break;
        case 'magician':
          char = new Magician(elem.character.level);
          this.gameState.teamPlayer.addChar([char]);
          break;
        case 'undead':
          char = new Undead(elem.character.level);
          this.gameState.teamRival.addChar([char]);
          break;
        case 'vampire':
          char = new Vampire(elem.character.level);
          this.gameState.teamRival.addChar([char]);
          break;
        case 'daemon':
          char = new Daemon(elem.character.level);
          this.gameState.teamRival.addChar([char]);
          break;
        // no default
      }
      char.health = elem.character.health;
      this.gameState.positionedCharacters.push(new PositionedCharacter(char, elem.position));
    });
    this.gamePlay.drawUi(getTheme(this.gameState.level));
    this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  }

}
