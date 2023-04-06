import { DOMElement } from "../models/dom-element.model";

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
            jsonFromSource = this.markUpToJson(this.DomSource);
            jsonFromDest = this.markUpToJson(this.DomDest);
            
            const DOMSource: any = this.FromJson(JSON.parse(jsonFromSource));
            const DOMDest: any = this.FromJson(JSON.parse(jsonFromDest));

            this.goDeepCompare(DOMSource, DOMDest);

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

    private FromJson(d: Object): Object {
        return Object.assign(new DOMElement, d);
    }

    private goDeepCompare(source: DOMElement, dest: DOMElement): void {
        if (source != undefined)
        dest.Children.forEach( (child, index) => {
            if (child.Children.length !== 0) {
                this.goDeepCompare(source.Children[index], child)
            }
            else {
                const sourceElem = source.Children[index];
                const destElem = child;
                //Элемент был добавлен
                if (sourceElem == undefined) {
                    destElem.WasViewed = true;
                    destElem.Attributes.push("style");
                    destElem.Attributes.push("newelement");
                    destElem.AttributesValue.push(`cursor: pointer; border: 4px solid green; padding: 10px`);
                    destElem.AttributesValue.push("+")
                }
                else {
                    if (destElem.TagName == sourceElem.TagName) {
                        //Элемент был изменен
                        if (sourceElem.TextContent != destElem.TextContent) {
                            dest.WasViewed = true;
                            source.WasViewed = true;
                            destElem.WasViewed = true;
                            sourceElem.WasViewed = true;
                            destElem.Attributes.push("class");
                            destElem.Attributes.push("style");
                            destElem.Attributes.push("oldValue");
                            destElem.AttributesValue.push("changedValue");
                            destElem.AttributesValue.push(`cursor: pointer; border: 4px solid orange; padding: 10px`);
                            destElem.AttributesValue.push(`${sourceElem.TextContent}`);
                        }
                    }
                    else {
                        //Старый элемент был удален, на его место был добавлен новый элемент
                        source.WasViewed = true;
                        sourceElem.WasViewed = true;
                        sourceElem.Attributes.push("style");
                        sourceElem.Attributes.push("deletedelement");
                        sourceElem.AttributesValue.push(`cursor: pointer; border: 4px solid red; padding: 10px`);
                        sourceElem.AttributesValue.push("-")
                        dest.Children.unshift(sourceElem);
                        dest.WasViewed = true;
                        destElem.WasViewed = true;
                        destElem.Attributes.push("style");
                        destElem.Attributes.push("newelement");
                        destElem.AttributesValue.push(`cursor: pointer; border: 4px solid green; padding: 10px`);
                        destElem.AttributesValue.push("+")
                    }
                }
            }
            if (dest.Children.length != source.Children.length) {
                //Элементы добавлены из новой версии верстки
                if (dest.Children.length > source.Children.length) {
                    dest.Children.forEach( (destChild, index) => {
                        if (source.Children[index] === undefined) {
                            destChild.WasViewed = true;
                            destChild.Attributes.push("style");
                            destChild.Attributes.push("newelement");
                            destChild.AttributesValue.push(`cursor: pointer; border: 4px solid green; padding: 10px`);
                            destChild.AttributesValue.push("+")
                        }
                    });
                }
                else {
                    //Элементы удалены из старой версии верстки
                    source.Children.forEach( (sourceChild, index) => {
                        if (dest.Children[index] === undefined) {
                            sourceChild.WasViewed = true;
                            sourceChild.Attributes.push("style");
                            sourceChild.Attributes.push("deletedelement");
                            sourceChild.AttributesValue.push(`cursor: pointer; border: 4px solid red; padding: 10px`);
                            sourceChild.AttributesValue.push("-")
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
    
                result += `<${child.TagName.toLowerCase()} ${attributes} >${this.convertToHtml(
                    child,
                    str,
                )}${child.TextContent}</${child.TagName.toLowerCase()}>`;
            });
        }
    
        return result;
    };
}