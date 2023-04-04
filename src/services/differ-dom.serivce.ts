class DOMElement {
    // constructor (tagName: string, textContent: string, attirbutes: string, children: DOMElement[]) {
    //     this.TagName = tagName;
    //     this.TextContetn = textContent;
    //     this.Attributes = attirbutes;
    //     this.Children = children;
    // }

    TagName :string;
    TextContent: string | null;
    Attributes: string[];
    AttributesValue: string[];
    Children: DOMElement[];
}

function FromJson(d: Object, newObject: Object): Object {
    return Object.assign(new DOMElement, d);
}

interface ElementJSON {
    tagName: string;
    textContent: string;
    attributes: [string, string][];
    children: ElementJSON[];
  }

  
const Elem = (e: Element): DOMElement => ({
    TagName: e.tagName,
    TextContent: e.textContent ?? "",
    Attributes: Array.from(e.attributes, ({name}) => name),
    AttributesValue: Array.from(e.attributes, ({value}) => value),
    Children: Array.from(e.children, Elem)
  });

  const html2json = (e: Element): string =>
  JSON.stringify(Elem(e), null, '');

  function markUpToJson(element: Element): string {
    return JSON.stringify(Elem)
  }
  

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
            const DOMDest: any = FromJson(JSON.parse(jsonFromDest), Object);
            const DOMSource: any =FromJson(JSON.parse(jsonFromSource), Object);

            const html = this.convertToHtml(DOMDest);

            const ooooooo = '';
        }
        
        return [];
    }

    //TODO ВСРАТО СДЕЛАНО, НО ТИПО РЕКУРСИЕЙ ОБРАТНО ФОРМИРОВАТЬ СТРОКИ
    public convertToHtml(domTree: DOMElement, str = ''): string {

        if (domTree.Children.length != 0) {
            domTree.Children.forEach(x => {
                let attributes = '';
                x.Attributes.forEach((attr, index) => {
                    attributes += attr + '=' + `"${x.AttributesValue[index]}" `;
                });
                if (x.Children.length != 0) {
                    x.TextContent = ''
                }
                str += `<${x.TagName.toLowerCase()} ${attributes}>${this.convertToHtml(x, str)}${x.TextContent}</${x.TagName.toLowerCase()}>`;
                ;
            })
        }

        return str;
    }
}