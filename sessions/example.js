var fs =require("fs-extra");


var myFunc = function(){
	var arr = fs.readdirSync(".");
	var content;
	for( i =0 ; i< arr.length;++i){
	  if ( (arr[i].substr(arr[i].length - 4)) == "json"){
	    content = fs.readFileSync(arr[i],{encoding:"utf8"});
	    if (JSON.parse(content).cookie.expires == null){
		  fs.removeSync(arr[i]);
		  console.log("YES")
	    }
	  }
	}
}

setInterval(myFunc, 1000);