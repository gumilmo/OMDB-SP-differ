import { trace } from 'console';
import * as fs from 'fs';

class Line {

    constructor(line: string, lineIndex: number) {
        this.LineValue = line;
        this.LineIndex = lineIndex;
    }

    LineValue: string;
    LineIndex: number;
}
class ComparableDocument {

    constructor (lines: Line[] ) {
        this.Lines = lines;
    }

    Lines: Line[];
}

class ViewableLine {

    constructor(editType: string, oldLine: Line | null, newLine: Line | null) {
        this.EditType = editType;
        this.OldLine = oldLine;
        this.NewLine = newLine;
    }

    EditType: string;
    OldLine: Line | null;
    NewLine: Line | null;

    public getOldLineNumber(): string {
        if (this.OldLine?.LineIndex == null) {
            return ""
        }
        return this.OldLine.LineIndex.toString();
    }

    public getNewLineNumber(): string {
        if (this.NewLine?.LineIndex == null) {
            return ""
        }
        return this.NewLine.LineIndex.toString();
    }

    public getlineText(): string {
        if (this.NewLine == null && this.OldLine != null) {
            return this.OldLine?.LineValue;
        }
        else if (this.OldLine == null && this.NewLine != null) {
            return this.NewLine?.LineValue;
        }
        else if (this.OldLine?.LineValue == this.NewLine?.LineValue && this.OldLine?.LineValue != null) {
            return this.OldLine?.LineValue;
        }
        return "";
    }

}

class ConsolePrinter {

    public print(diff: ViewableLine[]): void {
        diff.reverse().forEach( x=> {
            this.printEdit(x);
        })
    }

    public printEdit(edit: ViewableLine) : void {
        let tag;
        let color;

        if (edit.EditType == "inserted") {
            tag = "+";
        }
        else if (edit.EditType == "deleted") {
            tag = "-";
        }
        else {
            tag = " "
        }
        if (edit.EditType == "inserted") {
            color = "\u001b[32m";
        }
        else if (edit.EditType == "deleted") {
            color = "\u001b[31m";
        }
        else {
            color = " "
        }
        const reset = "\u001b[30m"

        const oldLineNumber = edit.getOldLineNumber();
        const newLineNumber = edit.getNewLineNumber();
        const lineText = edit.getlineText();

        console.log("\u001b[30m",color,tag, "\t", oldLineNumber, "\t" , newLineNumber, "\t", lineText);
    }

}

class Differ {

    constructor(source: ComparableDocument, dest: ComparableDocument) {
        this.Source = source;
        this.Dest = dest;
    }

    Source: ComparableDocument;
    Dest: ComparableDocument;

    public getViewableLines(): ViewableLine[] {
        const viewableLines: ViewableLine[] = []

        this.backTraking().forEach( (arr, arrindex) => {

            const prevXPoint = arr[0][0];
            const prevYPoint = arr[0][1];
            const curXPoint = arr[1][0];
            const curYPoint = arr[1][1];


            const sourceLine = this.Source.Lines[prevXPoint];
            const destLine = this.Dest.Lines[prevYPoint];

            if (prevXPoint == curXPoint) {
                viewableLines.push(new ViewableLine("inserted", null, destLine));
            }
            else if ( prevYPoint == curYPoint) {
                viewableLines.push(new ViewableLine("deleted", sourceLine, null));
            }
            else {
                viewableLines.push(new ViewableLine("equals", destLine, destLine));
            }

        });

        return viewableLines;
    }

    //Ищем самый короткий путь от точки (0,0) до точки (n, m), где n - кол-во строк sourc'а, m - кол-во строк dest'а
    private findShortestTrace() : Array<number[]> {
        const sourceLength = this.Source.Lines.length;
        const destLength = this.Dest.Lines.length;

        const max = sourceLength + destLength;

        const latestXValuesArray: number[] = [];

        latestXValuesArray[1] = 0;
        let backTracking: Array<number[]> = new Array ;

        for (let depth = 0; depth <= max; depth++) {

            //сохраняем значения, для пути назад, в котором можно будет отследить изменения 
            backTracking.push(Object.assign({}, latestXValuesArray));

            //k - шаг, через d, где d - кол-во шагов по графу в глубь
            for (let k = -depth; k <= depth; k +=2) {

                let x: number, y: number;

                if (k == -depth || (k != depth && latestXValuesArray[k-1] < latestXValuesArray[k+1])) {
                    x = latestXValuesArray[k+1];
                }
                else {
                    x = latestXValuesArray[k-1] + 1;
                }

                y = x - k;

                while( x < sourceLength && y < destLength && 
                    this.Source.Lines[x].LineValue === this.Dest.Lines[y].LineValue) {
                    x++;
                    y++;
                }
                
                latestXValuesArray[k] = x

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

    private backTraking(): Array<Array<number[]>> {
        let x = this.Source.Lines.length;
        let y = this.Dest.Lines.length;

        const backTracePairsArray: Array<Array<number[]>> = [];

        const pointsInTrace = this.findShortestTrace().reverse();

        pointsInTrace.forEach( (latestXValueArray, depth) => {
            const k = x - y;
            const newIndex = pointsInTrace.length - 1 - depth;

            let prevX, prevY, prevK;

            if (k == -newIndex || (k != newIndex && latestXValueArray[k-1] < latestXValueArray[k+1])) {
                prevK = k + 1
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
                backTracePairsArray.push(new Array<number[]> ([x-1, y-1], [x,y]))
                x--;
                y--;
            }

            if (newIndex > 0) {
                backTracePairsArray.push(new Array<number[]> ([prevX, prevY], [x,y]))
            }

            x = prevX;
            y = prevY;
        } );

        return backTracePairsArray
    }

}

// fs.readFile('./test-pages/1-dst.html', (err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
// });

const source: ComparableDocument = new ComparableDocument(
    fs.readFileSync('././test-pages/source.html', 'utf-8').toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
)
const dest: ComparableDocument = new ComparableDocument(
    fs.readFileSync('././test-pages/dest.html', 'utf-8').toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
)

const test = new Differ(source, dest);
const printer = new ConsolePrinter();

printer.print(test.getViewableLines());



