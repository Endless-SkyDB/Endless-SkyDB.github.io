function createSystemDisplay(system) {
	document.getElementById("govValue").innerText = system.government;
	document.getElementById("miniMapCanvas").style.display = "inline-block";
	document.getElementById("govLabel").style.display = "inline-block";
	document.getElementById("secondBar").style.display = "inline-block";
	createTradeDisplay(system.trade);

	let radii = getMaxRadius(system.objects);
	let scale = 180/((radii[0] - radii[1])/2 + radii[1]);
	let add = (radii[0] - radii[1])/2 * scale * -1;
	miniCanvas.strokeStyle = "#444444";
	miniCanvas.lineWidth = 1.5;
	miniCanvas.clearRect(0, 0, 200, 200);
	createSystem(system.objects, scale, add);
}


//30-240 == orange-blue (hsv)
function createTradeDisplay(tradeData) {
	let infoDisplay = document.getElementById("info");
	infoDisplay.removeChildrenWithClass("tradeDisplay");

	for (let i = 0; i < tradeData.length; i++) {
		let tempData = tradeData[i].split(" ");
		let cost = tempData[tempData.length - 1];

		let percent = (tempData[tempData.length - 1] - tradeMin[i])/(tradeMax[i] - tradeMin[i]);
		let color = 240 - (210 * percent);

		let labelText = tempData[0];
		if (tempData.length > 2) {
			tempData.removeIndex(tempData.length - 1);
			labelText = tempData.join(" ");
		}

		let barLabel = document.createElement("p");
		barLabel.innerText = labelText;
		//barLabel.style.height = "18px";
		barLabel.classList.add("tradeDisplay");

		let costLabel = document.createElement("span");
		costLabel.innerText = commafy(cost);
		costLabel.style.cssText = "float: right; font-size: 18px; margin-right: 10px;";

		let barContainer = document.createElement("div");
		barContainer.style.cssText = "position: relative; overflow: hidden; width: calc(100% - 2px); height: 10px; border-radius: 6px; margin: 4px 0 4px 0; border: 1px solid #444;";
		barContainer.classList.add("tradeDisplay");

		let bar = document.createElement("div");
		bar.style.cssText = "position: relative; bottom: 4px; width: calc(2px + ((100% - 2px) * " + percent + ")); border-radius: 5px; margin: 0; height: 20px; background-color: hsl(" + color + ", 70%, 50%);";
		
		barLabel.appendChild(costLabel);
		barContainer.appendChild(bar);
		infoDisplay.insertBefore(barLabel, document.getElementById("miniMapCanvas"));//insert before (above) canvas (mini map)
		infoDisplay.insertBefore(barContainer, document.getElementById("miniMapCanvas"));
	}
}

function createSystem(objects, scale, add = 0) {//get largest orbit for scale
	//console.log(add);
	if (Array.isArray(objects)) {
		for (let i = 0; i < objects.length; i++) {//loop through each object
			if (objects[i].object) {//objects orbiting object
				createSystem(objects[i].object, scale, add + objects[i].distance * scale);
			}
			if (objects[i].distance) {
				miniCanvas.beginPath();
				miniCanvas.arc(100 + add/2, 100, objects[i].distance * scale/2, 0, 2 * Math.PI);//need to center system based on add amount
				miniCanvas.stroke();
			}
		}
	} else {
		if (objects.object) {//objects orbiting object
			createSystem(objects.object, scale, add + objects[i].distance * scale);
		}
		if (objects.distance) {
			miniCanvas.beginPath();
			miniCanvas.arc(100 + add/2, 100, objects.distance * scale/2, 0, 2 * Math.PI);//need to center system based on add amount
			miniCanvas.stroke();
		}
	}
}

function getMaxRadius(objects, add = 0) {//need to check object array AND object object
	let max = 0;
	let innerMax = 0;
	if (Array.isArray(objects)) {
		for (let i = 0; i < objects.length; i++) {
			if (objects[i].object) {//get highest distance child
				let recMax = getMaxRadius(objects[i].object, parseFloat(objects[i].distance));
				if (recMax > max) {
					max = recMax;
				}
			}
			if (parseFloat(objects[i].distance) + add > max) {
				max = parseFloat(objects[i].distance) + add;
			}
			if (parseFloat(objects[i].distance) > innerMax) {
				innerMax = parseFloat(objects[i].distance);
			}
		}
	} else {
		if (objects.object) {//get highest distance child
			let recMax = getMaxRadius(objects.object, parseFloat(objects.distance));
			if (recMax > max) {
				max = recMax;
			}
		}
		if (parseFloat(objects.distance) + add > max) {
			max = parseFloat(objects.distance) + add;
		}
		if (parseFloat(objects.distance) > innerMax) {
			innerMax = parseFloat(objects.distance);
		}
	}
	if (add != 0) {
		return max;
	} else {
		return ([max, innerMax]);
	}
}