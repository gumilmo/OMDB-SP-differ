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

    public diff(): ViewableLine[] {
        const diff: ViewableLine[] = []

        this.backTraking().forEach( (arr, arrindex) => {

            const prevX = arr[0][0];
            const prevY = arr[0][1];
            const x = arr[1][0];
            const y = arr[1][1];


            const sourceLine = this.Source.Lines[prevX];
            const destLine = this.Dest.Lines[prevY];

            if (prevX == x) {
                diff.push(new ViewableLine("inserted", null, destLine));
            }
            else if ( prevY == y) {
                diff.push(new ViewableLine("deleted", sourceLine, null));
            }
            else {
                diff.push(new ViewableLine("equals", destLine, destLine));
            }

        });

        return diff;
    }

    private shortestEdit() : Array<number[]> {
        const n = this.Source.Lines.length;
        const m = this.Dest.Lines.length;

        const max = n + m;

        const v: number[] = [];

        v[1] = 0;
        let backTracking: Array<number[]> = new Array ;

        for (let d = 0; d <= max; d++) {

            backTracking.push(Object.assign({}, v));

            for (let k = -d; k <= d; k +=2) {

                let x: number, y: number;

                if (k === -d || (k !== d && v[k-1] < v[k+1])) {
                    x = v[k+1];
                }
                else {
                    x = v[k-1] + 1;
                }

                y = x - k;

                while( x < n && y < m && this.Source.Lines[x].LineValue === this.Dest.Lines[y].LineValue) {
                    x++;
                    y++;
                }
                
                v[k] = x

                if (x >= n && y >= m) {
                    return backTracking;
                }
            }
        }

        return [];
    }

    private backTraking(): Array<Array<number[]>> {
        let x = this.Source.Lines.length;
        let y = this.Dest.Lines.length;

        const backTracePairsArray: Array<Array<number[]>> = [];

        this.shortestEdit().reverse().forEach( (v, d) => {
            const vArray = Object.values(v);
            const k = x - y;

            let prevX, prevY, prevK;

            if (k == -d || (k != d && vArray[k-1] < vArray[k+1])) {
                prevK = k + 1
            }
            else {
                prevK = k - 1;
            }

            prevX = vArray[prevK];

            if (Object.keys(v).length == 1) {
                if (prevK == -1) {
                    prevX = 0;
                }
            }

            prevY = prevX - prevK;

            while (x > prevX && y > prevY) {
                if (prevX != undefined || prevY != undefined) {
                    backTracePairsArray.push(new Array<number[]> ([x-1, y-1], [x,y]))
                }
                x--;
                y--;
            }

            if (d > 0) {
                backTracePairsArray.push(new Array<number[]> ([prevX, prevY], [x,y]))
            }

            x = prevX;
            y = prevY;
        } );

        backTracePairsArray.pop()
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

printer.print(test.diff());



