Mouse = function () {
	this.x = 0;
	this.y = 0;
	this.prevX = 0;
	this.prevY = 0;
	this.canvasX = 0;
	this.canvasY = 0;
	this.isDown = false;
	this.systemHover = null;

	this.setPos = function (x, y) {
		this.prevX = this.x;
		this.prevY = this.y;
		this.x = x;
		this.y = y;
		this.canvasX = x - document.getElementById("mapCanvas").getBoundingClientRect().left;
		this.canvasY = y - document.getElementById("mapCanvas").getBoundingClientRect().top;
	}
}

System = function (system) {
	this.name = system.system.name;
	//this.subname = system.system.name || null;
	this.x = system.system.pos.split(" ")[0];
	this.y = system.system.pos.split(" ")[1];
	this.highlight = false;
	this.selected = false;
	this.canvasX = this.x;
	this.canvasY = this.y;
	this.government = system.system.government;
	if (system.system.link) {
		if (Array.isArray(system.system.link)) {
			this.links = system.system.link;
		} else {
			this.links = [system.system.link];
		}
	} else {
		this.links = [];
	}
	this.asteroids = system.system.asteroids;
	this.minables = system.system.mineables;
	this.trade = system.system.trade;
	this.objects = system.system.object;

	this.draw = function () {
		canvas.beginPath();
		this.canvasX = this.x/scale + scrollX/scale;
		this.canvasY = this.y/scale + scrollY/scale;
		if (this.selected) {
			canvas.strokeStyle = "#88bb88";
			canvas.arc(this.canvasX, this.canvasY, 5/scale, 0, 2 * Math.PI);
			canvas.stroke();
			canvas.strokeStyle = "#444444";
		} else if (this.highlight) {
			canvas.strokeStyle = "#aaaaaa";
			canvas.arc(this.canvasX, this.canvasY, 5/scale, 0, 2 * Math.PI);
			canvas.stroke();
			canvas.strokeStyle = "#444444";
		} else {
			canvas.arc(this.canvasX, this.canvasY, 5/scale, 0, 2 * Math.PI);
			canvas.stroke();
		}
	}
}

Label = function (label) {
	this.x = label.galaxy.pos.split(" ")[0];
	this.y = label.galaxy.pos.split(" ")[1];
	this.canvasX = this.x;
	this.canvasY = this.y;
	this.name = label.galaxy.name;
	this.img = new Image();
	this.img.src = "images/" + label.galaxy.sprite + "+.png";
	this.img.onload = function () {//get dimensions
		this.width = this.naturalWidth;
		this.height = this.naturalHeight;
	}

	this.draw = function () {
		this.canvasX = this.x/scale + scrollX/scale;
		this.canvasY = this.y/scale + scrollY/scale;
		canvas.drawImage(this.img, this.canvasX - this.img.width/(2*scale), this.canvasY - this.img.height/(2*scale), this.img.width/scale, this.img.height/scale);//not appearing
	}
}

var finalLinks = [];
var tradeMin = [145, 578, 227, 103, 615, 526, 911, 434, 188, 222];
var tradeMax = [458, 888, 730, 598, 1305, 920, 1508, 925, 589, 539];
var systems = {};
var labels = {};
var scale = 5;
var scrollX = 1750;
var scrollY = 1250;
var mouse = new Mouse();
var bgImage;

window.onload = function () {
	bgImage = document.getElementById("bgImage");
	getSystems();
	getLinks();
	render();
}

window.onmousemove = function (event) {
	mouse.setPos(event.clientX, event.clientY);
	if (mouse.isDown) {
		scrollX += (mouse.x - mouse.prevX) * scale;
		scrollY += (mouse.y - mouse.prevY) * scale;
		render();
	} else {
		let radius = 5/scale;
		let redraw = false;
		for (system in systems) {
			if (distance(mouse.canvasX, mouse.canvasY, systems[system].canvasX, systems[system].canvasY) <= radius + 3/(2 * scale)) {
				systems[system].highlight = true;
				mouse.systemHover = systems[system];
				redraw = true;
			} else {
				if (systems[system].highlight) {
					systems[system].highlight = false;
					redraw = true;
				}
			}
		}
		if (redraw) {
			render();
		}
	}
}

window.onclick = function () {
	let selectedSystem = mouse.systemHover;
	
	if (selectedSystem != null && selectedSystem.highlight) {
		for (system in systems) {
			systems[system].selected = false;
		}

		selectedSystem.selected = true;
		document.getElementById("infoName").innerText = selectedSystem.name;
		createSystemDisplay(selectedSystem);
		render();
	}
}

window.onmousedown = function (event) {
	mouse.isDown = true;
}

window.onmouseup = function (event) {
	mouse.isDown = false;
}

function getSystems() {
	//console.log(mapInfo);
	for (object in mapInfo) {
		if (mapInfo[object].system) {
			systems[mapInfo[object].system.name] = new System(mapInfo[object]);
		} else if (mapInfo[object].galaxy) {
			if (mapInfo[object].galaxy.sprite && mapInfo[object].galaxy.name != "Milky Way") {
				labels[mapInfo[object].galaxy.name] = new Label(mapInfo[object]);
			}
		}
	}
}

function getLinks() {
	for (system in systems) {
		if (systems[system].links) {
			for (let j = 0; j < systems[system].links.length; j++) {
				let link1 = [[systems[system].x, systems[system].y], [systems[systems[system].links[j]].x, systems[systems[system].links[j]].y]];
				let link2 = [[systems[systems[system].links[j]].x, systems[systems[system].links[j]].y], [systems[system].x, systems[system].y]];
				if (finalLinks.indexOf(link1) == -1 && finalLinks.indexOf(link2) == -1) {
					finalLinks.push(link1);
				}
			}
		}
	}
}

function zoom(event) {
	var zoom = event.deltaY/200;
	if (scale + zoom < 0.5) {zoom = 0.5 - scale;}
	if (scale + zoom > 10) {zoom = 10 - scale;}
	if (zoom != 0) {
		var posX = (mouse.canvasX * scale) - (scrollX - 1750);//Definitely correct position
		var newPosX = (mouse.canvasX * (scale + zoom)) - (scrollX - 1750);//Position without modification
		scrollX += newPosX - posX;//Take the difference

		var posY = (mouse.canvasY * scale) - (scrollY - 1750);//Definitely correct position
		var newPosY = (mouse.canvasY * (scale + zoom)) - (scrollY - 1750);
		scrollY += newPosY - posY;

		scale += zoom;
		render();
	}
	return false;//cancel scroll
}

function render() {
	clear();
	renderBackground();
	renderLabels();
	canvas.lineWidth = 3/scale;
	canvas.fillStyle = "#444444";
	canvas.strokeStyle = "#444444";
	renderSystems();
	canvas.lineWidth = 2/scale;
	renderLinks();
	if (15/scale > 6) {
		canvas.font = 15/scale + "px Ubuntu";
		canvas.fillStyle = "#888888";
		canvas.strokeStyle = "#888888";
		renderText();
	}
}

function renderBackground() {
	canvas.drawImage(bgImage, (scrollX - 1750)/scale, (scrollY - 1250)/scale, 3500/scale, 2500/scale);
}

function renderLabels() {
	for (label in labels) {
		//console.log(labels[label].img.height);
		labels[label].draw();
	}
}

function renderSystems() {
	for (system in systems) {
		systems[system].draw();
	}
}

function renderText() {
	for (system in systems) {
		canvas.beginPath();
		canvas.fillText(systems[system].name, systems[system].x/scale + scrollX/scale + 10/scale, systems[system].y/scale + scrollY/scale + 5/scale);
	}
}

function distance(x0, y0, x1, y1) {
	return (Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)));
}

function renderLinks() {
	let x0, y0, x1, y1, newX0, newY0, newX1, newY1;
	let dis = 10/scale;
	for (let i = 0; i < finalLinks.length; i++) {
		x0 = finalLinks[i][0][0]/scale + scrollX/scale;
		y0 = finalLinks[i][0][1]/scale + scrollY/scale;
		x1 = finalLinks[i][1][0]/scale + scrollX/scale;
		y1 = finalLinks[i][1][1]/scale + scrollY/scale;
		newX0 = dis * ((x1 - x0)/distance(x0, y0, x1, y1));
		newY0 = dis * ((y1 - y0)/distance(x0, y0, x1, y1));
		newX1 = dis * ((x0 - x1)/distance(x0, y0, x1, y1));
		newY1 = dis * ((y0 - y1)/distance(x0, y0, x1, y1));
		canvas.beginPath();
		canvas.moveTo(x0 + newX0, y0 + newY0);
		canvas.lineTo(x1 + newX1, y1 + newY1);
		canvas.stroke();
	}
}

function clear() {
	canvas.clearRect(0, 0, 700, 500);
}