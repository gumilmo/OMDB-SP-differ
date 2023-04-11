import { ViewableLine } from "../models/file-differ.models";


export class ConsolePrinter {

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

        const oldLineNumber = edit.getOldLineNumber();
        const newLineNumber = edit.getNewLineNumber();
        const lineText = edit.getlineText();

        console.log("\u001b[30m",color, "\t", oldLineNumber, "\t" , newLineNumber, "\t", tag, '\t', lineText,"\u001b[30m");
    }

}