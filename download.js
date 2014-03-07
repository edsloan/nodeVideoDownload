var http = require('http');
var fs = require('fs');
var request = require('request');



var content = fs.readFileSync('videoId.csv');

//split on carriage return and new line feed. this may change depending on if the file was originally created on mac or pc.
var idArray = content.toString().split('\r\n');


var OoyalaApi = require("node-ooyala-api-client");
var apiKey = "APIKEY";
var apiSecret = "APISECRET";
var hostName = "api.ooyala.com";
var hostPort = '80';
var queryStringParams = '';

var client = new OoyalaApi(apiKey, apiSecret, hostName, hostPort);
var headers = null;

fs.writeFile('downloadReport.csv','id, original file name, download url' + '\n');

function makeRequest(arrayIndex) {

	var apiPath = '';
	apiPath = "/v2/assets/" + idArray[arrayIndex] + "/source_file_info";

	var callbacksContext = {
		statusCallback : function(statusCode, responseHeader) {
			//console.log('what is this ' + statusCode, responseHeader);
		},
		dataCallback : function(data) {
			var fileData = JSON.parse(data);
			console.log(fileData);
			fs.appendFile('downloadReport.csv', '"' + idArray[arrayIndex] + '","' + fileData.original_file_name + '","' + fileData.source_file_url + '"\n')
			fs.createWriteStream('downloadReport.csv',{flags:'a'});


			// var downloadfile = fs.createWriteStream(fileData.original_file_name);
			// var request = http.get(fileData.source_file_url, function(response) {
			//   response.pipe(downloadfile);
			// });

	
		},
		errorCallback : function(error) {
			console.log('this is the ' + error);
		}
	};

    client.get(headers, apiPath, queryStringParams, callbacksContext.statusCallback, callbacksContext.dataCallback, callbacksContext.errorCallback, callbacksContext);

}

var counter = 0;

function doCounter() {

	makeRequest(counter);

    counter++;
    if (counter < idArray.length) {
        setTimeout(doCounter, 500);
    }
}

doCounter();





