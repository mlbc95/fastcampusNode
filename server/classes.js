var csv2json = require('csv2json');
var fs = require('fs');
var csvjson = require('csvjson');
 
// fs.createReadStream('FS17 PDF of Classes.csv')
//   .pipe(csv2json({
//     // Defaults to comma. 
//     separator: ','
//   }))
//   .pipe(fs.createWriteStream('data.json'));