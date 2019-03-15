function searchMap(str, key, index = true) {
	for (let i = 0; i < map.length; i++) {
		if (str == map[i][key]) {
			if (index) {
				return (i)
			}
			else {
				return (map[i])
			}
		}
	}
	return (false)
}

function findString(str) {
	if (str == "") {createDiv([]); return}//clear div if search is empty
	str = str.toLowerCase();
	let matches = [];
	var index = 0;
	for (let i = 0; i < map.length; i++) {
		index = map[i].lower.search(str);
		if (index >= 0) {
			matches.push({ind:index, name:map[i].upper});
		}
	}
	matches = matches.sort(function(a, b){return a.ind-b.ind}).slice(0, 10);
	createDiv(matches);
}

function createDiv(links) {
	let searchDiv = document.getElementById("search");
	len = searchDiv.childNodes.length;
	for (let i = 0; i < len; i++) {
		searchDiv.removeChild(searchDiv.childNodes[0]);
	}
	for (let i = 0; i < links.length; i++) {
		let index = searchMap(links[i].name, "upper");
		let type = map[index].path.split("/")[0];
		let link = '/' + type + '.html?';

		if (type == "outfits" || type == "ships") {
			type = type.slice(0, type.length - 1);
		}

		link += type + "=" + map[index].lower.replace(/ /g,"_");

		div = document.createElement("div");
		if (i == 0) {div.id = "enter"}
		div.style.cssText = "cursor: pointer; margin: 0; display: inline-block; padding: 0.4em 0.4em 0.4em 0.4em; width: 283px; border-bottom: 1px solid #222222;";
		div.className = "hover";
		div.onclick = function() {window.location.href=link;};
		if (i == links.length - 1) {div.style.cssText = div.style.cssText + "border: unset;"}
		div.innerHTML = '<span style="float: left; font-size: 16px; color: #d4d4d4;">' + map[index].upper + '</span><span style="float: right; font-size: 16px; text-transform: capitalize; color: #666666;">' + type + '</span>';

		searchDiv.appendChild(div);
	}
}

function startSearch() {
	if (event.keyCode == 13) {
		document.getElementById("enter").onclick();
	}
}