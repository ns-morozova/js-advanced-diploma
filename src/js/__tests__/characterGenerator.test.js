import { characterGenerator } from "../generators";
import Bowman from "../characters/Bowman";

test('Проверка функции characterGenerator', () => {
    const gen = characterGenerator([Bowman], 1);
    const bow = gen.next().value;
    expect(bow.level).toBe(1);
    expect(bow.type).toBe('bowman');
    
    const bow1 = gen.next().value;
    expect(bow1.level).toBe(1);
    expect(bow1.type).toBe('bowman');
});