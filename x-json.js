var XLSX = require('xlsx');
var workbook = XLSX.readFile('testdata.xlsx');
var sheet_name_list = workbook.SheetNames;
var data = [];

sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var range = XLSX.utils.decode_range(workbook.Sheets[y]["!ref"]);
        var noRows = range.e.r; // No.of rows
        var noCols = range.e.c; 
        var headers = {};
        var flg =true;
        var getInx =0;
        var columnchangeKey=0
      
    for(z in worksheet) {

        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var tt = 0;
        for (var i = 0; i < z.length; i++) {
            if (!isNaN(z[i])) {
                tt = i;
                break;
            }
        };
        var col = z.substring(0,tt);
        var row = parseInt(z.substring(tt));
        var value = worksheet[z].v;
        var coll;
        var mynewcol ;
        var newcollsec;
        var nameCol; 

        var oldColname ;
        var newColname;
   

        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

                if(!data[row]){
                    data[row]={};
                    var mainary=[]
                    var mynewcol1 ={};
                } 

        
                
                if(headers[col].indexOf(".") > -1) {
                        coll = headers[col].split(".");
                        mynewcol = coll[0].substring(coll[0].indexOf("[")+1,coll[0].indexOf("]"));;
                        newcollKey = coll[1];
                        oldColname = coll[0].split("[")[0]
                        if(oldColname != newColname) {
                            var mainary=[]
                            newColname = oldColname;
                        }
                        

                        var kkcunt=0;
                        //console.log("new Col name : "+mynewcol + " newcol key :"+newcollKey );
                        //var ccont =headers[col].reduce(function(countMap, word) {countMap[word] = ++countMap[word] || 1;return countMap}, {});
                        var kkcunt=  columnCount(headers, coll[0] ) -1 ;
                 
                       //console.log(typeof headers)
                 
                       
                        if(columnchangeKey== kkcunt)    
                                 mainary.push(mynewcol1);

                                if(getInx != mynewcol) {
                                    getInx = mynewcol
                                    columnchangeKey=0;
                                    var mynewcol1= {};
                                    //mynewcol1[newcollKey]={}
                                }
                                mynewcol1[newcollKey] =  value;
                                //console.log(newcollKey +"---"+value)
                        
                        
                                columnchangeKey++;  
                       
                } 

                if(headers[col].indexOf(".") > -1) {
                    //let str = '{" + yourKey + ":'+yourValue+'}';
                    //str = JSON.parse(str);
                    var colnameAry = headers[col].split(".");
                    var mynewcol = colnameAry[0].split("[");
                    nameCol = mynewcol[0]; 

                    data[row][nameCol] =JSON.stringify( mainary) ;
                   
                } else{
                    data[row][headers[col]] = value;     
                }
                
               // data[row][nameCol]=(JSON.stringify(mainary));
    }
   
    data.shift();
    data.shift();
    console.log(data)
});

function columnCount(headerObj , col) {
    
    var cnt=0;
   
    var vals = Object.keys(headerObj).forEach(function(key) {
            if(headerObj[key].indexOf(col) > -1) {
                cnt++;
            }
      
    });
    return cnt;
}