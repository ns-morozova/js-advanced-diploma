import Bowman from "../characters/Bowman";

test('Проверка класса Bowman', () => {
  const bow = new Bowman(3);
  expect(bow.level).toBe(3);

  const bow2 = new Bowman(10);
  expect(bow2.level).toBe(4);
});