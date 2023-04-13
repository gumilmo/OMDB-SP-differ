export class DOMElement {
    TagName :string;
    TextContent: string | null;
    Attributes: string[];
    AttributesValue: string[];
    WasViewed: boolean;
    Children: DOMElement[];
    ChangeFlag: number
}

export class ComparableHtml {

    constructor (styles: string | undefined, body: string, time: number) {
        this.Styles = styles;
        this.Body = body;
        this.Time = time;
    }

    public Styles: string | undefined;
    public Body: string;
    public Time: number;
}

export enum TrackedChanges {
    Added = "newelement",
    Deleted = "deletedelement",
    Changed = "changedelement"
}

export enum ChangeFlag {
    NoChanges = 0,
    Changed = 1,
    Added = 2,
    Deleted = 3
}