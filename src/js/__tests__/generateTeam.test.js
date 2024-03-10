import Bowman from "../characters/Bowman";
import Magician from "../characters/Magician";
import Swordsman from "../characters/Swordsman";
import { generateTeam } from "../generators";

test('Проверка функции generateTeam', () => {
    const team = generateTeam([Bowman, Swordsman, Magician], 3, 4);
    expect(team.characters.length).toBe(4);
});