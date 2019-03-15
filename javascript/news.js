$(window).ready(function() {
	$.get('https://api.github.com/repos/endless-sky/endless-sky/releases/latest', function(data) {
		console.log(data.body);
	});
});