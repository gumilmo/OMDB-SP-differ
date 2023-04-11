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

    constructor (styles: string | undefined, body: string) {
        this.Styles = styles;
        this.Body = body;
    }

    public Styles: string | undefined;
    public Body: string;
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