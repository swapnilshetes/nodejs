const path = require('path');
var XLSX = require('xlsx');
var fs = require('fs');

/**
 * CONFIG PARAM
 */
var xlsxPath = "C:\\QA-DART-POC\\nodejs\\projectTemplate" + path.sep;
var xlsFileName = "testdata.xlsx" 
var jsonPath = "C:\\QA-DART-POC\\nodejs\\projectTemplate" + path.sep;
var jsonFileName = "swap.json";
var JsonFullPath = jsonPath + jsonFileName;
var workbook = XLSX.readFile(xlsxPath + xlsFileName);
var sheet_name_list = workbook.SheetNames;
var data = [];
var dataMain = [];
var mainAryName =""
var double_oldColname="";
var double_oldSecondColname="";


sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var getOldInx = 0;
        var d_getOldInx = 0;
        var changeColumKeyCounter= 0;
        var d_changeColumKeyCounter= 0;
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
       
       /**
        *  Single Dimention Json variables
        */
        var currentColumnAry;
        var mynewcol ;
        var newcollsec;
        var nameCol; 
        var oldColname="";
        var newColname;
        
         /**
        *  Double Dimention Json variables
        */

       var double_currentColumnAry;
       var double_mynewcol ;
       var double_newcollsec;
       var double_nameCol; 
       var double_newColname;


        //store header names
        if(row == 1 && value) {
            headers[col] = value;
            continue;
        }
        
        /**
         *  data[row] this will get each row 
         * On each row , this condition initialize all main JOSN array and JSON Object
         * mainAryName : consider each fist column is main and unique key of json object
         * ['TestCaseId' : {
         *      'TestCaseName' : 'name',
         *       'template' : 1
         * }]
         * double_mainary , double_secondary , double_secondary_temp1 user for duble dimention array
         * newColumnAry : single dimention only
         */

        if(!data[row]){
            data[row]={};
                mainAryName = worksheet[z].v
                dataMain[mainAryName] ={}
                var mainary=[]
                var double_mainary={}
                var double_secondary={};
                var double_secondary_temp1=[]
                var newColumnAry ={};
                var d_newColumnAry ={};
        } 

                /**
                 *  Start processing each rows
                 *  /^(.*?)\[(.*?)\]\[(.*?)\]\[(.*?)\]\.(.*?)$/ : (filters.filters_o1[filters2][0].type) This is for 3D array and json object
                 * /^(.*?)\[(.*?)\]\[(.*?)\]\.(.*?)$/ (filters_o1[filters2][0].type) This is for 2D array and json object
                 * remaining is 1d array
                 * 
                */
                
                if(headers[col].indexOf("].") > -1) {
                    //3D
                    if(/^(.*?)\[(.*?)\]\[(.*?)\]\[(.*?)\]\.(.*?)$/.test(headers[col])) {
                        //filters_o1[filters1][0].type
                        var regex = /^(.*?)\[(.*?)\]\[(.*?)\]\[(.*?)\]\.(.*?)$/;
                        var [,mainJsonKey, maincolumnName, subcolumName,fieldIndex,fieldname] = regex.exec(headers[col]) || [];
                         var checkElement =   headers[col].split(".") 
                           
                         /**
                          * double_oldColname, maincolumnName : if main column name change this condition initialise all array and onject of Json
                          * [filters.filters_o1[filters2][0].type] this is one column and second column [options.filters_o1[filters2][0].type] at this time column change so that
                          * we need to initialise all arrays and Objects. Changes filters , options
                          * d_changeColumKeyCounter : this is act like counter 
                          */


                          /**
                          * double_oldSecondColname, subcolumName : if second column name change this condition initialise all array and onject of Json
                          * [filters.filters_o1[filters2][0].type] this is one column and second column [filters.filters_o2[filters2][0].type] at this time column change so that
                          * we need to initialise all arrays and Objects. Changes filters_o1 , filters_o2
                          * 
                          */

                          /**
                           * d_getOldInx !=fieldIndex this is a condition if any index changes we gave to initialize all values
                           * [filters.filters_o1[filters2][0].id] [[filters.filters_o1[filters2][0].type]]
                           * Changes : id , type
                           */
                         if(double_oldColname != maincolumnName){
                            //var double_mainary=[]
                            double_oldColname = maincolumnName;
                           // double_mainary[maincolumnName]={}
                            d_changeColumKeyCounter=0;
                            // subcolumName = {}
                            var double_secondary={};
                            var double_secondary_temp1=[];
                            double_oldSecondColname = subcolumName;
                            double_secondary[subcolumName]={}
                        } else if(double_oldSecondColname != subcolumName) {
                           //var double_secondary={};
                           var double_secondary_temp1=[];
                           double_oldSecondColname = subcolumName;
                           d_changeColumKeyCounter=0;
                            //double_secondary[subcolumName]={}
                        }
                       
                        if(d_getOldInx !=fieldIndex) {
                            d_getOldInx = fieldIndex
                            d_changeColumKeyCounter=0;
                            var d_newColumnAry ={}
                        }
                        
                        //double_secondary[subcolumName].push( {fieldname : value})    ;

                        d_newColumnAry[fieldname]= value   ;
                        var d_ttcnt = 0;
                        d_ttcnt = columnCount(headers , checkElement[0])-1 ;

                            if(d_ttcnt ==d_changeColumKeyCounter) {
                                double_secondary_temp1.push(d_newColumnAry)
                                double_secondary[subcolumName]= double_secondary_temp1;
                                double_mainary[maincolumnName] = (double_secondary)
                            /* console.log("*******start-Push*******")
                                console.log(d_newColumnAry)
                                console.log("*******end-Push*******")
                                console.log("*******Full-Secondary*******")
                                console.log(double_secondary[subcolumName])
                                console.log("*******Full-Main*******")
                                console.log(double_mainary)*/

                            } 

                        d_changeColumKeyCounter++;
                    } else if(/^(.*?)\[(.*?)\]\[(.*?)\]\.(.*?)$/.test(headers[col])) {
                        //2D
                        //filters_o1[filters1][0].type
                        var regex = /^(.*?)\[(.*?)\]\[(.*?)\]\.(.*?)$/;
                        var [, maincolumnName, subcolumName,fieldIndex,fieldname] = regex.exec(headers[col]) || [];
                         var checkElement =   headers[col].split(".") 
                           
                         if(double_oldColname != maincolumnName){
                            //var double_mainary=[]
                            double_oldColname = maincolumnName;
                           // double_mainary[maincolumnName]={}
                            d_changeColumKeyCounter=0;
                            // subcolumName = {}
                            var double_secondary={};
                            var double_secondary_temp1=[];
                            double_oldSecondColname = subcolumName;
                            double_secondary[subcolumName]={}
                        } else if(double_oldSecondColname != subcolumName) {
                           //var double_secondary={};
                           var double_secondary_temp1=[];
                           double_oldSecondColname = subcolumName;
                           d_changeColumKeyCounter=0;
                            //double_secondary[subcolumName]={}
                        }
                       
                        if(d_getOldInx !=fieldIndex) {
                            d_getOldInx = fieldIndex
                            d_changeColumKeyCounter=0;
                            var d_newColumnAry ={}
                        }
                        
                        //double_secondary[subcolumName].push( {fieldname : value})    ;

                        d_newColumnAry[fieldname]= value   ;
                        var d_ttcnt = 0;
                        d_ttcnt = columnCount(headers , checkElement[0])-1 ;

                            if(d_ttcnt ==d_changeColumKeyCounter) {
                                double_secondary_temp1.push(d_newColumnAry)
                                double_secondary[subcolumName]= double_secondary_temp1;
                                double_mainary[maincolumnName] = (double_secondary)
                            /* console.log("*******start-Push*******")
                                console.log(d_newColumnAry)
                                console.log("*******end-Push*******")
                                console.log("*******Full-Secondary*******")
                                console.log(double_secondary[subcolumName])
                                console.log("*******Full-Main*******")
                                console.log(double_mainary)*/

                            } 

                        d_changeColumKeyCounter++;
                    } else if (/^(.*?)\[(.*?)\]\.(.*?)$/.test(headers[col])) {
                        // 1D
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
                    } else {

                    }
                       
                } 

               if(/^(.*?)\[(.*?)\]\[(.*?)\]\[(.*?)\]\.(.*?)$/.test(headers[col])){
                    var regex = /^(.*?)\[(.*?)\]\[(.*?)\]\[(.*?)\]\.(.*?)$/;
                    var [,mainJsonKey, maincolumnName, subcolumName,fieldIndex,fieldname] = regex.exec(headers[col]) || [];
                    //data[row][mainJsonKey] = JSON.stringify(double_mainary)
                    data[row][mainJsonKey] = (double_mainary)

                } else if(/^(.*?)\[(.*?)\]\[(.*?)\]\.(.*?)$/.test(headers[col])){
                    var regex = /^(.*?)\[(.*?)\]\[(.*?)\]\.(.*?)$/;
                    var [, maincolumnName, subcolumName,fieldIndex,fieldname] = regex.exec(headers[col]) || [];
                    //data[row][maincolumnName] = JSON.stringify(double_mainary[maincolumnName])
                    data[row][maincolumnName] = (double_mainary[maincolumnName])

                } else if (/^(.*?)\[(.*?)\]\.(.*?)$/.test(headers[col])) {
                    //let str = '{" + yourKey + ":'+yourValue+'}';
                    //str = JSON.parse(str);
                    var colnameAry = headers[col].split(".");
                    var mynewcol = colnameAry[0].split("[");
                        nameCol = mynewcol[0]; 
                        //data[row][nameCol] =JSON.stringify( mainary) ;
                        data[row][nameCol] =( mainary) ;
                        //data[mainAryName].push(data[row][nameCol]);
                } else if(headers[col].indexOf("[]") > -1) {
                   
                        var currentColumn = headers[col].split("[]")[0];
                        var valueAry = value.split(",")
                        
                        data[row][currentColumn] = valueAry;   
                       // data[mainAryName].push(data[row][currentColumn]);
                        
                } else{
                    data[row][headers[col]] = value;     
                   // data[mainAryName].push( data[row][headers[col]]);
                }
                 
                //**************************** */
                //dataMain[mainAryName] =  data[row];

               // data[row][nameCol]=(JSON.stringify(mainary));
    }
   
    data.shift();
    data.shift();
  
});

//put all data array one by one like[{},{}]
savefile( JsonFullPath , data)
//***************************************************** */
//put all data array one by one with key and array [ 't_1':{},'t_2':{} ]
//console.log(dataMain)


/**
 * 
 *   Save file 
 */

 function savefile( jsonFullPath, jsonData) {
     console.log(jsonData)
    fs.writeFile(jsonFullPath,  JSON.stringify(jsonData, null, 4), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
      });
 }

/** 
 *  Search column name and and return cnt of column. This is very important function if use nested column in execel sheet.
 */
function columnCount(headerObj , col) {
    
    var cnt=0;
   
    var vals = Object.keys(headerObj).forEach(function(key) {
            if(headerObj[key].indexOf(col) > -1) {
                cnt++;
            }
      
    });
    return cnt;
}
