var XLSX = require('xlsx');
var workbook = XLSX.readFile('testdata.xlsx');
var sheet_name_list = workbook.SheetNames;
var data = [];

sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var getOldInx = 0;
        var changeColumKeyCounter= 0;
      
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
       
        var currentColumnAry;
        var mynewcol ;
        var newcollsec;
        var nameCol; 

        var oldColname="";
        var newColname;
   

        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }

        if(!data[row]){
            data[row]={};
            var mainary=[]
            var newColumnAry ={};
        } 

        
                
                if(headers[col].indexOf(".") > -1) {
                        currentColumnAry = headers[col].split(".");
                        mynewcolInx = currentColumnAry[0].substring(currentColumnAry[0].indexOf("[")+1,currentColumnAry[0].indexOf("]"));;
                        newcollKey = currentColumnAry[1];
                        oldColname = currentColumnAry[0].split("[")[0]
                       
                        if(oldColname != newColname) {
                            var mainary=[]
                            newColname = oldColname;
                        }
                        

                        var arrayColumnCnt=0;
                        //console.log("new Col name : "+mynewcol + " newcol key :"+newcollKey );
                        //var ccont =headers[col].reduce(function(countMap, word) {countMap[word] = ++countMap[word] || 1;return countMap}, {});
                        var arrayColumnCnt=  columnCount(headers, currentColumnAry[0] ) -1 ;
                 
                       //console.log(typeof headers)
                 
                       
                             if(changeColumKeyCounter == arrayColumnCnt)    
                                 mainary.push(newColumnAry);

                                if(getOldInx != mynewcolInx) {
                                    getOldInx = mynewcolInx
                                    changeColumKeyCounter=0;
                                    var newColumnAry= {};
                                    //mynewcol1[newcollKey]={}
                                }
                                newColumnAry[newcollKey] =  value;
                                //console.log(newcollKey +"---"+value)
                        
                                changeColumKeyCounter++;  
                       
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
  
});

console.log(data)


function columnCount(headerObj , col) {
    
    var cnt=0;
   
    var vals = Object.keys(headerObj).forEach(function(key) {
            if(headerObj[key].indexOf(col) > -1) {
                cnt++;
            }
      
    });
    return cnt;
}