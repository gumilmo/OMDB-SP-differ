import { DOMElement, TrackedChanges } from "../../models/dom-element.model";

export class DifferDomSerivce {
    constructor (domSource: HTMLBodyElement | null, domDest: HTMLBodyElement | null) {
        this.DomSource = domSource;
        this.DomDest = domDest;
    }

    DomSource: HTMLBodyElement | null;
    DomDest: HTMLBodyElement | null;

    private static addedStyle: string = 'cursor: pointer; border: 4px solid green; padding: 10px';
    private static deletedStyle: string = 'cursor: pointer; border: 4px solid red; padding: 10px';
    private static changedStyle: string = 'cursor: pointer; border: 4px solid orange; padding: 10px';


    public DOMHandler(): string {
        let jsonFromDest =  null;
        let jsonFromSource = null;

        if (this.DomSource != null && this.DomDest != null) {
            jsonFromSource = this.markUpToJson(this.DomSource);
            jsonFromDest = this.markUpToJson(this.DomDest);
            
            const DOMSource: any = this.buildDOMElement(JSON.parse(jsonFromSource));
            const DOMDest: any = this.buildDOMElement(JSON.parse(jsonFromDest));

            this.deepCompare(DOMSource, DOMDest);

            return this.convertToHtml(DOMDest)
        }
        
        return '';
    }

    private markUpToJson = (e: Element): string =>
    JSON.stringify(this.ElementToDOMElement(e), null, '');

    private ElementToDOMElement = (element: Element): DOMElement => ({
        TagName: element.tagName,
        TextContent: element.textContent ?? "",
        Attributes: element.getAttributeNames(),
        AttributesValue: Array.from(element.attributes, ({value}) => value),
        WasViewed: false,
        Children: Array.from(element.children, this.ElementToDOMElement),
    });

    private buildDOMElement(d: Object): Object {
        return Object.assign(new DOMElement, d);
    }

    private deepCompare(source: DOMElement, dest: DOMElement): void {
        if (source == undefined) return;
        dest.Children.forEach( (child, index) => {
            if (child.Children.length !== 0) {
                this.deepCompare(source.Children[index], child)
            }
            else {
                const sourceElem = source.Children[index];
                const destElem = child;
                //Элемент был добавлен
                if (sourceElem == undefined) {
                    this.setAttribute(destElem, ["style", TrackedChanges.Added], [DifferDomSerivce.addedStyle, "+"]);
                    return;
                }
                if (destElem.TagName == sourceElem.TagName) {
                    //Элемент был изменен
                    if (sourceElem.TextContent != destElem.TextContent) {
                        this.setAttribute(destElem, 
                            ["class", "style", TrackedChanges.Changed], 
                            ["changedValue", DifferDomSerivce.changedStyle, `${sourceElem.TextContent?.replaceAll(`"`, `'`)}`]);
                        return;
                    }
                }
                // else {
                //     //Старый элемент был удален, на его место был добавлен новый элемент
                //     this.setAttribute(sourceElem, ["style", TrackedChanges.Deleted], [DifferDomSerivce.deletedStyle, "+"]);
                //     dest.Children.unshift(sourceElem);
                //     this.setAttribute(destElem, ["style", TrackedChanges.Added], [DifferDomSerivce.addedStyle, "+"]);
                //     return;
                // }
            }
            if (dest.Children.length !== source.Children.length) {
                //Элементы добавлены в новой версии верстки
                if (dest.Children.length > source.Children.length) {
                    dest.Children.forEach( (destChild, index) => {
                        if (source.Children[index] === undefined) {
                            this.setAttribute(destChild, ["style", TrackedChanges.Added], [DifferDomSerivce.addedStyle, "+"]);
                        }
                    });
                }
                //Элементы удалены из старой версии верстки
                else if (source.Children.length > dest.Children.length)  {
                    source.Children.forEach( (sourceChild, index) => {
                        if (dest.Children[index] === undefined) {
                            this.setAttribute(sourceChild, ["style", TrackedChanges.Deleted], [DifferDomSerivce.deletedStyle, "+"]);
                            dest.Children.push(sourceChild);
                        }
                    });
                }
            }
        });
    }

    private convertToHtml(domTree: DOMElement, str = ''): string {
        let result = str;
        if (domTree.Children.length !== 0) {
            domTree.Children.forEach((child) => {
                let attributes = '';
                child.Attributes.forEach((attr, index) => {
                    let equalsSign = '='
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
    
                result += `<${child.TagName.toLowerCase()} ${attributes} >${this.convertToHtml(
                    child,
                    str,
                )}${child.TextContent}</${child.TagName.toLowerCase()}>`;
            });
        }
    
        return result;
    };

    private setAttribute(domElement: DOMElement, attributes: string[], attributesValue: string[]) {
        attributes.forEach( (attribute, index) => {
            domElement.Attributes.push(attribute);
            domElement.AttributesValue.push(attributesValue[index]);
        });
    }
}