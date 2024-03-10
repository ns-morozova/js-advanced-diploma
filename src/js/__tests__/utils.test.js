import { calcTileType } from "../utils";

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
