export class Line {

    constructor(line: string, lineIndex: number) {
        this.LineValue = line;
        this.LineIndex = lineIndex;
    }

    LineValue: string;
    LineIndex: number;
}

export class ViewableLine {

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

    public getLineColor(): string {
        return this.EditType === "deleted" ? "deleted" : this.EditType === "inserted" ? "added" : "equals"
    }

}

export class ComparableDocument {

    constructor (lines: Line[] ) {
        this.Lines = lines;
    }

    Lines: Line[];
}