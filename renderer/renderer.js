const HEADER = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="../katex/katex.min.css" >
    <link rel="stylesheet" href="../styles/generic.css" >
    <script defer src="../katex/katex.min.js" ></script>
    <script defer src="../katex/auto-render.min.js" 
        onload="renderMathInElement(document.body,{delimiters: [{left: '$$', right: '$$', display: true},{left: '$', right: '$', display: false}]});"></script>
  </head>`

 const METADATA = `<body class="LAYOUT_PLACEHOLDER">
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
</html>`

const SPECIAL_CLASSES = {
    btx: "bullet text",
    tx: "text",
    eq: "equation",
    beq: "bullet equation",
}


const filename = process.argv[2];
const filenameOut = process.argv[3];

var fs = require('fs');
const { parse } = require('path');

// Open file demo.txt in read mode
fs.readFile(filename, 'utf8', function (err, data) {
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
            } 
            let sectClass = line.split(",");
            if (sectClass.length === 1){
                sectClass = "none";
            } else {
                sectClass = sectClass[1];
            }
            new_section = sectClass;
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
        .replace("LAYOUT_PLACEHOLDER", obMetadata["layout"])
        .replace("TITLE_PLACEHOLDER", obMetadata["title"])
        .replace("SUBJECT_PLACEHOLDER", obMetadata["subject"]);
    if (! ("sections_order" in obMetadata)){
        obMetadata["sections_order"] = "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]";
    }
    return [parsedMetadata, obMetadata["sections_order"]];
}

function parseSection(section){
    let lines = section.split("\n");
    let sectClass = lines[0];
    const start = `<div class="section ${sectClass}">`;
    const end = '</div>';
      
    parsedSection = "";
    for (line of lines.splice(1)) {
        if (line.length < 2){
            continue;
        }
        [key, value] = get_key_value(line);
        let classes = Array.from(key.split(" "));
        if (classes.some(e => (e === "tx"))) {
            value = parseValue(value);
        } else if (classes.some(e => (e === "btx"))) {
            value = addBullet(parseValue(value));
        } else if (classes.some(e => (e === "eq"))){
            if (classes.some(e => (e === "pl"))){
                value = "$$\\displaystyle{" + value + "}$$";
            } else{
                value = "$$$$" + value + "$$$$";
            }
        } else if (classes.some(e => (e === "beq"))){
            value = addBullet("$$\\displaystyle{" + value + "}$$");
        }

        if (classes.some(e => (e === "img"))){
            let imgSize = classes.filter(e => Number.isInteger(Number(e)))[0];
            let imgClasses = classes.filter(e => ! Number.isInteger(Number(e)));
            parsedSection += `<img class="${imgClasses.join(" ")}" src="../images/${value.trim()}" style="width: ${imgSize}px;">`
        } else if (classes.some(e => (e === "ln"))){
            parsedSection += `<hr/ width=50% align=left size=1 class="${key}">`
        } else if (classes.some(e => (e === "nl"))){
            parsedSection += `<br/>`
        } else {
            parsedSection += `<div class="${key}"> ${value} </div>`
        }
    }
    return start + parsedSection + end;
}

function parseValue(value){
    // converts single * to <i> and double * to <b>
    return value;
}

function addBullet(value){
    // converts single * to <i> and double * to <b>
    return `<ul><li>${value}</li></ul>`;
}

function combine(parsedSections, parsedMetadata, sectionsOrder, output){
    let renderedSections = "";
    for (i in eval(sectionsOrder)){
        if (i < parsedSections.length){
            renderedSections += parsedSections[i];
        }
    }
    let body = parsedMetadata.replace("SECTIONS_PLACEHOLDER", renderedSections);
    return output + body;
}