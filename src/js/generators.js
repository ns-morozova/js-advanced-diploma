import Team from "./Team";

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here

  while (true) {
    let randomTypes = Math.floor(Math.random() * allowedTypes.length);
    let randomLevel = Math.floor(Math.random() * (maxLevel - 1) + 1);      
    yield new allowedTypes[randomTypes](randomLevel);
  }
}


//return Math.random() * (max - min) + min случайное число в заданном интервале

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here

  const gen = characterGenerator(allowedTypes, maxLevel);
  const members = [];
  for (let i = 0; i < characterCount; i++) {
    members.push(gen.next().value);
  }
  return members;
}




export function* cellsGenerator(count) {
  // TODO: write logic here
  while (true) {
    let random = Math.floor(Math.random() * count);      
    yield random;
  }
}
