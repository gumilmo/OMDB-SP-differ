class DOMElement {
    // constructor (tagName: string, textContent: string, attirbutes: string, children: DOMElement[]) {
    //     this.TagName = tagName;
    //     this.TextContetn = textContent;
    //     this.Attributes = attirbutes;
    //     this.Children = children;
    // }

    TagName :string;
    TextContetn: string;
    Attributes: string;
    Children: DOMElement[];

    static FromJson(d: Object): DOMElement {
        return Object.assign(new DOMElement, d);
    }
}

interface ElementJSON {
    tagName: string;
    textContent: string;
    attributes: [string, string][];
    children: ElementJSON[];
  }

  
const Elem = (e: Element): ElementJSON => ({
    tagName: e.tagName,
    textContent: e.textContent ?? "",
    attributes: Array.from(e.attributes, ({name, value}) => [name, value]),
    children: Array.from(e.children, Elem)
  });

  const html2json = (e: Element): string =>
  JSON.stringify(Elem(e), null, '');
  

 export class DifferDomSerivce {
    constructor (domSource: HTMLBodyElement | null, domDest: HTMLBodyElement | null) {
        this.DomSource = domSource;
        this.DomDest = domDest;
    }

    DomSource: HTMLBodyElement | null;
    DomDest: HTMLBodyElement | null;


    public convertToDom(): DOMElement[] {
        let jsonFromDest = null;
        let jsonFromSource = null;

        if (this.DomSource != null && this.DomDest != null) {
            jsonFromSource = html2json(this.DomDest);
            jsonFromDest = html2json(this.DomSource);
            const DOMDest = DOMElement.FromJson(JSON.parse(jsonFromDest));
            const DOMSource = DOMElement.FromJson(JSON.parse(jsonFromSource));

            return [DOMSource, DOMDest]
        }
        
        return [];
    }
}