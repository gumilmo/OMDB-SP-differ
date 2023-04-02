"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Differ = void 0;
const viewable_line_model_1 = require("../models/viewable-line.model");
class Differ {
    constructor(source, dest) {
        this.Source = source;
        this.Dest = dest;
    }
    getViewableLines() {
        const viewableLines = [];
        this.backTraking().forEach((arr, arrindex) => {
            const prevXPoint = arr[0][0];
            const prevYPoint = arr[0][1];
            const curXPoint = arr[1][0];
            const curYPoint = arr[1][1];
            const sourceLine = this.Source.Lines[prevXPoint];
            const destLine = this.Dest.Lines[prevYPoint];
            // Если x из пердыдушей пары равен x из текущей, то строка удалена
            // Если y из пердыдушей пары равен y из текущей, то строка добавлена
            // Если x из пердыдушей пары не равен x из текущей, и y из пердыдушей пары не равен y из текущей то строка одинакова
            if (prevXPoint == curXPoint) {
                viewableLines.push(new viewable_line_model_1.ViewableLine("inserted", null, destLine));
            }
            else if (prevYPoint == curYPoint) {
                viewableLines.push(new viewable_line_model_1.ViewableLine("deleted", sourceLine, null));
            }
            else {
                viewableLines.push(new viewable_line_model_1.ViewableLine("equals", destLine, destLine));
            }
        });
        return viewableLines;
    }
    //Ищем самый короткий путь от точки (0,0) до точки (n, m), где n - кол-во строк sourc'а, m - кол-во строк dest'а
    findShortestTrace() {
        const sourceLength = this.Source.Lines.length;
        const destLength = this.Dest.Lines.length;
        const max = sourceLength + destLength;
        const latestXValues = [];
        latestXValues[1] = 0;
        let backTracking = new Array;
        for (let depth = 0; depth <= max; depth++) {
            //сохраняем значения, для пути назад, в котором можно будет отследить изменения 
            backTracking.push(Object.assign({}, latestXValues));
            //k - шаг, через d, где d - кол-во шагов по графу в глубь
            for (let k = -depth; k <= depth; k += 2) {
                let x, y;
                if (k == -depth || (k != depth && latestXValues[k - 1] < latestXValues[k + 1])) {
                    x = latestXValues[k + 1];
                }
                else {
                    x = latestXValues[k - 1] + 1;
                }
                y = x - k;
                while (x < sourceLength && y < destLength &&
                    this.Source.Lines[x].LineValue === this.Dest.Lines[y].LineValue) {
                    x++;
                    y++;
                }
                latestXValues[k] = x;
                if (x >= sourceLength && y >= destLength) {
                    return backTracking;
                }
            }
        }
        return [];
    }
    // Проходимся по полученному пути обратно, чтобы получить пары координат
    // с помощью которых можно будет отследить изменения в файле 
    backTraking() {
        let x = this.Source.Lines.length;
        let y = this.Dest.Lines.length;
        const backTracePairs = [];
        const pointsInTrace = this.findShortestTrace().reverse();
        pointsInTrace.forEach((latestXValueArray, depth) => {
            const k = x - y;
            const newIndex = pointsInTrace.length - 1 - depth;
            let prevX, prevY, prevK;
            if (k == -newIndex || (k != newIndex && latestXValueArray[k - 1] < latestXValueArray[k + 1])) {
                prevK = k + 1;
            }
            else {
                prevK = k - 1;
            }
            prevX = latestXValueArray[prevK];
            if (Object.keys(latestXValueArray).length == 1) {
                if (prevK == -1) {
                    prevX = 0;
                }
            }
            prevY = prevX - prevK;
            while (x > prevX && y > prevY) {
                backTracePairs.push(new Array([x - 1, y - 1], [x, y]));
                x--;
                y--;
            }
            if (newIndex > 0) {
                backTracePairs.push(new Array([prevX, prevY], [x, y]));
            }
            x = prevX;
            y = prevY;
        });
        return backTracePairs;
    }
}
exports.Differ = Differ;
//# sourceMappingURL=differ.service.js.map