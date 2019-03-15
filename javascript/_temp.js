let fileCounter = 0;

dataHolder = {};

function filesToList() {
	var x = document.getElementById("fileInput");
	var data = [];
	var fileNames = [];
	for (let i = 0; i < x.files.length; i++) {
		var reader = new FileReader();
		reader.onload = function(file) {
			return function(event) {
				data.push(event.target.result);
				fileNames.push(file);
			}
		}(x.files[i].name);
		reader.onloadend = function() {
			fileCounter++;
			if (fileCounter == document.getElementById("fileInput").files.length) {
				//getDataMinMax(data);//set to function i'm using
				//parseDataToJSON(data);
				parseMissionsToJSON(data);
				//makeRelationList(data);
				//mergeObjects(data, fileNames);
			}
		}
		reader.readAsText(x.files[i]);
	}
}

function mergeObjects(data, names) {
	var object = {};
	for (let i = 0; i < data.length; i++) {
		object[names[i]] = JSON.parse(data[i]);
	}
	document.getElementById("display").innerText = JSON.stringify(object);
}

function makeRelationList(data) {
	var object = {};
	var temp;
	for (let i = 0; i < data.length; i++) {
		temp = JSON.parse(data[i]);
		item = temp.sprite.split("/")[1];
		object[item] = {};
		object[item].cost = temp.attributes.cost;
		object[item].category = temp.attributes.category;
	}
	document.getElementById("display").innerText = JSON.stringify(object);
}

function getDataMinMax(data) {
	for (let i = 0; i < data.length; i++) {
		data[i] = JSON.parse(data[i]);
	}
	for (let i = 0; i < data.length; i++) {
		for (key in data[i]) {
			if (key == "attributes") {
				for (subKey in data[i][key]) {
					if (!isNaN(data[i][key][subKey])) {
						if (subKey in dataHolder) {
							if (dataHolder[subKey + "_min"] > data[i][key][subKey]) {
								dataHolder[subKey + "_min"] = data[i][key][subKey];
							}
							if (dataHolder[subKey + "_max"] < data[i][key][subKey]) {
								dataHolder[subKey + "_max"] = data[i][key][subKey];
							}
						} else {
							dataHolder[subKey + "_min"] = data[i][key][subKey];
							dataHolder[subKey] = "good";
							dataHolder[subKey + "_max"] = data[i][key][subKey];
						}
					}
				}
			}


			if (!isNaN(data[i][key])) {
				if (key in dataHolder) {
					if (dataHolder[key + "_min"] > data[i][key]) {
						dataHolder[key + "_min"] = data[i][key];
					}
					if (dataHolder[key + "_max"] < data[i][key]) {
						dataHolder[key + "_max"] = data[i][key];
					}
				} else {
					dataHolder[key + "_min"] = data[i][key];
					dataHolder[key] = "bad";
					dataHolder[key + "_max"] = data[i][key];
				}
			}
		}
	}
	document.getElementById("display").innerText = JSON.stringify(dataHolder);
	console.log(dataHolder);
}

function parseDataToJSON(stringData) {
	var masterObject = {};
	for (let i = 0; i < stringData.length; i++) {
		var data = stringData[i].split("\n\n");
		for (let j = 0; j < data.length; j++) {//for each file
			var lines = removeBlanks(data[j].split("\n"));
			var newObject = createObject(lines, 0);

			//console.log(newObject);
			for (attribute in newObject[0]) {
				for (tag in newObject[0][attribute]) {
					//console.log(tag);
					if (tag == "name") {
						masterObject[newObject[0][attribute][tag]] = newObject[0];
						break;
					}
				}
			}
		}
	}
	//console.log(masterObject);
	document.getElementById("display").innerText = JSON.stringify(masterObject);
}

function createObject(lines, counter = 0, extraTabs = 0) {//currently when next line has fewer than -1 tabs not exiting object?
	let object = {};
	let data, tag, temp, name;
	while (counter < lines.length) {
		let sub = counter + 1 < lines.length ? lines[counter + 1].count("\t") : 999;//next line's tabs or 0 tabs for end of object
		switch (lines[counter].count("\t") - sub) {//difference in tabs
			case 0://next line has same tabs
				data = parseLine(lines[counter]);
				if (!object[data[0]]) {//attribute doesn't exist
					object[data[0]] = data[1];//create attribute
				} else {//attribute exists
					if (Array.isArray(object[data[0]])) {//attribute is list
						object[data[0]].push(data[1]);//add object to list
					} else {//attribute is not list
						object[data[0]] = [object[data[0]], data[1]];//make attribute a list and add new object to it
					}
				}
				break;
			case -1://next line has more tabs
				temp = lines[counter].split(" ");//check for name of object
				tag = temp[0].replaceAll("\t", "");//remove tabs
				if (temp[1]) {//if name exists add name attribute
					temp = temp.splice(1, temp.length - 1);
					name = temp.join(" ").replaceAll('"', "");
				}

				data = createObject(lines, counter + 1);//recursion to get nested objects
				if (name) {//if name isn't null or undefined
					data[0]["name"] = name;//name from before belongs to this object
					name = null;
				}

				if (!object[tag]) {//attribute (tag) doesn't exist
					object[tag] = data[0];
				} else {//attribute exists
					if (Array.isArray(object[tag])) {//attribute is list
						object[tag].push(data[0]);//add object to list
					} else {//attribute is not list
						object[tag] = [object[tag], data[0]];//make attribute a list and add new object to it
					}
				}

				//need to figure out if this is end of current object then return (don't change counter, return because need to exit object)
				counter = data[1];

				if (counter + 1 < lines.length) {
					//if (lines[counter].count("\t") > lines[counter + 1].count("\t") + 1) {
					if (data[2] > 0) {
						return ([object, counter, data[2] - 1]);
					}	
				}

				break;
			default://next line has fewer tabs (end of an object) returns to [case -1]
				data = parseLine(lines[counter]);
				if (!object[data[0]]) {//attribute doesn't exist
					object[data[0]] = data[1];//create attribute
				} else {//attribute exists
					if (Array.isArray(object[data[0]])) {//attribute is list
						object[data[0]].push(data[1]);//add object to list
					} else {//attribute is not list
						object[data[0]] = [object[data[0]], data[1]];//make attribute a list and add new object to it
					}
				}

				let subTabs = 0;
				if (counter + 1 < lines.length) {
					subTabs = lines[counter].count("\t") - lines[counter + 1].count("\t");
					subTabs--;
					if (subTabs < 0) {
						subTabs = 0
					}
				}

				return ([object, counter, subTabs]);
		}
		counter++;
	}
	return ([object, counter]);
}

function parseLine(line) {
	let tag, data, temp;
	line = line.replaceAll("\t", "");//remove all tabs
	if (line[0] == '"') {//if first non tab char is quote
		temp = line.split('"');
		tag = temp[1].replaceAll(" ", "_");
		temp = temp.splice(3, temp.length - 3);
		data = temp.join(" ");
	} else {
		temp = line.split(" ");
		tag = temp[0];
		temp = temp.splice(1, temp.length - 1)
		data = temp.join(" ").replaceAll('"', "");
	}
	return ([tag, data]);
}

function removeBlanks(data) {
	var newData = [];
	for (let j = 0; j < data.length; j++) {
		var temp = data[j].replaceAll("\t");
		if (temp != 0 && temp[0] != "\n" && temp[0] != "#") {
			newData.push(data[j]);
		}
	}
	return (newData);
}

window.onload = function() {
	document.getElementById("fileInput").onchange = function() {filesToList();}
}