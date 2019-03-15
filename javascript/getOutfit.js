function jsonParse(data) {
	let statsPath = this.slice(0, this.lastIndexOf("/")) + "/stats.json";
	jsonReq(statsPath, createItemDisplay.bind(null, data.thumbnail, data.description, data, "outfit"));
	//createItemDisplay is a callback, .bind inserts arguments before arguments given when called back
}