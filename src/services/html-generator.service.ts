import { ViewableLine } from "../models/viewable-line.model";

export class HtmlGeneratorService {
    
    public static createHtmlView(lines: ViewableLine[]) : string {
        let result: Html = new Html();
        let oldBlock: DivBlock = new DivBlock();
        oldBlock.class = "split left";
        let newBlock: DivBlock = new DivBlock();
        newBlock.class = "split right";
        
        for (let line of lines.reverse().filter(x => x.NewLine?.LineIndex != 0 && x.OldLine?.LineIndex != 0)) {
           //if (line.OldLine?.LineIndex) {
                let oldLine: LiElement = new LiElement();
                oldLine.value = line.OldLine?.LineValue ?? "";
                oldLine.number = line.OldLine?.LineIndex ?? 0;
                oldLine.color = line.EditType === "deleted" ? "deleted-line" : ""
                oldBlock.liElements.push(oldLine);
           //}
            
           //if (line.NewLine?.LineIndex) {
                let newLine: LiElement = new LiElement();
                newLine.value = line.NewLine?.LineValue ?? "";
                newLine.number = line.NewLine?.LineIndex ?? 0;
                newLine.color = line.EditType === "inserted" ? "inserted-line" : ""
                newBlock.liElements.push(newLine);
//}
        }

        result.blocks.push(oldBlock);
        result.blocks.push(newBlock);
        let resultHtmlString: string = "";

        resultHtmlString += `<pre>`;
        for (let block of result.blocks) {
            resultHtmlString += `<div class=\"${block.class}\">`;
            resultHtmlString += `<ol>`;
            for (let li of block.liElements) {
                resultHtmlString += `<li class=\"${li.color}\" value=${li.number}>${li.value.replaceAll("<", "&lt").replaceAll(">", "&gt")}</li>`;
            }
            resultHtmlString += `</ol>`;
            resultHtmlString += `</div>`
        }
        resultHtmlString += `</pre>`;
        resultHtmlString += `
        <style>
        .split {
            height: 100%;
            width: 50%;
            position: fixed;
            z-index: 1;
            top: 0;
            overflow-x: auto;
            padding-top: 20px;
          }
          
          .left {
            left: 0;
          }
          
          .right {
            right: 0;
          }

          .deleted-line {
            background-color: red;
          }

          .deleted-line:hover {
            filter: brightness(0.9);
          }

          .deleted-line:before {
            content: "-";
            padding-right: 5px;
          }
          
          .inserted-line {
            background-color: #6de63e;
          }
          
          .inserted-line:hover {
            filter: brightness(0.9);
          }
          li:before {
            content: "="
          }
          .inserted-line:before {
            content: "+";
            padding-right: 5px;
          }
          </style>`
         return resultHtmlString;
    }
}

export class DivBlock {
    class: string;
    liElements: LiElement[] = [];
}

export class LiElement {
    value: string;
    number: number;
    color: string;
}

export class Html {
    blocks: DivBlock[] = [];
}