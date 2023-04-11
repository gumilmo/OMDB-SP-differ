import { JSDOM } from 'jsdom'
import { DifferDomSerivce } from '../services/differ-services/differ-dom.serivce';
import { ComparableDocument } from '../models/file-differ.models/comparable-document.model';
import { Differ } from '../services/differ-services/differ-file.service';
import { HtmlGeneratorService } from '../services/html-generator.service';
import { Line } from '../models/file-differ.models/line.model';
import { ComparableHtml } from '../models/dom-element.model';


export class MainAppController {

    public compareDOM (req: any, res: any) {
    
        var files =  req.body;
        var src = files.src;
        var dest = files.dest;
        
        const sourceFileJSdom = new JSDOM(src);
        const destFileJSdom = new JSDOM(dest);
    
        const SourceBody = sourceFileJSdom.window.document.querySelector('body');
        const DestBody = destFileJSdom.window.document.querySelector('body');
    
        const differDomService = new DifferDomSerivce(SourceBody, DestBody);

        let styles = destFileJSdom.window.document.querySelector('html')?.innerHTML;
        styles = styles?.substring(styles.indexOf("<head>")+6, styles.lastIndexOf("</head>"));
        
        const mainContent = differDomService.DOMHandler();

        const result = new ComparableHtml(styles, mainContent);

        res.send(result);
    };
    
    public compareText (req: any, res: any) {
    
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
     
        res.send(lines);
     };
}
