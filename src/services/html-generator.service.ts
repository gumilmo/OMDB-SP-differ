import { ViewableLine } from "../models/viewable-line.model";

export class HtmlGeneratorService {
    
    public static createHtmlView(lines: ViewableLine[]) : string {
        let result: Html = new Html();
        const oldBlock: DivBlock = new DivBlock();
        oldBlock.class = "split left";
        const newBlock: DivBlock = new DivBlock();
        newBlock.class = "split right";
        
        for (let line of lines.reverse().filter(x => x.NewLine?.LineIndex != 0 && x.OldLine?.LineIndex != 0)) {

                const oldLine: LiElement = new LiElement();
                oldLine.value = line.OldLine?.LineValue ?? "";
                oldLine.number = line.OldLine?.LineIndex ?? 0;
                oldLine.color = line.EditType === "deleted" ? "deleted-line" : ""
                oldBlock.liElements.push(oldLine);

                const newLine: LiElement = new LiElement();
                newLine.value = line.NewLine?.LineValue ?? "";
                newLine.number = line.NewLine?.LineIndex ?? 0;
                newLine.color = line.EditType === "inserted" ? "inserted-line" : ""
                newBlock.liElements.push(newLine);

                if (newLine.value !== oldLine.value && oldLine.number == 0 || newLine.number == 0) {
                  const emptyLine: LiElement = new LiElement();
                  emptyLine.value = "";
                  emptyLine.number = null;
                  emptyLine.color = "empty-line";

                  // if (newLine.value == '') 
                  //   newBlock.liElements.push(emptyLine);
                  // else
                  //   oldBlock.liElements.push(emptyLine);
                }
        }

        result.blocks.push(oldBlock);
        result.blocks.push(newBlock);
        let resultHtmlString: string = "";

        resultHtmlString += `<html>
        <head>
          <style>
          .split::-webkit-scrollbar {
            width: 10px;
            height: 10px;
            cursor: pointer;
          }
          
          .split::-webkit-scrollbar-track {
            border-radius: 10px;
            background-color: #eeeeee;
          }
           
          .split::-webkit-scrollbar-thumb {
            background: grey; 
            border-radius: 10px;
          }
          
          .split::-webkit-scrollbar-thumb:hover {
            background: lightgrey; 
          }
          .split::-webkit-scrollbar-corner {
            background-color: #ff000000;
          }
          pre {
            white-space: pre-wrap;
            border-top: 2px solid #d1d1d1;
            margin-top: 0;
          }
          .pre-wrapper {
            border-radius: 15px;
            border: 1px solid #d1d1d1;
            background-color: #f7f7f7;
            font-size: 16px;
            height: 90%;
            padding-bottom: 20px;
          }

          .differ-header {
            width: 100%;
            background-color: #eafbff;
            height: 120px;
            border-radius: 15px 15px 0 0;
          }

          .split-view-wrapper {
            height: 85%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          p {
            margin-top: 0px;
            margin-bottom: 0px;
          }

          .split {
              height: 100%;
              width: 50%;
              top: 0;
              overflow-x: auto;
            }
            
            .left {
              overflow: hidden;
            }
            
            .right {
              border-left: 2px solid #d1d1d1; 
            }

            .viewable-row {
              display: flex;
              width: 100%;
              max-width: 10000%;
            }

            .str-num {
              padding-left: 15px
            }

            ol {
              padding-inline-start: 0px
            }

            li {
              list-style: none;
              display: flex;
              align-items: flex-start;
              padding-left: 46px;
            }

            .deleted-line {
              background-color: #ffdedc;
            }

            .deleted-line:hover {
              filter: brightness(1.05);
              cursor: pointer;
            }

            .num-deleted-line {
              background-color: #ffc6c2
            }

            .li-deleted-line {
              padding-left: 20px;
            }
            .li-deleted-line:before {
              content: "-";
              padding-right: 20px;
              align-items: flex-start;
            }
            
            .inserted-line {
              background-color: #d4fede;
            }

            .empty-line {
              background-color: grey;
            }

            .num-inserted-line {
              background-color: #bafad2
            }
            
            .inserted-line:hover {
              filter: brightness(1.05);
              cursor: pointer;
            }
            li:before {
              content: ""
            }
            .li-inserted-line {
              padding-left: 20px;
            }
            .li-inserted-line:before {
              content: "+";
              padding-right: 20px;
              align-items: flex-start;
            }
            </style>
            <link rel="stylesheet" href="${'./src/static/test.css'}">
        </head>`
        resultHtmlString += `<body>`;
        resultHtmlString += `<div class="pre-wrapper">`;
        resultHtmlString += `<div class="differ-header"></div>`
        resultHtmlString += `<pre>`;
        resultHtmlString += `<div class="split-view-wrapper">`;
        for (let block of result.blocks) {
            resultHtmlString += `<div class=\"${block.class}\">`;
            resultHtmlString += `<ol>`;
            for (let li of block.liElements) {
                resultHtmlString += 
                `<div class="viewable-row ${li.color}"><p class="str-num num-${li.color}">${li.number}</p><li class="li-${li.color}"><code class="javascript">${li.value.replaceAll("<", "&lt").replaceAll(">", "&gt")}</code></li></div>`;
            }
            resultHtmlString += `</ol>`;
            resultHtmlString += `</div>`;
        }
        resultHtmlString += `</code>`;
        resultHtmlString += `</pre>`;
        resultHtmlString += `</div>`;
        resultHtmlString += `<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
        <script>hljs.highlightAll();</script>`
        resultHtmlString += `</body>`;

        return resultHtmlString;
    }
}

export class DivBlock {
    class: string;
    liElements: LiElement[] = [];
}

export class LiElement {
    value: string;
    number: number | null;
    color: string;
}

export class Html {
    blocks: DivBlock[] = [];
}