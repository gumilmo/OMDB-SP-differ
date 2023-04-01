import { Command } from 'commander';
import { trace } from 'console';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import { ComparableDocument } from './models/comparable-document.model';
import { Line } from './models/line.model';
import { ViewableLine } from './models/viewable-line.model';
import { ConsolePrinter } from './services/console-printer.service';
import { Differ } from './services/differ.service';
import {HtmlGeneratorService} from './services/html-generator.service'

var timeAppStart = new Date().getTime();
const program = new Command();
program
    .version("1.0")
    .description("CLI приложения для сравнения двух html")
    .option("--compare <paths...>", "Сравнение файлов")
    .parse(process.argv);
    
const options = program.opts();

if (options == null) {
    program.help();
}

const source: ComparableDocument = new ComparableDocument(
    loadFile("././test-pages/1-src.html").toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
)

const dest: ComparableDocument = new ComparableDocument(
    loadFile("././test-pages/1-dst.html").toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
)

const test = new Differ(source, dest);
const printer = new ConsolePrinter();

//printer.print(test.getViewableLines());
var lines = test.getViewableLines();
createResultHtml(HtmlGeneratorService.createHtmlView(lines));

if (options.compare) {

    const paths: string[] = options.compare as string[];
    if (!paths || paths.length < 2) {
       throw new Error(`Не указан путь(и) до файлов ${paths}`);
    }

    // const source: ComparableDocument = new ComparableDocument(
    //     loadFile(paths[0]).toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
    // )
    
    // const dest: ComparableDocument = new ComparableDocument(
    //     loadFile(paths[1]).toString().split('\n').map( (line, index) => new Line(line.replace('\r', ''), index+1) )
    // )
    
    // const test = new Differ(source, dest);
    // const printer = new ConsolePrinter();

    // printer.print(test.diff());
    // var lines = test.diff();
    // createResultHtml(test.createHtmlView(lines));
}

function loadFile(filePath: string): string {
    try {
        const file = readFileSync(filePath, "utf-8");
        return file;
    } catch (exception) {
        console.error(exception);
        return "";
    }
}

async function createResultHtml(content: string) {
    var timeAppEnd = new Date().getTime();
    content += `<span>Время работы программы заняло: ${timeAppEnd - timeAppStart} миллисекунд</span>`
    fs.writeFile('./' + `/result.html`, content, (error) => { console.error(error) });
}



