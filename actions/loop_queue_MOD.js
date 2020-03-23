module.exports = {

	name: "Loop Queue",

	section: "Audio Control",

	subtitle: function(data) {
		const actions = ["Start Loop Current Item", "Stop Loop Current Item", "Start Loop Whole Queue", "Stop Loop Whole Queue"];
		return `${actions[parseInt(data.loop)]}`;
	},

	fields: ["loop"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: right; width: 50%; padding-top: 8px;">
			Loop Operation:<br>
			<select id="loop" class="round">
				<option value="0" selected>Start Loop Current Item</option>
				<option value="1">Stop Loop Current Item</option>
				<option value="2">Start Loop Whole Queue</option>
				<option value="3">Stop Loop Whole Queue</option>
			</select><br>
		</div>
	</div>`;
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = cache.server;
		const loop = parseInt(data.loop);

		switch(loop) {
			case 0:
				Audio.loop[server.id] = "item";
				break;
			case 1:
			case 3:
				Audio.loop[server.id] = false;
				break;
			case 2:
				Audio.loop[server.id] = "queue";
				break;
		};

		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};