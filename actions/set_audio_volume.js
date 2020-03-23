module.exports = {

	name: "Set Audio Volume",

	section: "Audio Control",

	subtitle: function(data) {
		return `Set Volume to ${data.volume}`;
	},

	fields: ["type", "volume"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Volume Type:<br>
			<select id="type" class="round">
				<option value="0" selected>Decibels (db)</option>
				<option value="1">Perceived</option>
				<option value="2">Default</option>
			</select>
		</div>
		<div style="float: left; width: 80%;">
			Volume (0 = min; 100 = max):<br>
			<input id="volume" class="round" value="50">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = cache.server;
		if (!server) {
			this.callNextAction(cache);
			return;
		}
		const options = {}
		switch (parseInt(data.type)) {
			case 0:
				options.type = "db";
				options.volume = parseInt(this.evalMessage(data.volume, cache));
				break;
			case 1:
				options.type = "perceived";
				options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
				break;
			case 2:
				options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
				break;
		}
		Audio.setVolume(options, server.id)
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};