import { Line } from "./line.model";

export class ComparableDocument {

    constructor (lines: Line[] ) {
        this.Lines = lines;
    }

    Lines: Line[];
}