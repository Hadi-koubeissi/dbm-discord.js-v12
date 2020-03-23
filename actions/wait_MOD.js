module.exports = {

	name: "Wait",

	section: "Other Stuff",

	subtitle: function(data) {
		const measurements = ['Miliseconds', 'Seconds', 'Minutes', 'Hours'];
		return `${measurements[0]}`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	fields: ["miliseconds", "seconds", "minutes", "hours", "days"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 30%;">
			Miliseconds:<br>
			<input id="miliseconds" class="round" type="text"><br>
			Seconds:<br>
			<input id="seconds" class="round" type="text"><br>
			Minutes:<br>
			<input id="minutes" class="round" type="text"><br>
			Hours:<br>
			<input id="hours" class="round" type="text"><br>
			Days:<br>
			<input id="days" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const ms = parseInt(data.miliseconds);
		const s = parseInt(data.seconds);
		const mins = parseInt(data.minutes);
		const hrs = parseInt(data.hours);
		const days = parseInt(data.days);
		let time = 0
		if (isNaN(ms) == false) {
			time = time + ms;
		}
		if (isNaN(s) == false) {
			time = time + s * 1000;
		}
		if (isNaN(mins) == false) {
			time = time + mins * 60000;
		}
		if (isNaN(hrs) == false) {
			time = time + hrs * 3600000;
		}
		if (isNaN(days) == false) {
			time = time + days * 86400000;
		}
		if (time != 0) {
			setTimeout(this.callNextAction.bind(this, cache), time);
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function(DBM) {
	}

};