import { characterGenerator, generateTeam } from "../generators";
import Bowman from "../characters/Bowman";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";

describe('Проверка модуля generators', () => {

    test('Проверка функции characterGenerator', () => {
        const gen = characterGenerator([Bowman], 1);
        const bow = gen.next().value;
        expect(bow.level).toBe(1);
        expect(bow.type).toBe('bowman');

        const bow1 = gen.next().value;
        expect(bow1.level).toBe(1);
        expect(bow1.type).toBe('bowman');
    });

    test('Проверка функции generateTeam', () => {
        const arrTeam = generateTeam([Bowman, Swordsman, Magician], 3, 4);
        expect(arrTeam.length).toBe(4);
    });

})

