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
                if (sourceElem == undefined) {
                    destElem.WasViewed = true;
                    destElem.Attributes.push("style");
                    destElem.AttributesValue.push(`background-image: linear-gradient(45deg, #bee8be 16.67%, #f1f5f0 16.67%, #f1f5f0 50%, #bee8be 50%, #bee8be 66.67%, #f1f5f0 66.67%, #f1f5f0 100%);background-size: 12.73px 12.73px;`);
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
                            destElem.AttributesValue.push(`cursor: poiner; background-image: linear-gradient(45deg, #faeb7d 16.67%, #ffffff 16.67%, #ffffff 50%, #faeb7d 50%, #faeb7d 66.67%, #ffffff 66.67%, #ffffff 100%); background-size: 12.73px 12.73px;`);
                            destElem.AttributesValue.push(`${sourceElem.TextContent}`);
                        }
                    }
                    else {
                        source.WasViewed = true;
                        sourceElem.WasViewed = true;
                        sourceElem.Attributes.push("style");
                        sourceElem.AttributesValue.push(`cursor: poiner; background-image: linear-gradient(45deg, #f09e6e 16.67%, #f1f5f0 16.67%, #f1f5f0 50%, #f09e6e 50%, #f09e6e 66.67%, #f1f5f0 66.67%, #f1f5f0 100%);background-size: 12.73px 12.73px;`);
                        dest.Children.unshift(sourceElem);
                        dest.WasViewed = true;
                        destElem.WasViewed = true;
                        destElem.Attributes.push("style");
                        destElem.AttributesValue.push(`cursor: poiner; background-image: linear-gradient(45deg, #bee8be 16.67%, #f1f5f0 16.67%, #f1f5f0 50%, #bee8be 50%, #bee8be 66.67%, #f1f5f0 66.67%, #f1f5f0 100%);background-size: 12.73px 12.73px;`);
                    }
                }
            }
            if (dest.Children.length != source.Children.length) {
                if (dest.Children.length > source.Children.length) {
                    dest.Children.forEach( (destChild, index) => {
                        if (source.Children[index] === undefined) {
                            destChild.WasViewed = true;
                            destChild.Attributes.push("style");
                            destChild.AttributesValue.push(`cursor: poiner; background-image: linear-gradient(45deg, #bee8be 16.67%, #f1f5f0 16.67%, #f1f5f0 50%, #bee8be 50%, #bee8be 66.67%, #f1f5f0 66.67%, #f1f5f0 100%);background-size: 12.73px 12.73px;`);
                        }
                    });
                }
                else {
                    source.Children.forEach( (sourceChild, index) => {
                        if (dest.Children[index] === undefined) {
                            sourceChild.WasViewed = true;
                            sourceChild.Attributes.push("style");
                            sourceChild.AttributesValue.push(`cursor: poiner; background-image: linear-gradient(45deg, #f09e6e 16.67%, #f1f5f0 16.67%, #f1f5f0 50%, #f09e6e 50%, #f09e6e 66.67%, #f1f5f0 66.67%, #f1f5f0 100%);background-size: 12.73px 12.73px;`);
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