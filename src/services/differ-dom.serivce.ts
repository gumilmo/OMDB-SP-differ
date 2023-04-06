class DOMElement {
    TagName :string;
    TextContent: string | null;
    Attributes: string[];
    AttributesValue: string[];
    TrueAttr: string[][];
    WasViewed: boolean;
    Children: DOMElement[];
}

function FromJson(d: Object, newObject: Object): Object {
    return Object.assign(new DOMElement, d);
}
  
const Elem = (e: Element): DOMElement => ({
    TagName: e.tagName,
    TextContent: e.textContent ?? "",
    Attributes: e.getAttributeNames(),
    AttributesValue: Array.from(e.attributes, ({value}) => value),
    TrueAttr: Array.from(e.attributes, ({name, value}) => [name, value]),
    WasViewed: false,
    Children: Array.from(e.children, Elem),
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


    public DOMHandler(): string {
        let jsonFromDest = null;
        let jsonFromSource = null;

        if (this.DomSource != null && this.DomDest != null) {
            jsonFromSource = html2json(this.DomSource);
            jsonFromDest = html2json(this.DomDest);
            
            const DOMSource: any =FromJson(JSON.parse(jsonFromSource), Object);
            const DOMDest: any = FromJson(JSON.parse(jsonFromDest), Object);

            compareDOM(DOMSource, DOMDest);

            return convertToHtml(DOMDest)
        }
        
        return '';
    }

    private compareDOM(source: any, dest: any, finalDom: any) {
        
    }
}

function compareDOM(source: DOMElement, dest: DOMElement) {
    goDeepCompare(source, dest);

    function goDeepCompare(source: DOMElement, dest: DOMElement) {
        if (source != undefined)
        dest.Children.forEach( (child, index) => {
            if (child.Children.length !== 0) {
                goDeepCompare(source.Children[index], child)
            }
            else {
                const sourceElem = source.Children[index];
                const destElem = child;
                if (sourceElem == undefined) {
                    destElem.WasViewed = true;
                    destElem.Attributes.push("style");
                    destElem.AttributesValue.push("background-color: green");
                }
                else {
                    if (destElem.TagName == sourceElem.TagName) {
                        if (sourceElem.TextContent != destElem.TextContent) {
                            dest.WasViewed = true;
                            source.WasViewed = true;
                            destElem.WasViewed = true;
                            sourceElem.WasViewed = true;
                            destElem.Attributes.push("class");
                            destElem.Attributes.push("style");
                            destElem.Attributes.push("oldValue");
                            destElem.AttributesValue.push("changedValue");
                            destElem.AttributesValue.push(`background-image: linear-gradient(45deg, #e6c231 25%, #dbdbdb 25%, #dbdbdb 50%, #e6c231 50%, #e6c231 75%, #dbdbdb 75%, #dbdbdb 100%); background-size: 56.57px 56.57px;`);
                            destElem.AttributesValue.push(`${sourceElem.TextContent}`);
                        }
                    }
                    else {
                        source.WasViewed = true;
                        sourceElem.WasViewed = true;
                        sourceElem.Attributes.push("style");
                        sourceElem.AttributesValue.push(`background-image: linear-gradient(45deg, #f04848 25%, #faf2eb 25%, #faf2eb 50%, #f04848 50%, #f04848 75%, #faf2eb 75%, #faf2eb 100%); background-size: 56.57px 56.57px`);
                        dest.Children.unshift(sourceElem);
                        dest.WasViewed = true;
                        destElem.WasViewed = true;
                        destElem.Attributes.push("style");
                        destElem.AttributesValue.push(`background-image: linear-gradient(45deg, #97f797 25%, #c3fab9 25%, #c3fab9 50%, #97f797 50%, #97f797 75%, #c3fab9 75%, #c3fab9 100%); background-size: 56.57px 56.57px;`);
                    }
                }
            }
            if (dest.Children.length != source.Children.length) {
                if (dest.Children.length > source.Children.length) {
                    dest.Children.forEach( (destChild, index) => {
                        if (source.Children[index] === undefined) {
                            destChild.WasViewed = true;
                            destChild.Attributes.push("style");
                            destChild.AttributesValue.push("background-color: green");
                        }
                    });
                }
                else {
                    source.Children.forEach( (sourceChild, index) => {
                        if (dest.Children[index] === undefined) {
                            sourceChild.WasViewed = true;
                            sourceChild.Attributes.push("style");
                            sourceChild.AttributesValue.push("background-color: red");
                            dest.Children.push(sourceChild);
                        }
                    });
                }
            }
        });
    }
}


const convertToHtml = (domTree: DOMElement, str = ''): string => {
    let result = str;
    if (domTree.Children.length !== 0) {
        domTree.Children.forEach((child) => {
            let attributes = '';
            child.Attributes.forEach((attr, index) => {
                let equalsSign = '='
                const attrValue = child.AttributesValue[index].replace('"','');
                if (child.AttributesValue[index].includes('<') || child.AttributesValue[index].includes('>')) {
                    child.AttributesValue[index] = '';
                }
                if (child.AttributesValue[index] === ' ' || child.AttributesValue[index] ==='')
                    equalsSign = ''
                attributes += attr.replace(`"`, '') + `${equalsSign}` + `"${child.AttributesValue[index].replace('=', '')}" `;
            });
            if (child.Children.length !== 0) {
                child.TextContent = '';
            }

            result += `<${child.TagName.toLowerCase()} ${attributes} >${convertToHtml(
                child,
                str,
            )}${child.TextContent}</${child.TagName.toLowerCase()}>`;
        });
    }

    return result;
};