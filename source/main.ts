import { Command } from "commander";
import fs, { readFileSync } from "fs";
import path from "path";

// Используем пакет figlet для красивого ASCII лого
const figlet = require("figlet");
console.log(figlet.textSync("OMDB Differ"));

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

if (options.compare) {
    const paths: string[] = options.compare as string[];
    
    let test: string = "lalalalla";

    paths.forEach((path, index) => {
        const filepath = typeof path === "string" ? path : "";
        loadFile(filepath);
    });

    createResultHtml("<h1>kaif</h1>");
}

async function createResultHtml(content: string) {
    fs.writeFile(__dirname + `/result.html`, content, (error) => { console.error(error) });
}

async function loadFile(filePath: string) {
    try {
        const file = readFileSync(filePath, "utf-8");
        console.log(file);
    } catch (exception) {
        console.error(exception);
    }
}

