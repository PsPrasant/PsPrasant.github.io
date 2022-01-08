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
	  	while (grids.firstChild) {
			grids.firstChild.remove()
		}
	  	for (var i =0; i < image.offsetHeight; i+= gridSize) {
	  		for (var j = 0; j < image.offsetWidth ; j += gridSize) {
		  		var div = document.createElement("div")
		  		if (i + gridSize > image.offsetHeight) {
		  			div.style.height = image.offsetHeight - i -1 + "px"
		  		} else {
		  			div.style.height = gridSize + "px";
		  		}
		  		if (j + gridSize > image.offsetWidth) {
		  			div.style.width = gridSize  -j  -1 + "px";
		  		} else {
		  			div.style.width = gridSize + "px";
		  		}
		  		div.style.top = i + "px";
		  		div.style.left = j + "px";
		  		div.setAttribute("class", "div-grids")
		  		grids.appendChild(div)
		  	}
	  	}
	}










});