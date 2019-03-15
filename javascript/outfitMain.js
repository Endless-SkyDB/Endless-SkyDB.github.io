var outfit;
var lastSortedBy = "lower";
var reverse = false;

window.onload = function() {
	var data = window.location.search;
	data = data.split("=")[1];
	if (data) {
		data = data.replace(/_/g," ");
		outfit = outfits[data.toTitleCase()];
		createItemDisplay(outfit);
	} else {
		tableParse(outfits);
		document.getElementById("mainTable").style.display = "grid";
	}
}

function sortItems(sortBy) {
	var sub, type;
	type = sortBy.split(",")[1];
	sortBy = sortBy.split(",")[0];
	if (lastSortedBy == sortBy) {if (reverse == false) {reverse = true;} else {reverse = false;}}
	lastSortedBy = sortBy;
	var outfitList = [];

	for (outfit in outfits) {//create item list
		if (outfits[outfit][sortBy]) {
			outfitList.push(outfits[outfit]);
			if (!outfitList[outfitList.length - 1][sortBy]) {
				outfitList[outfitList.length - 1][sortBy] = 0;
			}
		}
	}

	var table = document.getElementById("mainTable");
	for (let i = 0; i < table.childNodes.length; i++) {//remove current table
		if (!table.childNodes[i].id) {
			table.childNodes[i].remove();
			i--;
		}
	}

	if (type == "number") {
		outfitList.sort(function (a, b) {//sort numerical items
			if (reverse) {
				return (b[sortBy] - a[sortBy]);
			} else {
				return (a[sortBy] - b[sortBy]);
			}
			
		});
	} else {
		outfitList.sort(function (a, b) {//sort alphabetical items
			if (reverse) {
				return (b[sortBy].toLowerCase().localeCompare(a[sortBy].toLowerCase()));
			} else {
				return (a[sortBy].toLowerCase().localeCompare(b[sortBy].toLowerCase()));
			}
		});
	}

	for (let i = 0; i < outfitList.length; i++) {//append items
		if (outfitList[i][sortBy]) {
			addTableItem(outfitList[i]);
		}
	}
}

function addTableItem(data, column1 = document.getElementById("select1").value.split(",")[0], column2 = document.getElementById("select2").value.split(",")[0]) {
	if (!data) {return;}
	var table = document.getElementById("mainTable");
	var name = document.createElement("p");
	name.style.cssText = "border-right: 1px solid #444444; padding: 5px; border-bottom: 1px solid #444444; cursor: pointer;";
	name.onclick = function () {
		window.location.href = "outfits.html?outfit=" + outfits[this.innerText].lower.replaceAll(" ", "_");
	}
	name.onmousemove = function () {
		var imgPreview = document.getElementById("imgPreview");
		var imgHolder = document.getElementById("imgHolder");

		if (imgPreview.src != "images/" + outfits[this.innerText].thumbnail + ".png" || imgPreview.naturalWidth > 200 || imgPreview.naturalHeight > 200) {
			if (outfits[this.innerText].thumbnail) {
				imgPreview.src = "images/" + outfits[this.innerText].thumbnail + ".png";
			} else {
				imgPreview.src = "images/outfit/unknown.png";
			}

			imgPreview.width = imgPreview.naturalWidth;
			imgPreview.height = imgPreview.naturalHeight;

			if (imgPreview.naturalWidth > 200 || imgPreview.naturalHeight > 200) {
				if (imgPreview.naturalHeight > imgPreview.naturalWidth) {
					imgPreview.width = imgPreview.naturalWidth * (200/imgPreview.naturalHeight);
					imgPreview.height = 200;
				} else {
					imgPreview.height = imgPreview.naturalHeight * (200/imgPreview.naturalWidth);
					imgPreview.width = 200;
				}
				imgPreview.style.marginTop = "25px";
			} else {
				imgPreview.style.marginTop = (200 - imgPreview.naturalHeight)/2 + 25 + "px";
			}
		}
		imgHolder.style.display = "block";
		imgHolder.style.top = event.clientY + window.scrollY + "px";
		imgHolder.style.left = event.clientX + window.scrollX + "px";
	}
	name.onmouseleave = function () {
		var imgHolder = document.getElementById("imgHolder");
		imgHolder.style.display = "none";
		var imgPreview = document.getElementById("imgPreview");
		imgPreview.src = "images/outfit/unknown.png";
		imgPreview.width = imgPreview.naturalWidth;
		imgPreview.height = imgPreview.naturalHeight;
	}
	var firstCol = document.createElement("p");
	firstCol.style.cssText = "border-bottom: 1px solid #444444;";
	var secondCol = document.createElement("p");
	secondCol.style.cssText = "border-left: 1px solid #444444; border-bottom: 1px solid #444444;";

	name.innerText = data.upper;
	if (data[column1]) {var col1 = data[column1];} else {return}
	if (typeof col1 == "number") {
		col1 = commafy(col1);
	}
	firstCol.innerText = col1;
	if (data[column2]) {var col2 = data[column2];} else {return}
	if (typeof col2 == "number") {
		col2 = commafy(col2);
	}
	secondCol.innerText = col2;

	table.appendChild(name);
	table.appendChild(firstCol);
	table.appendChild(secondCol);
}

function tableParse() {
	for (outfit in outfits) {
		addTableItem(outfits[outfit]);
	}
}

function createItemDisplay(data) {
	document.getElementById("mainDiv").style.display = "block";
	document.getElementById("itemName").innerText = data.upper;
	var image = document.createElement("img");
	image.src = "images/" + data.thumbnail + ".png";
	var style = "";
	image.onload = function() {
		if (this.naturalWidth < 160 && this.naturalHeight < 160) {
			style = "width: " + this.naturalWidth + "px; height: " + this.naturalHeight + "px; margin: " + (((160 - this.naturalHeight)/2) + 10) + "px 0 0 " + (((160 - this.naturalWidth)/2) + 10) + "px;";
		} else {
			if (this.naturalWidth > this.naturalHeight) {
				style = "width: 80%; height: auto;";
			} else {
				style = "width: auto; height: 80%; margin-top: 10%;";
			}
		}
		document.getElementById("itemPic").src = "images/" + data.thumbnail + ".png" || "iamges/outfit/unknown.png";
		document.getElementById("itemPic").style.cssText = style;
		image = null;
	}

	if (data.description != undefined) {document.getElementById("itemDesc").innerText = data.description;}

	var idSwitch = 0;

	var barList = getData(data, stats, ["weapon"]);
	var barContainer = document.getElementById("barContainer");
	for (let i = 0; i < barList.length; i++) {
		if (barList[i] == "break") {
			var line = document.createElement("div");
			line.style.cssText = "height: 1px; width: 70%; grid-column: 1 / 3; margin: 15px 0 15px 15%; border-bottom: 1px solid #444;";
			barContainer.appendChild(line);
		} else {
			barContainer.appendChild(createBar(barList[i][0], barList[i][1], barList[i][2], barList[i][3]));
		}
	}
}

function createBar(name, percent, value, flip, toolTip) {
	var valueNum = String(value);
	if (flip) {
		var color = 120 * ((100 - percent)/100);
	} else {
		var color = 120 * (percent/100);
	}

	valueNum = commafy(valueNum);

	var element = document.createElement("div");
	element.style.cssText = "display: block;";
	element.id = name;
	element.onmouseenter = function(event) {createTooltip(event, this.id);};
	element.onmouseleave = function() {destroyTooltip()};

	var label = document.createElement("p");
	label.innerHTML = name + '<span style="float: right; font-size: 18px; color: #9e9e9e;">' + valueNum + "</span>";
	label.style.cssText = "text-transform: capitalize; cursor: default;";

	var barContainer = document.createElement("div");
	barContainer.style.cssText = "position: relative; overflow: hidden; width: calc(100% - 2px); height: 10px; border-radius: 6px; margin: 0; border: 1px solid #444;";

	var bar = document.createElement("div");
	bar.style.cssText = "position: relative; bottom: 4px; width: calc(2px + ((100% - 2px) * " + (percent/100) + ")); border-radius: 5px; margin: 0; height: 20px; background-color: hsl(" + color + ", 70%, 50%);";

	barContainer.appendChild(bar);
	element.appendChild(label);
	element.appendChild(barContainer);

	return (element);
}

function getData(data, dataFormat, subTags) {
	var percent, flip, barName, barValue, toolTip;
	var subData = {};
	var barList = [];
	var lineBreak = false;

	for (let i in data) {
		if (typeof(data[i]) === "object" && subTags.indexOf(i) > -1) {
			for (let j in data[i]) {
				subData[j] = data[i][j];
			}
		} else {
			subData[i] = data[i];
		}
	}

	for (let i = 0; i < dataFormat[data.type].group.length; i++) {//loop though main list
		for (let j = 0; j < dataFormat[data.type].group[i].length; j++) {//loop through sub lists
			dataTag = dataFormat[data.type].group[i][j];
			if (dataTag in subData) {
				lineBreak = true;
				barName = dataTag.replace(/_/g, " ");
				barValue = subData[dataTag];
				//if (dataFormat[dataTag + "_operation"] == "flip") {barValue *= -1;}//Not used anymore?
				flip = dataFormat[data.type][dataTag] == "bad" ? true : false;
				percent = getPercent(dataFormat[data.type][dataTag + "_min"], dataFormat[data.type][dataTag + "_max"], barValue);
				barList.push([barName, percent * 100, subData[dataTag], flip, toolTip]);
			}
		}
		if (lineBreak){
			barList.push("break");//divider line (for looks and formatting)
			lineBreak = false;
		}
	}
	barList.splice(barList.length - 1);
	return (barList)
}