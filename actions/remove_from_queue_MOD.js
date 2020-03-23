module.exports = {

	name: "Remove from Queue MOD",

	section: "Audio Control",

	subtitle: function(data) {
		return `Remove ${data.amount} Song`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	fields: ["server", "varName", "position", "amount"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source Server:<br>
			<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
				${data.servers[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 47%;">
			Position:<br>
			<input id="position" type="text" class="round" placeholder="Position start from 0">
		</div>
		<div style="float: left; padding-left: 3px; width: 50%;">
			Remove Amount:<br>
			<input id="amount" type="text" class="round" placeholder="Input must be great than 0">
		</div>
	</div>`
	},

	init: function () {
		const { glob, document } = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer')
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const targetServer = this.getServer(server, varName, cache);
		if (!targetServer) {
			this.callNextAction(cache);
			return;
		}
		const position = parseInt(this.evalMessage(data.position, cache));
		const amount = parseInt(this.evalMessage(data.amount, cache));
		const options = {};
		options.from = position;
		options.amount = amount;
		Audio.removeFromQueue(options, targetServer.id)
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};