"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class Line {
    constructor(line, lineIndex) {
        this.LineValue = line;
        this.LineIndex = lineIndex;
    }
}
class ComparableDocument {
    constructor(lines) {
        this.Lines = lines;
    }
}
class ViewableLine {
    constructor(editType, oldLine, newLine) {
        this.EditType = editType;
        this.OldLine = oldLine;
        this.NewLine = newLine;
    }
    getOldLineNumber() {
        var _a;
        if (((_a = this.OldLine) === null || _a === void 0 ? void 0 : _a.LineIndex) == null) {
            return "";
        }
        return this.OldLine.LineIndex.toString();
    }
    getNewLineNumber() {
        var _a;
        if (((_a = this.NewLine) === null || _a === void 0 ? void 0 : _a.LineIndex) == null) {
            return "";
        }
        return this.NewLine.LineIndex.toString();
    }
    getlineText() {
        var _a, _b, _c, _d, _e, _f;
        if (this.NewLine == null && this.OldLine != null) {
            return (_a = this.OldLine) === null || _a === void 0 ? void 0 : _a.LineValue;
        }
        else if (this.OldLine == null && this.NewLine != null) {
            return (_b = this.NewLine) === null || _b === void 0 ? void 0 : _b.LineValue;
        }
        else if (((_c = this.OldLine) === null || _c === void 0 ? void 0 : _c.LineValue) == ((_d = this.NewLine) === null || _d === void 0 ? void 0 : _d.LineValue) && ((_e = this.OldLine) === null || _e === void 0 ? void 0 : _e.LineValue) != null) {
            return (_f = this.OldLine) === null || _f === void 0 ? void 0 : _f.LineValue;
        }
        return "";
    }
}
class ConsolePrinter {
    print(diff) {
        diff.reverse().forEach(x => {
            this.printEdit(x);
        });
    }
    printEdit(edit) {
        let tag;
        let color;
        if (edit.EditType == "inserted") {
            tag = "+";
        }
        else if (edit.EditType == "deleted") {
            tag = "-";
        }
        else {
            tag = " ";
        }
        if (edit.EditType == "inserted") {
            color = "\u001b[32m";
        }
        else if (edit.EditType == "deleted") {
            color = "\u001b[31m";
        }
        else {
            color = " ";
        }
        const reset = "\u001b[30m";
        const oldLineNumber = edit.getOldLineNumber();
        const newLineNumber = edit.getNewLineNumber();
        const lineText = edit.getlineText();
        console.log("\u001b[30m", color, tag, "\t", oldLineNumber, "\t", newLineNumber, "\t", lineText);
    }
}
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
            if (prevXPoint == curXPoint) {
                viewableLines.push(new ViewableLine("inserted", null, destLine));
            }
            else if (prevYPoint == curYPoint) {
                viewableLines.push(new ViewableLine("deleted", sourceLine, null));
            }
            else {
                viewableLines.push(new ViewableLine("equals", destLine, destLine));
            }
        });
        return viewableLines;
    }
    //Ищем самый короткий путь от точки (0,0) до точки (n, m), где n - кол-во строк sourc'а, m - кол-во строк dest'а
    findShortestTrace() {
        const sourceLength = this.Source.Lines.length;
        const destLength = this.Dest.Lines.length;
        const max = sourceLength + destLength;
        const latestXValuesArray = [];
        latestXValuesArray[1] = 0;
        let backTracking = new Array;
        for (let depth = 0; depth <= max; depth++) {
            //сохраняем значения, для пути назад, в котором можно будет отследить изменения 
            backTracking.push(Object.assign({}, latestXValuesArray));
            //k - шаг, через d, где d - кол-во шагов по графу в глубь
            for (let k = -depth; k <= depth; k += 2) {
                let x, y;
                if (k == -depth || (k != depth && latestXValuesArray[k - 1] < latestXValuesArray[k + 1])) {
                    x = latestXValuesArray[k + 1];
                }
                else {
                    x = latestXValuesArray[k - 1] + 1;
                }
                y = x - k;
                while (x < sourceLength && y < destLength &&
                    this.Source.Lines[x].LineValue === this.Dest.Lines[y].LineValue) {
                    x++;
                    y++;
                }
                latestXValuesArray[k] = x;
                if (x >= sourceLength && y >= destLength) {
                    return backTracking;
                }
            }
        }
        return [];
    }
    // Проходимся по полученному пути обратно, чтобы получить пары координат
    // с помощью которых можно будет отследить изменения в файле 
    // Если x из пердыдушей пары не равен x из текущей, то строка удалена
    // Если y из пердыдушей пары не равен y из текущей, то строка добавлена
    // Если x из пердыдушей пары равен x из текущей, то строка одинакова
    backTraking() {
        let x = this.Source.Lines.length;
        let y = this.Dest.Lines.length;
        const backTracePairsArray = [];
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
                backTracePairsArray.push(new Array([x - 1, y - 1], [x, y]));
                x--;
                y--;
            }
            if (newIndex > 0) {
                backTracePairsArray.push(new Array([prevX, prevY], [x, y]));
            }
            x = prevX;
            y = prevY;
        });
        return backTracePairsArray;
    }
}
// fs.readFile('./test-pages/1-dst.html', (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
// });
const source = new ComparableDocument(fs.readFileSync('././test-pages/source.html', 'utf-8').toString().split('\n').map((line, index) => new Line(line.replace('\r', ''), index + 1)));
const dest = new ComparableDocument(fs.readFileSync('././test-pages/dest.html', 'utf-8').toString().split('\n').map((line, index) => new Line(line.replace('\r', ''), index + 1)));
const test = new Differ(source, dest);
const printer = new ConsolePrinter();
printer.print(test.getViewableLines());
//# sourceMappingURL=main.js.map