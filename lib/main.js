"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const comparable_document_model_1 = require("./models/comparable-document.model");
const line_model_1 = require("./models/line.model");
const console_printer_service_1 = require("./services/console-printer.service");
const differ_service_1 = require("./services/differ.service");
const jsdom_1 = require("jsdom");
class DOMElement {
    static FromJson(d) {
        return Object.assign(new DOMElement, d);
    }
}
var timeAppStart = new Date().getTime();
const program = new commander_1.Command();
program
    .version("1.0")
    .description("CLI приложения для сравнения двух html")
    .option("--compare <paths...>", "Сравнение файлов, пример: node lib/main.js C:\\Folder\\old.html C:\\Folder\\new.html")
    .parse(process.argv);
const options = program.opts();
const source = new comparable_document_model_1.ComparableDocument(loadFile("././test-pages/1-src.html").toString().split('\n').map((line, index) => new line_model_1.Line(line.replace('\r', ''), index + 1)));
const test = new jsdom_1.JSDOM((0, fs_1.readFileSync)("././test-pages/1-src.html").toString());
const dest = new comparable_document_model_1.ComparableDocument(loadFile("././test-pages/1-dst.html").toString().split('\n').map((line, index) => new line_model_1.Line(line.replace('\r', ''), index + 1)));
const DestBody = test.window.document.querySelector('body');
let jsonFromDest = null;
const Elem = (e) => ({
    tagName: e.tagName,
    textContent: e.textContent ?? "",
    attributes: Array.from(e.attributes, ({ name, value }) => [name, value]),
    children: Array.from(e.children, Elem)
});
const html2json = (e) => JSON.stringify(Elem(e), null, '');
if (DestBody != null) {
    jsonFromDest = html2json(DestBody);
    const DOMDest = DOMElement.FromJson(JSON.parse(jsonFromDest));
    const aaaa = 1;
}
const differ = new differ_service_1.Differ(source, dest);
// var lines = differ.getViewableLines();
// createResultHtml(HtmlGeneratorService.createHtmlView(lines, timeAppStart, 0, '', ''),lines,0);
// if (options.compare) {
//     const paths: string[] = options.compare as string[];
//     if (!paths || paths.length < 2) {
//        throw new Error(`Не указан путь(и) до файлов ${paths}`);
//     }
//     const source: ComparableDocument = new ComparableDocument(
//         loadFile(paths[0]).toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
//     )
//     const dest: ComparableDocument = new ComparableDocument(
//         loadFile(paths[1]).toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
//     )
//     const differ = new Differ(source, dest);
//     var lines = differ.getViewableLines();
//     var timeAppEnd = new Date().getTime();
//     createResultHtml(HtmlGeneratorService.createHtmlView(lines, timeAppStart, timeAppEnd, paths[0], paths[1]),lines,timeAppEnd);
// }
// else {
//     program.help();
// }
function loadFile(filePath) {
    try {
        const file = (0, fs_1.readFileSync)(filePath, "utf-8");
        return file;
    }
    catch (exception) {
        console.error(exception);
        return "";
    }
}
async function createResultHtml(content, lines, endTime) {
    // content += `<span>Время работы программы заняло: ${timeAppEnd - timeAppStart} миллисекунд</span>`
    fs.writeFile(__dirname + `/result.html`, content, (error) => { console.error(error); });
    console.log(`Итоговый файл «result.html» сохранен в директорию ${__dirname}\\result.html. Время работы приложения заняло ${1 - timeAppStart} мс`);
    const prompt = require("prompt-sync")({ sigint: true });
    const isShowInTerminal = prompt("Вы хотите отобразить изменения в терминале (y/n)");
    if (isShowInTerminal === 'y') {
        const printer = new console_printer_service_1.ConsolePrinter();
        printer.print(lines.reverse());
    }
    else {
        return;
    }
}
//# sourceMappingURL=main.js.map