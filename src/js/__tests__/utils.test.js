import { calcTileType, getGameFieldMarkings, getMessage, calcHealthLevel, getTheme} from "../utils";
import themes from "../themes";

describe('Проверка модуля utils', () => {
  test('Проверка отрисовки по функции calcTileType', () => {
    expect(calcTileType(0, 7)).toBe('top-left');
    expect(calcTileType(6, 7)).toBe('top-right');
    expect(calcTileType(3, 7)).toBe('top');
    expect(calcTileType(42, 7)).toBe('bottom-left');
    expect(calcTileType(48, 7)).toBe('bottom-right');
    expect(calcTileType(45, 7)).toBe('bottom');
    expect(calcTileType(41, 7)).toBe('right');
    expect(calcTileType(7, 7)).toBe('left');
    expect(calcTileType(8, 7)).toBe('center');
  });

  test('Проверка функции getGameFieldMarkings', () => {
    const arr = getGameFieldMarkings(8);
    expect(arr.length).toBe(64);
    let pointCell = arr[0];
    expect(pointCell.index).toBe(0);
    expect(pointCell.row).toBe(0);
    expect(pointCell.column).toBe(0);

    pointCell = arr[1];
    expect(pointCell.index).toBe(1);
    expect(pointCell.row).toBe(0);
    expect(pointCell.column).toBe(1);

    pointCell = arr.find(({ index }) => index == 8);
    expect(pointCell.index).toBe(8);
    expect(pointCell.row).toBe(1);
    expect(pointCell.column).toBe(0);
  });

  test('Проверка функции getMessage', () => {
    const objChar = { level: 1, attack: 25, defence: 25, health: 100 };
    const mess = `\u{1F396}${objChar.level}\u{2694}${objChar.attack}\u{1F6E1}${objChar.defence}\u{2764}${objChar.health}`;
    expect(getMessage(objChar)).toBe(mess);
  });

  test('Проверка функции calcHealthLevel', () => {
    expect(calcHealthLevel(100)).toBe('high');
    expect(calcHealthLevel(40)).toBe('normal');
    expect(calcHealthLevel(5)).toBe('critical');
  });

  test('Проверка функции getTheme', () => {
    expect(getTheme(1)).toBe(themes.prairie);
    expect(getTheme(2)).toBe(themes.desert);
    expect(getTheme(3)).toBe(themes.arctic);
    expect(getTheme(4)).toBe(themes.mountain);
  });


})


