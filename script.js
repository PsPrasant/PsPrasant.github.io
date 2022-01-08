var app = angular.module("grids", []);
app.controller("gridsController", function($scope){
	$scope.getNumber = function(num) {
	    return new Array(num);   
	}

	$scope.submit = function() {
		console.log("function call");
	    console.log(document.getElementById("num_horizantal_grids").value);
	    var image = document.getElementById("image");
	    var grids = document.getElementById("grids");
	  	grids.style.height = image.offsetHeight + "px";
	  	grids.style.width = image.offsetWidth + "px";
	  	var gridSize = image.offsetWidth / $scope.num_grids;
	  	// for (var i =0; i< image.offsetHeight; i += gridSize) {
	  	// 	var hr = document.createElement("hr")
	  	// 	hr.style.position = "absolute";
	  	// 	hr.style.width = image.offsetWidth + "px";
	  	// 	hr.style.top = i + "px";
	  	// 	grids.appendChild(hr);
	  	// }
	  	var table = document.getElementById("gridsTable")
	  	if (table == null) {
		  	table = document.createElement("table")
		  	table.setAttribute("id", "gridsTable")
		} else {
		  	while (table.firstChild) {
    			table.firstChild.remove()
			}
		}
	  	for (var i =0; i< image.offsetHeight; i+= gridSize) {
	  		var tr = document.createElement("tr")
	  		for (var j = 0; j < image.offsetWidth ; j += gridSize) {
		  		var td = document.createElement("td")
		  		var div = document.createElement("div")
		  		div.style.width = gridSize + "px";
		  		div.style.height = gridSize + "px";
		  		td.appendChild(div)
		  		tr.appendChild(td);
		  	}
	  		table.appendChild(tr);
	  	}
	  	grids.appendChild(table);
	}










});