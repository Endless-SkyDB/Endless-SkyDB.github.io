let missionDoubleWords = ["on offer", "on accept", "on complete", "on visit", "on fail", "to fail", "to offer"];
let missionBooleans = ["invisible", "landing", "fail", "accept", "decline"];
let missionChildren = ["label", "goto"];

function parseMissionsToJSON(stringData) {
	var masterObject = {};
	for (let i = 0; i < stringData.length; i++) {//for each file (as string)
		var data = stringData[i].split("\n\n");//split by mission
		for (let j = 0; j < data.length; j++) {//for each file
			var lines = removeBlanks(data[j].split("\n"));//remove returns (data is split by returns first)
			var newMission = createMission(lines, 0);//create mission json

			console.log(newMission[0]);

			masterObject[newMission.name] = newMission;//add mission to master object
		}
	}
	console.log(masterObject);
	//document.getElementById("display").innerText = JSON.stringify(masterObject);
}

function createMission(lines, counter = 0, extraTabs = 0) {
	let object = {};
	let data, tag, temp, name, value;
	while (counter < lines.length) {
		/*let sub = counter + 1 < lines.length ? lines[counter + 1].count("\t") : 999;//next line's tabs or 0 tabs for end of object
		switch (lines[counter].count("\t") - sub) {//difference in tabs
			case 0://next line has same tabs
				
				break;
			case -1://next line has more tabs
				createMission(lines, counter + 1);//recursion

				break;
			default://next line has fewer tabs (end of an object) returns to [case -1]

				break;
		}*/

		tag = lines[counter];//[var, var2] = parseMissionLine(lines[counter]);
		console.log(tag);
		if (missionChildren.indexOf(tag) > -1) {
			//object[tag] = getMissionChildren(lines, counter + 1);
			object = addAttributes(object, tag, getMissionChildren(lines, counter + 1));
		}


		counter++;
	}
	return ([object, counter]);
}

function getMissionChildren(lines, counter) {
	let tabNum = lines[counter].count("\t");
	let object = {};
	let tag, value;
	while (tabNum == lines[counter].count("\t")) {
		[tag, value] = parseMissionLine(lines[counter]);
		if (missionEndTags.indexOf(tag) > -1) {
			return (object);
		} else {
			object[tag] = value;
		}
		counter++;
	}
	return (object);
}

function addAttributes(object, tag, value) {//Pretty sure works as intended
	if (object[tag]) {
		if (Array.isArray(object[tag])) {
			object[tag].push(value);
		} else {
			object[tag] = [object[tag], value];
		}
	} else {
		object[tag] = value;
	}

	return (object);
}

function parseMissionLine(line) {//necessary?
	let tag, data, temp;
	line = line.replaceAll("\t", "");//remove all tabs


	if (missionDoubleWords.indexOf(line) > -1) {//mission tags with two words
		return ([line, false]);
	} else if (missionBooleans.indexOf(line) > -1) {//mission booleans (no value in source txt)
		return ([line, true]);
	} else if (false) {
		return (false);//do something else...? Forgot why I put this here...
	}


	/*if (line[0] == '"') {//if first non tab char is quote
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
	return ([tag, data]);*/
}