import { ViewableLine } from "../models/viewable-line.model";

export class HtmlGeneratorService {
    
    public static createHtmlView(lines: ViewableLine[]) : string {

        let result: Html = new Html();
        const table: Table = new Table();

        for (var line of lines.reverse()) {

          switch (line.EditType) {
            case "inserted": {
              let newLineNumberTd: TableCell = new TableCell(line.NewLine?.LineIndex.toString() ?? "");
              newLineNumberTd.style = 'added-number';
  
              let newLineContentTd: TableCell = new TableCell(line.NewLine?.LineValue ?? "");
              newLineContentTd.style = line.getLineColor();
  
              let oldLineNumberTd: TableCell = new TableCell("");
              oldLineNumberTd.style = "empty";
  
              let oldLineContentTd: TableCell = new TableCell("");
              oldLineContentTd.style = "empty";
              
              const tr: TableRow = new TableRow([oldLineNumberTd, oldLineContentTd, newLineNumberTd, newLineContentTd],);
              table.rows.push(tr);
              break;
            }
            case "deleted": {
              let newLineNumberTd: TableCell = new TableCell("");
              newLineNumberTd.style = "empty";
  
              let newLineContentTd: TableCell = new TableCell("");
              newLineContentTd.style = "empty";
  
              let oldLineNumberTd: TableCell = new TableCell(line.OldLine?.LineIndex.toString() ?? "");
              oldLineNumberTd.style = "deleted-number";
  
              let oldLineContentTd: TableCell = new TableCell(line.OldLine?.LineValue ?? "");
              oldLineContentTd.style = line.getLineColor();
              
              const tr: TableRow = new TableRow([oldLineNumberTd, oldLineContentTd, newLineNumberTd, newLineContentTd]);
              table.rows.push(tr);
              break;
            }
            case "equals": {
              let newLineNumberTd: TableCell = new TableCell(line.NewLine?.LineIndex.toString() ?? "");
              newLineNumberTd.style = "equals-number";

              let newLineContentTd: TableCell = new TableCell(line.NewLine?.LineValue ?? "");
              newLineContentTd.style = line.getLineColor();

              let oldLineNumberTd: TableCell = new TableCell(line.OldLine?.LineIndex.toString() ?? "");
              oldLineNumberTd.style = "equals-number";

              let oldLineContentTd: TableCell = new TableCell(line.OldLine?.LineValue ?? "");
              oldLineContentTd.style = line.getLineColor();
              
              const tr: TableRow = new TableRow([oldLineNumberTd, oldLineContentTd, newLineNumberTd, newLineContentTd]);
              table.rows.push(tr);
              break;
            }
            default: break
          }
        }

        result.table = table;
        
        let resultHtmlString: string = "";

        resultHtmlString += `<html>
        <head>
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap');
          
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
            border-top: 1px solid #d1d1d1;
            border-bottom: 1px solid #d1d1d1;
            margin-top: 0;
          }
          .pre-wrapper {
            border-radius: 15px;
            border: 1px solid #d1d1d1;
            background-color: #f7f7f7;
            font-size: 12px;
            line-height: 20px;
            /*height: 90%*/;
            padding-bottom: 20px;
          }

          .differ-header {
            width: 100%;
            background-color: #eafbff;
            min-height: 50px;
            border-radius: 15px 15px 0 0;
          }

          .split-view-wrapper {
            /*height: 85%*/;
            width: 100%;
            display: flex;
            /*align-items: center*/;
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
              border-left: 1px solid #d1d1d1; 
            }

            .viewable-row {
              display: flex;
              width: 100%;
              overflow-wrap: anywhere
            }

            .str-num {
              min-width: 40px;
              text-align: right;
            }

            ol {
              padding-inline-start: 0px;
              margin-block-start: 0;
              margin-block-end: 0
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
              background-color: #ffc6c2;
              min-width: 40px;
              text-align: right;
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
              background-color: #bafad2;
              min-width: 40px;
              text-align: right;
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

            td:nth-child(even) {
              word-break: break-all;
            }
            
            td {
              text-align: left;
              vertical-align: top;
            }
            
            table {
              border: 0px;
              border-collapse:collapse;
            }
            td tr {
              border: 0px;
            }

            .added {
              background-color: green;
            }

            .added-number {
              background-color: green;
            }
            
            .added-number:after {
              content: '+';
              left: 5px;
            }
            .deleted-number {
              background-color: red;
            }
            .deleted-number:after {
              content: '-';
              left: 5px;
            }

            .equals-number:after {
              content: '=';
              left: 5px;
            }

            .empty {
              background-color: grey;
            }
            
            .deleted {
              background-color: red;
            }

            </style>
            <link rel="stylesheet" href="${'./src/static/test.css'}">
        </head>`
        resultHtmlString += `<body>`;
        resultHtmlString += `<div class="pre-wrapper">`;
        resultHtmlString += `<div class="differ-header">
        
        </div>`
        resultHtmlString += `<pre>`;
      //  resultHtmlString += `<div class="split-view-wrapper">`;
        // for (let block of result.blocks) {
        //     resultHtmlString += `<div class=\"${block.class}\">`;
        //     resultHtmlString += `<ol>`;
        //     for (let li of block.liElements) {
        //         resultHtmlString += 
        //         `<div class="viewable-row ${li.color}"><p class="str-num num-${li.color}">${li.number}</p><li class="li-${li.color}"><code class="javascript">${li.value.replaceAll("<", "&lt").replaceAll(">", "&gt")}</code></li></div>`;
        //     }
        //     resultHtmlString += `</ol>`;
        //     resultHtmlString += `</div>`;
        // }

        resultHtmlString += `<table>`;
        for (let tr of result.table.rows) {
          resultHtmlString += `
          <tr>
            <td class=\"${tr.cells[0].style}\">${tr.cells[0].content?.replaceAll(/\s/g, "&emsp;").replaceAll("<", "&lt").replaceAll(">", "&gt")}</td>
            <td class=\"${tr.cells[1].style}\" >${tr.cells[1].content?.replaceAll(/\s/g, "&emsp;").replaceAll("<", "&lt").replaceAll(">", "&gt")}</td>
            <td class=\"${tr.cells[2].style}\">${tr.cells[2].content?.replaceAll(/\s/g, "&emsp;").replaceAll("<", "&lt").replaceAll(">", "&gt")}</td>
            <td class=\"${tr.cells[3].style}\" >${tr.cells[3].content?.replaceAll(/\s/g, "&emsp;").replaceAll("<", "&lt").replaceAll(">", "&gt")}</td>
          </tr>`
        }

        resultHtmlString += `</table>`;
        //resultHtmlString += `</code>`;
        resultHtmlString += `</pre>`;
       // resultHtmlString += `</div>`;
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
    table : Table;
}

export class Table {
  rows: TableRow[] = [];
}

export class TableRow {
  constructor(cells: TableCell[]) { this.cells = cells }
  cells: TableCell[] = [];
}

export class TableCell {
  constructor(value: string) { this.content = value }
  content: string;
  style: string;
}