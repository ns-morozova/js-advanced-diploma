export default class ActionsRival {
    constructor(objPos, indTarget, isAttack) {
        this.objPos = objPos;                  // объект позиции
        this.indTarget = indTarget;            // индекс перемещения/атаки компьютера
        this.isAttack = isAttack;              // признак атаки/перемещения (true - атака, false - перемещение)
    }
}