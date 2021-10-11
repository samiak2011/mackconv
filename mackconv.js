const zlib = require('zlib');    
const unzip = zlib.createUnzip();  
const fs = require('fs');  
const convert = require('xml-js');

var myArgs = process.argv.slice(2); 

if(myArgs.length<=0)
{
    console.log("Must pass the gz file name");
    return(1);
}
var inputFileName = myArgs[0];
var outFileName = myArgs[0].replace(".gz","");
var xlsFileName = outFileName.replace(".xml",".xlsx");
console.log("input file name: ", inputFileName);
console.log("output file name: ", outFileName);
console.log("excel file name: ", xlsFileName);

const inp = fs.createReadStream(inputFileName);  
const out = fs.createWriteStream(outFileName);  
    
inp.pipe(unzip).pipe(out);  

out.on("close", () => {
    const xmlFile = fs.readFileSync(outFileName, 'utf8');
    // parse xml file as a json object
    const jsonData = JSON.parse(convert.xml2json(xmlFile, {compact: true, spaces: 2}));
    jsonData.transSet.trans.forEach(element => {
       if(element._attributes.type === 'sale') 
       {
        console.log("data: ", element);
    }
    });
    
});

var dateStr = "";
var numStr = "";
var amountStr = "";
var cusStr = "";
var descStr = "";


