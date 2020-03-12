module.exports = {

	name: "Return to Action",

	section: "Other Stuff",

	author: "Jasper and Leon",

	version: "1.9.5",

	short_description: "Return to an action",

	subtitle: function(data) {
		return `Return to action ${typeof data.call === 'number' ? "#" : "" + data.call}`;
	},

	fields: ["call"],

	html: function(isEvent, data) {
		return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by Jasper and Leon!
		</p>
	</div><br>
	<div>
		<div id="varNameContainer" style="float: left; width: 60%;">
			Actions to Return:<br>
			<input id="call" class="round" type="text">
		</div>
	</div><br><br><br>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const val = this.evalMessage(data.call, cache);
		let index = cache.index - parseInt(val);
		if (index >= 0 && parseInt(val) > 1) {
			cache.index = index;
			this.callNextAction(cache);
		} else if (parseInt(val) <= 1) {
			console.error("Error! You can't return "+val+" action")
		} else if (isNaN(val)) {
			console.error("Error! You can't put the return value not equal to number");
		} else {
			console.error("Error! You can't return more than "+cache.index+" actions");
		}
	},

	mod: function(DBM) {
	}

};