import { JSDOM } from 'jsdom'
import { DifferDomSerivce } from './services/differ-services/differ-dom.serivce';
import { ComparableDocument } from './models/file-differ.models/comparable-document.model';
import { Line } from './models/file-differ.models/line.model';
import { Differ } from './services/differ-services/differ-file.service';
import { HtmlGeneratorService } from './services/html-generator.service';

const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 80;

app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get('/', (req: any, res:any) => {
   res.sendFile(path.resolve(__dirname, '../', 'differ-web-app', 'public', 'index.html'));
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});

app.post('/api/compare' , async (req: any, res: any) => {

    var files =  req.body;

    var src = files.src;
    var dest = files.dest;
    
    const sourceFileJSdom = new JSDOM(src);
    const destFileJSdom = new JSDOM(dest);

    const SourceBody = sourceFileJSdom.window.document.querySelector('body');
    const DestBody = destFileJSdom.window.document.querySelector('body');

    const differDomService = new DifferDomSerivce(SourceBody, DestBody);

    let styles = '<!DOCTYPE html> <html>';
    styles += destFileJSdom.window.document.querySelector('html')?.innerHTML.split("<body")[0].replace('height: calc(100% - 32px)', '');
    
    let final = '<body>';
    final += differDomService.DOMHandler();
    final += `<script type="text/javascript" src="./interact.js"></script>`
    final += '</body>';
    final += '</html>';
    console.log(final)
    var result = styles + final
    res.send(result);
})

app.post('/api/compare-text' , async (req: any, res: any) => {

   var files =  req.body;

   var src = files.src;
   var dest = files.dest;
   
    const source: ComparableDocument = new ComparableDocument(
      src.toString().split('\n').map( (line: string, index: number) => new Line(line.replace('\r', ''), index+1) )
    )
    
    const destination: ComparableDocument = new ComparableDocument(
      dest.toString().split('\n').map( (line: string, index: number) => new Line(line.replace('\r', ''), index+1) )
    )
    
    const differ = new Differ(source, destination);

    var lines = differ.getViewableLines();
    var timeAppEnd = new Date().getTime();

    console.log(lines);

    var result = HtmlGeneratorService.createHtmlView(lines, 0, timeAppEnd, "paths[0]"," paths[1]");
      res.send(result);
})

