import { getMessage } from "../utils";

test('Проверка функции getMessage', () => {
    const objChar = {level: 1, attack: 25, defence: 25, health: 100};
    const mess = `\u{1F396}${objChar.level}\u{2694}${objChar.attack}\u{1F6E1}${objChar.defence}\u{2764}${objChar.health}`;
    expect(getMessage(objChar)).toBe(mess);
});