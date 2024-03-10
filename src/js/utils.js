import PointCells from "./PointCells";
import themes from "./themes";


/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  
  const numString = Math.floor(index/boardSize);
  const numColumn = index - numString*boardSize;

  if (numString == 0 && numColumn == 0) {
    return 'top-left';
  }

  if (numString == 0 && numColumn == (boardSize - 1)) {
    return 'top-right';
  }

  if (numString == 0) {
    return 'top';
  }



  if (numString == (boardSize - 1) && numColumn == 0) {
    return 'bottom-left';
  }

  if (numString == (boardSize - 1) && numColumn == (boardSize - 1)) {
    return 'bottom-right';
  }

  if (numString == (boardSize - 1)) {
    return 'bottom';
  }



  if (numColumn == 0) {
    return 'left';
  }

  if (numColumn == (boardSize - 1)) {
    return 'right';
  }

  return 'center';
}


export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function getMessage(objChar) {
  return `\u{1F396}${objChar.level}\u{2694}${objChar.attack}\u{1F6E1}${objChar.defence}\u{2764}${objChar.health}`;
}

export function getTheme(level) {
  if(level == 1) {
    return themes.prairie;
  }

  if(level == 2) {
    return themes.desert;
  }

  if(level == 3) {
    return themes.arctic;
  }

  if(level == 4) {
    return themes.mountain;
  }

}



export function getGameFieldMarkings(boardSize) {
  const arr = [];
  let count = 0;
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      arr.push(new PointCells(count, i, j));
      count++;
    }
  }
  return arr;
}