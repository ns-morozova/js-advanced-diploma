import Bowman from "../characters/Bowman";
import Daemon from "../characters/Daemon";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import Undead from "../characters/Undead";
import Vampire from "../characters/Vampire";

import PositionedCharacter from "../PositionedCharacter";
import GamePlay from "../GamePlay";
import GameController from "../GameController";
import GameStateService from "../GameStateService";
import Team from "../Team";
import { getMessage, getGameFieldMarkings } from "../utils";
import cursors from "../cursors";

const bow = new Bowman(1);
const sword = new Swordsman(1);
const mag = new Magician(1);
const vamp = new Vampire(1);
const und = new Undead(1);
const dae = new Daemon(1);

const posBow = new PositionedCharacter(bow, 20);
const posSword = new PositionedCharacter(sword, 28);
const posMag = new PositionedCharacter(mag, 36);
const posVamp = new PositionedCharacter(vamp, 21);
const posUnd = new PositionedCharacter(und, 29);
const posDae = new PositionedCharacter(dae, 45);

const gamePlay = new GamePlay();
const stateService = new GameStateService();
const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.gameState.level = 1;
gameCtrl.gameState.myMove = true;
gameCtrl.pointCells = getGameFieldMarkings(gameCtrl.gamePlay.boardSize);
gameCtrl.gameState.positionedCharacters.push(posBow, posSword, posMag, posVamp, posUnd, posDae);
gameCtrl.gameState.teamPlayer = new Team([bow, sword, mag]);
gameCtrl.gameState.teamRival = new Team([vamp, und, dae]);


gameCtrl.gamePlay.selectCell = jest.fn();
gameCtrl.gamePlay.deselectCell = jest.fn();
gameCtrl.gamePlay.setCursor = jest.fn();
gameCtrl.gamePlay.hideCellTooltip = jest.fn();
gameCtrl.gamePlay.showCellTooltip = jest.fn();
gameCtrl.firstInit = jest.fn();
GamePlay.showError = jest.fn();
GamePlay.showMessage = jest.fn();


describe('Проверка GameController', () => {
    beforeEach(() => {
    });

    test('Персонаж не выбран. При наведении на игрока курсор pointer', () => {
        gameCtrl.gameState.selected = null;
        gameCtrl.setTargetCursor(posBow, 20);
        expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.pointer);
    });

    test('Персонаж выбран. При наведении на соперника в зоне атаки', () => {
        gameCtrl.gameState.selected = 20;
        gameCtrl.cellsMov = gameCtrl.getArrCellForMov(posBow);
        gameCtrl.cellsAttack = gameCtrl.getArrCellForAttack(posBow, gameCtrl.gameState.teamRival);
        gameCtrl.setTargetCursor(posVamp, 21);
        expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.crosshair);
    });

    test('Персонаж выбран. При наведении на соперника вне зоны атаки', () => {
        gameCtrl.gameState.selected = 20;
        gameCtrl.cellsMov = gameCtrl.getArrCellForMov(posBow);
        gameCtrl.cellsAttack = gameCtrl.getArrCellForAttack(posBow, gameCtrl.gameState.teamRival);
        gameCtrl.setTargetCursor(posDae, 45);
        expect(gameCtrl.gamePlay.setCursor).toHaveBeenCalledWith(cursors.notallowed);
    });

    test('Отображение статуса любого персонажа при наведении', () => {
        const { level, attack, defence, health } = posBow.character;
        const message = getMessage({ level, attack, defence, health });
        gameCtrl.onCellEnter(posBow.position);
        expect(gameCtrl.gamePlay.showCellTooltip).toHaveBeenCalledWith(message, posBow.position);
    });

    test('Персонаж выбран. При наведении на пустую клетку в зоне перемещения', () => {
        gameCtrl.gameState.selected = 20;
        gameCtrl.cellsMov = gameCtrl.getArrCellForMov(posBow);
        gameCtrl.onCellEnter(19);
        expect(gameCtrl.gamePlay.selectCell).toHaveBeenCalledWith(19, 'green');
    });

    test('Вычисление ячеек для возможной атаки', () => {
        gameCtrl.gameState.selected = 20;
        gameCtrl.gameState.myMove = true;
        const arrAttack = gameCtrl.getArrCellForAttack(posBow, gameCtrl.gameState.teamRival);
        expect(arrAttack).toEqual([21, 29]);
    });

    test('Удаление члена команды с поля', () => {
        gameCtrl.deleteChar(45, gameCtrl.gameState.teamRival);
        expect(gameCtrl.gameState.teamRival.characters).toHaveLength(2);
    });

    test('Проверка завершения игры', () => {
        gameCtrl.deleteChar(21, gameCtrl.gameState.teamRival);
        gameCtrl.deleteChar(29, gameCtrl.gameState.teamRival);
        gameCtrl.gameState.level = 4;
        gameCtrl.levelCompletionControl();  
        expect(gameCtrl.firstInit).toBeCalled();
    });

});