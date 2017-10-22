
const readline = require('readline');
const fs = require('fs');
fs.unlinkSync("./log.txt");
fs.writeFileSync("./log.txt", "start");
var exportJson = {};
const subjectRegex = /^(Interdisciplinary CoursesInformations Systems|History|Accounting|Adult Education|Air Science|Anthropology|Arabic|Art|Astronomy|Atmospheric Science|Biology|Business Administration|Chemistry|Child Advocacy Studies|Chinese|Communication|Computer Science|Counselor Education|Criminology & Criminal Justice|Early Childhood Education|Economics|Educ. Research & Eval. Method|Education|Educational Administration|Educational Foundations|Educational Psychology|Educational Technology|Elementary Education|Engineering|English|English For Academic Purposes|Finance|Foreign Language - Other|French|Gender Studies|Geography|Geology|German|Gerontology|Home Economics|Honors|Japanese|Joint Civil Engineering|Joint Computer Science|Joint Electrical Engineering|Joint Engr Communication|Joint Mechanical Engineering|Latin|Logistics & Oper Mgmt|Management|Marketing|Mathematics|Media Studies|Middle Education|Military & Veteran Studies|Military Science|Music: Practicum|Music: Theory & Composition|Nursing|Optometry|Philosophy|Physical Education|Physics|Political Science|Psychology|Public Policy Administration|Secondary Education|Social Work|Sociology|Spanish|Special Education|Teacher Education|Theatre|Work)$/g;
var currentSubject;
const classNameRegex = /(([A-Za-z])[ ]?){1,}/;
var currentClassName;
const classNumberRegex = /^\d{4}$/;
var currentClassNumber;
const startSectionRegex = /^(Regular|Eight Wk 2|Eight Wk 1|Off Schd 2|Winter IS)$/
const crnRegex = /^\d{5}$/;
const dayRegex = /^(TTh|MW|F|ARR|W|M|Th|T|WF)$/;
const timeRegex = /\d{2}[:]\d{2}[ -]+\d{2}[:]\d{2}[ ](pm|am)|ARR/;
const buildingRegex = /([A-Z]{2,3}[ -]+\d{5}|ONLINE|ARR)/;
const sectionRegex = /^[A-Z0-9]{2}[0-9]{1}$/;
const profRegex = /((\w+([ ]\w+)?[,][A-Z]|(AAR)|(TBA,I)))/
var storageCrn = "";
var storageDay = "";
var storageTime = "";
var storageBuilding = "";
var storageProf = "";
var currentSection = "";
var previousWasClassNumber = false;
const lineReader = readline.createInterface({
    input: fs.createReadStream('./test.txt')
});

lineReader.on('line', function (line) {
    //console.log('Line from file:', line);
    line = line.trim()
    if (line.match(subjectRegex)) {
        fs.appendFileSync("./log.txt", "SUBJECT: " + line + "\n");
        console.log(line);
        exportJson[line.trim()] = {};
        currentSubject = line;
        //console.log(exportJson);
    }
    if (classNumberRegex.test(line.trim())) {
        //console.log(line);
        exportJson[currentSubject][line] = {};
        currentClassNumber = line;
        previousWasClassNumber = true;
        console.log(line);
    }
    if (classNameRegex.test(line) && previousWasClassNumber) {
        fs.appendFileSync("./log.txt", line + "\n");
        console.log(line);
        exportJson[currentSubject][currentClassNumber] = {name: line, sections: {}}
        previousWasClassNumber = false;
    }
    if (crnRegex.test(line)) {
        storageCrn = line;
    }
    if (sectionRegex.test(line) && line != "CMP" && line != "SEC" && line != "DAY" && line != "AAR" && line != "IND" && line != "RSD" && line != "LEC" && line != "FLD" && line != "INT") {
        exportJson[currentSubject][currentClassNumber].sections[line] = {};
        currentSection = line;
    }
    if (dayRegex.test(line)) {
        storageDay = line;
    }
    if (timeRegex.test(line)) {
        storageTime = line;
    }
    if (buildingRegex.test(line)) {
        storageBuilding = line;
    }
    if (profRegex.test(line)) {
        exportJson[currentSubject][currentClassNumber].sections[currentSection] = {day : storageDay, crnNumber: storageCrn, professor: line, time: storageTime, building: storageBuilding};
    }
    fs.writeFileSync("./output.txt", JSON.stringify(exportJson));
});