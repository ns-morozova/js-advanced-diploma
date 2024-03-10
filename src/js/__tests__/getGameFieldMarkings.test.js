import { getGameFieldMarkings } from "../utils";

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

    pointCell = arr.find(({index}) => index == 8);
    expect(pointCell.index).toBe(8);
    expect(pointCell.row).toBe(1);
    expect(pointCell.column).toBe(0);
});