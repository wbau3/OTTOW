//var tsv is the TSV file with headers
var fs = require('fs');
var tsv = fs.readFileSync('title.akas.tsv', 'utf8');
console.log(typeof tsv);
tsvJSON(tsv);

function tsvJSON(tsv){
 
  var lines=tsv.split("\n");
 
  var result = [];
 
  var headers=lines[0].split("\t");
 
  for(var i=1;i<lines.length;i++){
 
	  var obj = {};
	  var currentline=lines[i].split("\t");
 
	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }
 
	  result.push(obj);
 
  }
  
  //return result; //JavaScript object
  fs.writeFile("output.json", JSON.stringify(result), function (err, result){
        if(err) console.log('error', err);
  } ); //JSON
}