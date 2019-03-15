Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}

Element.prototype.removeChildren = function () {
	for (let i = this.childNodes.length - 1; i >= 0; i--) {
		this.removeChild(this.childNodes[i]);
	}
}

Element.prototype.removeChildrenOfType = function (elementType) {
	let children = this.getElementsByTagName(elementType);
	while (children.length > 0) {
		children[0].remove();
	}
}

Element.prototype.removeChildrenWithClass = function (className) {
	let children = this.getElementsByClassName(className);
	while (children.length > 0) {
		children[0].remove();
	}
}

Array.prototype.removeIndex = function (index) {
	this.splice(index, 1);
}

/*Array.prototype.lengthMinus = function () {
	return (this.length - 1);
}*/

String.prototype.replaceAll = function (find, replace = "") {
	return (this.split(find).join(replace));
}

String.prototype.splice = function (index, str) {
	return (this.slice(0, index) + str + this.slice(index));
}

String.prototype.count = function (find) {
	return (this.split(find).length - 1);
}

String.prototype.toTitleCase = function () {
    return (this.replace(/\w\S*/g, function(str) {
    	return (str.charAt(0).toUpperCase() + str.substr(1).toLowerCase());
    }));
}

window.onmousemove = function() {
	var element = document.getElementById("tooltip");
	if (element) {
		element.style.left = event.clientX + "px";
		element.style.top = event.clientY + "px";
	}
}

function commafy (num) {
	var str = String(num).split("").reverse().join("");
	let i = 3;
	if (str[str.length - 1] == "-") {i = 4;}
	if (str.indexOf(".") != -1) {//make comma correct in decimal numbers
		i = 0;
		while (str[i] != "."/* && i < str.length*/) {
			i++;
		}
		i += 4;
	}
	for (i; i < str.length; i += 4) {
		str = str.splice(i, ",");
	}
	return (str.split("").reverse().join(""));
}

function getTooltip(name) {
	for (let i = 0; i < tooltips.length; i++) {
		if (tooltips[i].item == name) {
			return (tooltips[i].value)
		}
	}
	return ("")
}

function createTooltip(event, name) {
	var div = document.createElement("div");
	div.style.cssText = "position: fixed; display: inline-block; padding: 3px; max-width: 250px; background-color: #000; z-index: 1; border: 1px solid #444; left: " + event.clientX + "px; top: " + event.clientY + "px;";
	div.id = "tooltip";

	var p = document.createElement("p");
	p.innerText = getTooltip(name);

	div.appendChild(p);
	document.body.appendChild(div);
}

function destroyTooltip() {
	var element = document.getElementById("tooltip");
	element.parentElement.removeChild(element);
}

function jsonReq(file, callback) {
	var xmlhttp = new XMLHttpRequest();
	var url = file;

	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback.call(file, JSON.parse(this.responseText));
		}
	}

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function getPercent(min, max, value) {
	if (min == max) {return (1)}
	return ((value - min)/(max - min))
}

function distance(x0, y0, x1, y1) {
	return (Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
}