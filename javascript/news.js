$(window).ready(function() {
	$.get('https://api.github.com/repos/endless-sky/endless-sky/releases/latest', function(data) {
		$("#release").text(data.name);
		$("#latest").html(parseData(data.body));
	});
});

function parseData(data) {
	let i = 0;
	while (data.indexOf('![') > -1 && i < 10) {
		let subdata = data.substring(data.indexOf('!['), data.length);
		let link = subdata.substring(subdata.indexOf('!['), subdata.indexOf(')') + 1);
		let name = link.substring(link.indexOf('![') + 1, link.indexOf(']'));
		let href = link.substring(link.indexOf('(') + 1, link.indexOf(')'));
		data = data.replace(link, '<img src="' + href + '" default="' + name + '">');
		i++;
	}
	while (data.indexOf('[') > -1 && i < 10) {
		let subdata = data.substring(data.indexOf('['), data.length);
		let link = subdata.substring(subdata.indexOf('['), subdata.indexOf(')') + 1);
		let name = link.substring(link.indexOf('[') + 1, link.indexOf(']'));
		let href = link.substring(link.indexOf('(') + 1, link.indexOf(')'));
		data = data.replace(link, '<a href="' + href + '">' + name + "</a>");
		i++;
	}
	return data;
}