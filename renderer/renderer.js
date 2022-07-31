const HEADER = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="../katex/katex.min.css" >
    <link rel="stylesheet" href="styles.css" >
    <script defer src="../katex/katex.min.js" ></script>
    <script defer src="../katex/auto-render.min.js" 
        onload="renderMathInElement(document.body,{delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});"></script>
  </head>`

const METADATA = `<body class="TYPE_PLACEHOLDER">
    <div class="header">
      <img src="../images/full-logo.png">
      <div class="container">
          <div class="subject">
             SUBJECT_PLACEHOLDER
          </div>
          <div class="title">
             TITLE_PLACEHOLDER
          </div>
      </div>
    </div>
    <div class="main">
    SECTIONS_PLACEHOLDER
    </div>
  </body>
</html>
`

const DICT = {
    btx: "text",
    tx: "text",
    tl: "title",
    eq: "equation",
    m: "minor",
    im: "important",
    in: "indented",
}


const filename = process.argv[2];
const filenameOut = process.argv[3];
console.log(filename);
var fs = require('fs');
const { parse } = require('path');

// Open file demo.txt in read mode
fs.readFile(`../metadata_resumenes/${filename}`, 'utf8', function (err, data) {
    page = parseData(data);
    prefix = filename.split(".")[0];
    fs.writeFile(filenameOut, page, err => {
      if (err) {
        console.error(err);
      }
    });
});

function parseData(data) {
    let output = HEADER;
    let lines = data.split('\n');
    let metadata = "";
    let sections = [];
    let state = "on_metadata";
    let new_section = ""
    for (line of lines) {
        if (line.length < 2) {
            continue;
        } 
        if (line.includes("begin_section")){
            if (state === "on_metadata"){
                state = "on_sections";
            } else {
                new_section = "";
            }
        } else if (line.includes("end_section")){
            sections.push(new_section);
            continue;
        } else {
            if (state === "on_metadata"){
                metadata += "\n" + line;
            } else {
                new_section += "\n" + line;
            }
        }
    }
    [parsedMetadata, sectionsOrder] = parseMetadata(metadata);
    parsedSections = sections.map(s => parseSection(s));

    output = combine(parsedSections, parsedMetadata, sectionsOrder, output);
    return output;
}

function get_key_value(line) {
    splitted = line.split(":");
    let key = splitted[0];
    let value = splitted.slice(1).join(':');
    return [key, value];
}

function parseMetadata(metadata){
    let lines = metadata.split("\n");
    let obMetadata = {};
    for (line of lines) {
        if (line.length < 2){
            continue;
        }
        [key, value] = get_key_value(line);
        obMetadata[key] = value;
    }
    let parsedMetadata = METADATA
        .replace("TYPE_PLACEHOLDER", obMetadata["type"])
        .replace("TITLE_PLACEHOLDER", obMetadata["title"])
        .replace("SUBJECT_PLACEHOLDER", obMetadata["subject"]);
    return [parsedMetadata, obMetadata["sections_order"]];
}

function parseSection(section){
    let lines = section.split("\n");
    const start = '<div class="section">';
    const end = '</div>';
      
    parsedSection = "";
    for (line of lines) {
        if (line.length < 2){
            continue;
        }
        [key, value] = get_key_value(line);
        let keys = Array.from(key.split(" "));
        let classes = keys.map(a => DICT[a]).join(" ");
        if (keys.some(e => (e === "btx"))) {
            value = '• ' + value;
        }
        if (keys.some(e => (e === "eq"))){
            value = "$$$$" + value + "$$$$";
        }
        if (keys.some(e => (e === "img"))){
            parsedSection += `<div style="width: 47vw;margin: var(--katex-margin);"><img src="../images/${value.trim()}" style="width: ${keys[1]}px; display: block; margin-left: auto; margin-right: auto;"></div>`
        } else{
            parsedSection += `<div class="${classes}"> ${value} </div>`
        }
    }
    return start + parsedSection + end;
}


function combine(parsedSections, parsedMetadata, sectionsOrder, output){
    let renderedSections = "";
    eval(sectionsOrder).forEach(i => renderedSections += parsedSections[i]);
    let body = parsedMetadata.replace("SECTIONS_PLACEHOLDER", renderedSections);
    return output + body;
}